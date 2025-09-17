import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/web";
import { useAccount, useChainId, useWalletClient, usePublicClient } from "wagmi";
import { getAddress } from "viem";
import type { Address, TypedData, TypedDataDomain } from "viem";

type Option = { index: number; label: string };

const CONTRACT_ADDRESS_ENV = import.meta.env.VITE_PRIVATE_VOTE_ADDRESS as string | undefined;

function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [contractAddress, setContractAddress] = useState<string>(CONTRACT_ADDRESS_ENV || "");
  const [options] = useState<Option[]>([
    { index: 0, label: "Strong price surge right after TGE" },
    { index: 1, label: "Gradual long term growth driven by adoption" },
    { index: 2, label: "Highly volatile but still attractive" },
    { index: 3, label: "Uncertain — will wait and see direction" },
  ]);
  const [status, setStatus] = useState<string>("");
  const [tallies, setTallies] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const canUseSepolia = chainId === 11155111;

  // Create relayer instance on demand to avoid initializing at render time

  const voters = useMemo(() => (tallies ? tallies.reduce((a, b) => a + b, 0) : 0), [tallies]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <span>🟡</span>
          <span>PrivateVote</span>
          <span className="tag">FHEVM</span>
        </div>
        <ConnectButton />
      </div>

      <div className="title">Private Voting</div>
      <div className="subtitle">Powered by Zama FHEVM — vote confidentially with on-chain encrypted inputs.</div>
      <div className="contract">
        Contract: <code>{contractAddress || "(paste address below)"}</code>
      </div>

      <div className="tabs">
        <div className="tab active">All (1)</div>
        <div className="tab">Upcoming (0)</div>
        <div className="tab">Active (1)</div>
        <div className="tab">Past (0)</div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ fontWeight: 800 }}>Zama TGE — What’s Your Expectation?</div>
          <div className="pill">Active</div>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>
          Choose the option that best matches your view. Your vote is fully encrypted on-chain.
        </div>

        <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 12 }}>VOTING OPTIONS ({options.length})</div>
        <div className="options">
          {options.map((o) => (
            <div
              key={o.index}
              className="option"
              style={{ borderColor: selected === o.index ? "var(--yellow)" : "var(--border)" }}
              onClick={() => setSelected(o.index)}
            >
              <input type="radio" checked={selected === o.index} readOnly />
              <div>{o.label}</div>
            </div>
          ))}
        </div>

        <div className="footer">
          <div>{voters} voters</div>
          <div>
            <button
              className="btn-outline"
              style={{ marginRight: 8 }}
              disabled={!isConnected || !contractAddress}
              onClick={async () => {
                try {
                  if (!walletClient) throw new Error("No wallet client");
                  setStatus("Fetching & decrypting tallies (user decrypt)...");
                  const inst = await createInstance(SepoliaConfig);
                  const user = getAddress(address as Address);

                  // 1) Fetch handles
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
                  const handles: `0x${string}`[] = [];
                  for (let i = 0; i < n; i++) {
                    const handle = (await publicClient!.readContract({
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
                    })) as `0x${string}`;
                    handles.push(handle);
                  }

                  // 2) Generate keypair and build typed data
                  const { publicKey, privateKey } = inst.generateKeypair();
                  const start = Math.floor(Date.now() / 1000);
                  const days = 30;
                  const typed = inst.createEIP712(publicKey, [contractAddress], start, days);

                  // 3) Sign EIP712 with the connected wallet
                  // Types from SDK may not perfectly match viem generics, use minimal casts
                  const signature = await walletClient.signTypedData({
                    account: user,
                    domain: typed.domain as unknown as TypedDataDomain,
                    types: typed.types as unknown as TypedData,
                    primaryType: typed.primaryType as unknown as string,
                    message: typed.message as unknown as Record<string, unknown>,
                  });

                  // 4) Request user decrypt from relayer
                  const pairs = handles.map((h) => ({
                    handle: h as string,
                    contractAddress: contractAddress as string,
                  }));
                  const dec = await inst.userDecrypt(
                    pairs,
                    privateKey,
                    publicKey,
                    signature,
                    [contractAddress],
                    user,
                    start,
                    days,
                  );

                  // 5) Map results back to array order
                  const values: number[] = handles.map((h) => {
                    const v = dec[h as string] as bigint | undefined;
                    return v ? Number(v) : 0;
                  });

                  setTallies(values);
                  setStatus("Tallies updated");
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : String(e);
                  setStatus(msg);
                }
              }}
            >
              Decrypt
            </button>
            <button
              className="btn-secondary"
              disabled={!isConnected || !contractAddress}
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
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : String(e);
                  setStatus(msg);
                }
              }}
            >
              Grant Read Access
            </button>
            <button
              style={{ marginLeft: 8 }}
              disabled={!isConnected || !canUseSepolia || !contractAddress || selected === null}
              onClick={async () => {
                try {
                  if (selected === null) return;
                  setStatus("Encrypting & sending vote...");
                  const inst = await createInstance(SepoliaConfig);
                  const user = getAddress(address as Address);
                  const enc = await inst
                    .createEncryptedInput(contractAddress as Address, user)
                    .add32(selected)
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
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : String(e);
                  setStatus(msg);
                }
              }}
            >
              Vote Now
            </button>
          </div>
        </div>

        {tallies && (
          <div style={{ marginTop: 12 }}>
            <div className="progress">
              <div className="bar" style={{ width: `${voters > 0 ? (Math.max(...tallies) / voters) * 100 : 0}%` }} />
            </div>
            <div className="footer">
              <div style={{ color: "var(--muted)" }}>Voting Active</div>
              <div style={{ color: "var(--muted)" }}>Time Progress: —</div>
            </div>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>
              {tallies.map((v, i) => (
                <span key={i} style={{ marginRight: 12 }}>
                  {i + 1}. {v} vote{v !== 1 ? "s" : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ color: "#aaa", marginTop: 8 }}>{!canUseSepolia && "กรุณาเชื่อมต่อเครือข่าย Sepolia"}</div>
        <div style={{ marginTop: 6, color: "var(--muted)" }}>{status}</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Contract Address
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x... PrivateVote"
            style={{ width: "100%" }}
          />
        </label>
      </div>
    </div>
  );
}

export default App;
