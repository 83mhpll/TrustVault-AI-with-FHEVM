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

  // Rating item to interact with and factory to create new items
  const [ratingItemAddress, setRatingItemAddress] = useState<string>(CONTRACT_ADDRESS_ENV || "");
  const [factoryAddress, setFactoryAddress] = useState<string>("");
  const [options] = useState<Option[]>([
    { index: 1, label: "⭐️ Very Poor" },
    { index: 2, label: "⭐️⭐️ Poor" },
    { index: 3, label: "⭐️⭐️⭐️ Average" },
    { index: 4, label: "⭐️⭐️⭐️⭐️ Good" },
    { index: 5, label: "⭐️⭐️⭐️⭐️⭐️ Excellent" },
  ]);
  const [status, setStatus] = useState<string>("");
  const [tallies, setTallies] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);
  const addOption = () => setNewOptions((o) => (o.length < 8 ? [...o, ""] : o));
  const updateOption = (i: number, v: string) => setNewOptions((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  const canUseSepolia = chainId === 11155111;

  // Create relayer instance on demand to avoid initializing at render time

  const voters = useMemo(() => (tallies ? tallies.reduce((a, b) => a + b, 0) : 0), [tallies]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="navtitle">🟡 Private AI Rating Board</div>
        <div className="nav">
          <a>All Items</a>
          <a>Create Item</a>
          <a>Decrypt Results</a>
        </div>
        <div style={{ marginTop: 16 }}>
          <ConnectButton />
        </div>
      </aside>
      <main className="content">
        <div className="container">
          <div className="hero">
            <div className="title">Private AI Rating</div>
            <div className="subtitle">Give confidential ratings (1–5). Sum and count are encrypted on-chain; averages are revealed via user decrypt.</div>
            <div className="contract">
              Rating Item: <code>{ratingItemAddress || "(paste rating item address)"}</code>
            </div>
          </div>

          <div className="tabs">
            <div className="tab active">All (1)</div>
            <div className="tab">Upcoming (0)</div>
            <div className="tab">Active (1)</div>
            <div className="tab">Past (0)</div>
      </div>

          <div className="card">
        <div className="card-header">
              <div style={{ fontWeight: 800 }}>Rate this AI Model</div>
          <div className="pill">Active</div>
        </div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>Choose a score from 1 to 5. Your rating is fully encrypted on-chain.</div>

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
              disabled={!isConnected || !ratingItemAddress}
              onClick={async () => {
                try {
                  if (!walletClient) throw new Error("No wallet client");
                  setStatus("Decrypting sum & count (user decrypt)...");
                  const inst = await createInstance(SepoliaConfig);
                  const user = getAddress(address as Address);
                  // 1) Generate keypair and build typed data
                  const { publicKey, privateKey } = inst.generateKeypair();
                  const start = Math.floor(Date.now() / 1000);
                  const days = 30;
                  const typed = inst.createEIP712(publicKey, [ratingItemAddress], start, days);

                  // 2) Sign EIP712 with the connected wallet
                  // Types from SDK may not perfectly match viem generics, use minimal casts
                  const signature = await walletClient.signTypedData({
                    account: user,
                    domain: typed.domain as unknown as TypedDataDomain,
                    types: typed.types as unknown as TypedData,
                    primaryType: typed.primaryType as unknown as string,
                    message: typed.message as unknown as Record<string, unknown>,
                  });

                  // 3) Read handles (sum/count)
                  const sumH = (await publicClient!.readContract({
                    abi: [
                      { type: "function", name: "getSum", stateMutability: "view", inputs: [], outputs: [{ type: "bytes32" }] },
                    ],
                    address: ratingItemAddress as Address,
                    functionName: "getSum",
                  })) as `0x${string}`;
                  const countH = (await publicClient!.readContract({
                    abi: [
                      { type: "function", name: "getCount", stateMutability: "view", inputs: [], outputs: [{ type: "bytes32" }] },
                    ],
                    address: ratingItemAddress as Address,
                    functionName: "getCount",
                  })) as `0x${string}`;

                  const pairs = [
                    { handle: sumH as string, contractAddress: ratingItemAddress as string },
                    { handle: countH as string, contractAddress: ratingItemAddress as string },
                  ];
                  const dec = await inst.userDecrypt(
                    pairs,
                    privateKey,
                    publicKey,
                    signature,
                    [ratingItemAddress],
                    user,
                    start,
                    days,
                  );

                  const sum = Number(dec[sumH as string] || 0n);
                  const count = Number(dec[countH as string] || 0n);
                  const avg = count === 0 ? 0 : sum / count;
                  setTallies([sum, count, avg]);
                  setStatus(`sum=${sum} count=${count} avg=${avg}`);
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
              disabled={!isConnected || !ratingItemAddress}
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
                    address: ratingItemAddress as Address,
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
              disabled={!isConnected || !canUseSepolia || !ratingItemAddress || selected === null}
              onClick={async () => {
                try {
                  if (selected === null) return;
                  setStatus("Encrypting & sending rating...");
                  const inst = await createInstance(SepoliaConfig);
                  const user = getAddress(address as Address);
                  const enc = await inst
                    .createEncryptedInput(ratingItemAddress as Address, user)
                    .add32(selected)
                    .encrypt();

                  if (!walletClient) throw new Error("No wallet client");
                  const data = {
                    abi: [
                      {
                        type: "function",
                        name: "rate",
                        stateMutability: "nonpayable",
                        inputs: [
                          { name: "inputScore", type: "bytes32" },
                          { name: "inputProof", type: "bytes" },
                        ],
                        outputs: [],
                      },
                    ],
                    functionName: "rate" as const,
                    address: ratingItemAddress as Address,
                    args: [enc.handles[0], enc.inputProof],
                  };
                  const hash = await walletClient.writeContract(data);
                  setStatus(`Rating tx sent: ${hash}`);
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : String(e);
                  setStatus(msg);
                }
              }}
            >
              Rate Now
            </button>
          </div>
        </div>

        {tallies && (
          <div style={{ marginTop: 12 }}>
            <div className="progress">
              <div className="bar" style={{ width: `${tallies[2] ? Math.min(100, (tallies[2] / 5) * 100) : 0}%` }} />
            </div>
            <div className="footer">
              <div style={{ color: "var(--muted)" }}>Average</div>
              <div style={{ color: "var(--muted)" }}>{tallies[2] || 0}/5</div>
            </div>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>
              sum={tallies[0] || 0} • count={tallies[1] || 0}
            </div>
          </div>
        )}

        <div style={{ color: "#aaa", marginTop: 8 }}>{!canUseSepolia && "กรุณาเชื่อมต่อเครือข่าย Sepolia"}</div>
        <div style={{ marginTop: 6, color: "var(--muted)" }}>{status}</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Create Rating Item</div>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Rating Item Address
            <input value={ratingItemAddress} onChange={(e) => setRatingItemAddress(e.target.value)} placeholder="0x... RatingItem" style={{ width: "100%" }} />
          </label>
          <label>
            Rating Factory Address
            <input value={factoryAddress} onChange={(e) => setFactoryAddress(e.target.value)} placeholder="0x... RatingFactory" style={{ width: "100%" }} />
          </label>
          <label>
            Name
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Model name or item title"
              style={{ width: "100%" }}
            />
          </label>
          <div>Score bounds (default 1..5)</div>
          <div>
            <button
              disabled={!isConnected}
              onClick={async () => {
                try {
                  if (!walletClient) throw new Error("No wallet client");
                  setStatus("Creating item...");
                  const hash = await walletClient.writeContract({
                    abi: [
                      {
                        type: "function",
                        name: "createItem",
                        stateMutability: "nonpayable",
                        inputs: [
                          { name: "name", type: "string" },
                          { name: "description", type: "string" },
                          { name: "minScore", type: "uint8" },
                          { name: "maxScore", type: "uint8" },
                        ],
                        outputs: [{ type: "address" }, { type: "uint256" }],
                      },
                    ],
                    address: (factoryAddress || ratingItemAddress) as Address,
                    functionName: "createItem",
                    args: [question, "", 1, 5],
                  });
                  setStatus(`Item creation tx: ${hash}`);
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : String(e);
                  setStatus(msg);
                }
              }}
            >
              Create Item
        </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
