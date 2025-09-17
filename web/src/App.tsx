import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/web";
import { useAccount, useChainId, useWalletClient, usePublicClient } from "wagmi";
import { getAddress } from "viem";
import type { Address } from "viem";

type Option = { index: number; label: string };

const CONTRACT_ADDRESS_ENV = import.meta.env.VITE_PRIVATE_VOTE_ADDRESS as string | undefined;

function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [contractAddress, setContractAddress] = useState<string>(CONTRACT_ADDRESS_ENV || "");
  const [options] = useState<Option[]>([
    { index: 0, label: "Option A" },
    { index: 1, label: "Option B" },
    { index: 2, label: "Option C" },
  ]);
  const [status, setStatus] = useState<string>("");
  const [tallies, setTallies] = useState<number[] | null>(null);

  const canUseSepolia = chainId === 11155111;

  // Create relayer instance on demand to avoid initializing at render time

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>PrivateVote (FHEVM)</h1>
        <ConnectButton />
      </div>

      <div className="card" style={{ gap: 12 }}>
        <label>
          Contract Address
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x... PrivateVote"
            style={{ width: "100%" }}
          />
        </label>

        <div>
          <strong>Vote options</strong>
          <ul>
            {options.map((o) => (
              <li key={o.index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  disabled={!isConnected || !canUseSepolia || !contractAddress}
                  onClick={async () => {
                    try {
                      setStatus("Encrypting & sending vote...");
                      const inst = await createInstance(SepoliaConfig);
                      const user = getAddress(address as Address);
                      const enc = await inst
                        .createEncryptedInput(contractAddress as Address, user)
                        .add32(o.index)
                        .encrypt();

                      if (!walletClient) throw new Error("No wallet client");
                      const data = {
                        abi: [
                          {
                            type: "function",
                            name: "vote",
                            stateMutability: "nonpayable",
                            inputs: [
                              { name: "inputChoice", type: "bytes32" },
                              { name: "inputProof", type: "bytes" },
                            ],
                            outputs: [],
                          },
                        ],
                        functionName: "vote" as const,
                        address: contractAddress as Address,
                        args: [enc.handles[0], enc.inputProof],
                      };
                      const hash = await walletClient.writeContract(data);
                      setStatus(`Tx sent: ${hash}`);
                    } catch (e: any) {
                      setStatus(e.message || String(e));
                    }
                  }}
                >
                  Vote
                </button>
                <span>{o.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            disabled={!isConnected || !canUseSepolia || !contractAddress}
            onClick={async () => {
              try {
                setStatus("Fetching & decrypting tallies...");
                const inst = await createInstance(SepoliaConfig);
                const user = getAddress(address as Address);
                // call numOptions()
                const numOptionsHex = await publicClient!.readContract({
                  abi: [
                    {
                      type: "function",
                      name: "numOptions",
                      stateMutability: "view",
                      inputs: [],
                      outputs: [{ type: "uint8" }],
                    },
                  ],
                  address: contractAddress as Address,
                  functionName: "numOptions",
                });
                const n = Number(numOptionsHex);
                const results: number[] = [];
                for (let i = 0; i < n; i++) {
                  const handle = await publicClient!.readContract({
                    abi: [
                      {
                        type: "function",
                        name: "getTally",
                        stateMutability: "view",
                        inputs: [{ name: "index", type: "uint8" }],
                        outputs: [{ type: "bytes32" }],
                      },
                    ],
                    address: contractAddress as Address,
                    functionName: "getTally",
                    args: [i],
                  });
                  if (handle === "0x" + "0".repeat(64)) {
                    results.push(0);
                  } else {
                    // Try public decrypt via relayer SDK
                    const dec = await inst.publicDecrypt([handle as `0x${string}`]);
                    const value = Number(Object.values(dec)[0] as bigint);
                    results.push(value);
                  }
                }
                setTallies(results);
                setStatus("Tallies updated");
              } catch (e: any) {
                setStatus(e.message || String(e));
              }
            }}
          >
            Decrypt tallies
          </button>
          <button
            disabled={!isConnected || !contractAddress}
            style={{ marginLeft: 8 }}
            onClick={async () => {
              try {
                if (!walletClient) throw new Error("No wallet client");
                setStatus("Granting read access to your address...");
                const hash = await walletClient.writeContract({
                  abi: [
                    {
                      type: "function",
                      name: "allowAllTo",
                      stateMutability: "nonpayable",
                      inputs: [{ name: "reader", type: "address" }],
                      outputs: [],
                    },
                  ],
                  address: contractAddress as Address,
                  functionName: "allowAllTo",
                  args: [getAddress(address as Address)],
                });
                setStatus(`Access granted. Tx: ${hash}`);
              } catch (e: any) {
                setStatus(e.message || String(e));
              }
            }}
          >
            Grant Read Access
          </button>
        </div>

        {tallies && (
          <div>
            <strong>Current tallies</strong>
            <ul>
              {tallies.map((v, i) => (
                <li key={i}>
                  {i}: {v}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ color: "#aaa" }}>{!canUseSepolia && "กรุณาเชื่อมต่อเครือข่าย Sepolia"}</div>
        <div>{status}</div>
      </div>
    </>
  );
}

export default App;
