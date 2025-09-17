import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "./Logo";
import { useEffect, useMemo, useState } from "react";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/web";
import { useAccount, useChainId, useWalletClient, usePublicClient } from "wagmi";
import { getAddress } from "viem";
import type { Address } from "viem";

type Option = { index: number; label: string };

const CONTRACT_ADDRESS_ENV = import.meta.env.VITE_PRIVATE_VOTE_ADDRESS as string | undefined;
const FACTORY_ADDRESS_ENV = import.meta.env.VITE_RATING_FACTORY_ADDRESS as string | undefined;
const FAUCET_URL =
  (import.meta.env.VITE_SEPOLIA_FAUCET_URL as string | undefined) || "https://www.alchemy.com/faucets/ethereum-sepolia";

function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Rating item to interact with and factory to create new items
  const [ratingItemAddress, setRatingItemAddress] = useState<string>(CONTRACT_ADDRESS_ENV || "");
  const [factoryAddress, setFactoryAddress] = useState<string>(FACTORY_ADDRESS_ENV || "");
  const [options] = useState<Option[]>([
    { index: 1, label: "Very Poor" },
    { index: 2, label: "Poor" },
    { index: 3, label: "Average" },
    { index: 4, label: "Good" },
    { index: 5, label: "Excellent" },
  ]);
  const [status, setStatus] = useState<string>("");
  const [selected, setSelected] = useState<number | null>(null);
  const [isGranting, setIsGranting] = useState<boolean>(false);
  const [hasGranted, setHasGranted] = useState<boolean>(false);
  // Tabs, Leaderboard, Top Models (mock)
  const [leaderboardScope, setLeaderboardScope] = useState<"week" | "all">("week");
  // color palette (kept for future chart styles)
  const mockSeries = useMemo(() => {
    const days = 12;
    const cats = 5;
    const data: number[][] = [];
    for (let d = 0; d < days; d++) {
      const row: number[] = [];
      for (let c = 0; c < cats; c++) {
        const base = leaderboardScope === "week" ? 4 : 7;
        row.push(Math.max(1, Math.round(Math.random() * base + d)));
      }
      data.push(row);
    }
    return data;
  }, [leaderboardScope]);
  const [lbData, setLbData] = useState<number[][]>([]);
  useEffect(() => {
    setLbData(mockSeries);
  }, [mockSeries]);
  // day labels reserved for future time-series chart
  // optional lists removed for now
  type CatalogModel = { name: string; tags?: string[]; url?: string; address?: string };
  const MODELS_URL = (import.meta.env.VITE_MODELS_URL as string | undefined) || "/models.json";
  const [catalog, setCatalog] = useState<CatalogModel[]>([]);
  const [catalogTab, setCatalogTab] = useState<"trending" | "top" | "most">("trending");
  const [catalogQuery, setCatalogQuery] = useState<string>("");
  const [rateQuery, setRateQuery] = useState<string>("");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(MODELS_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as CatalogModel[];
        if (alive) setCatalog(data);
      } catch {
        const fallback: CatalogModel[] = [
          { name: "OpenAI GPT-4.1 Mini", tags: ["general"] },
          { name: "Anthropic Claude Sonnet 4", tags: ["general"] },
          { name: "Google Gemini 2.5 Pro", tags: ["general"] },
          { name: "Google Gemini 2.5 Flash", tags: ["general"] },
          { name: "DeepSeek V3.1", tags: ["coding"] },
          { name: "Grok Code Fast 1", tags: ["coding"] },
          { name: "Sonoma Sky Alpha", tags: ["general"] },
          { name: "Gemini 2.0 Flash", tags: ["general"] },
          { name: "DeepSeek V3 0324", tags: ["coding"] },
          { name: "GPT-5 (preview)", tags: ["general"] },
        ];
        if (alive) setCatalog(fallback);
      }
    })();
    return () => {
      alive = false;
    };
  }, [MODELS_URL]);
  const filteredCatalog = useMemo(() => {
    const q = catalogQuery.toLowerCase();
    let base = catalog.filter((m) => m.name.toLowerCase().includes(q));
    const score = (name: string) => name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    if (catalogTab === "trending") base = base.sort((a, b) => (score(b.name) % 97) - (score(a.name) % 97));
    if (catalogTab === "top") base = base.sort((a, b) => a.name.localeCompare(b.name));
    if (catalogTab === "most") base = base.sort((a, b) => (score(b.name) % 137) - (score(a.name) % 137));
    return base;
  }, [catalog, catalogQuery, catalogTab]);
  const rateSuggestions = useMemo(() => {
    const q = rateQuery.trim().toLowerCase();
    if (!q || q.startsWith("0x")) return [] as CatalogModel[];
    return catalog.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 6);
  }, [catalog, rateQuery]);
  const [newTags, setNewTags] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  const canUseSepolia = chainId === 11155111;

  // Create relayer instance on demand to avoid initializing at render time

  const voters = useMemo(() => lbData.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0), [lbData]);

  const friendlyError = (e: unknown): string => {
    const msg = e instanceof Error ? e.message : String(e);
    if (/User rejected/i.test(msg)) return ""; // do not show reject errors in UI
    return msg;
  };

  useEffect(() => {
    // Load local granted state per user+item+chain
    try {
      if (!address || !ratingItemAddress || !chainId) return;
      const key = `grant:${chainId}:${ratingItemAddress}:${address}`;
      const v = localStorage.getItem(key);
      setHasGranted(v === "1");
    } catch {
      // ignore
    }
  }, [address, ratingItemAddress, chainId]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={22} />
          <div className="navtitle">AI Rating Board</div>
        </div>
        {/* top nav links removed per request */}
        <div className="wallet">
          <ConnectButton />
        </div>
      </aside>
      <main className="content">
        <div className="container">
          <div className="hero hero-yellow">
            <div className="title">AI Rating Board</div>
            <div className="subtitle">
              Rate AI models privately with Zama FHEVM. Pick a model, choose 1–5 stars, and confirm in your wallet on
              Sepolia. Only aggregated averages can be revealed using your signature — individual votes remain
              confidential.
            </div>
          </div>

          <div className="tabs">
            <div className="tab active">All Items</div>
          </div>

          <div id="leaderboard" className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>Most Popular Models</div>
              <div className="lb-toolbar">
                <button
                  className={`lb-toggle ${leaderboardScope === "week" ? "active" : ""}`}
                  onClick={() => setLeaderboardScope("week")}
                >
                  Top this week
                </button>
                <button
                  className={`lb-toggle ${leaderboardScope === "all" ? "active" : ""}`}
                  onClick={() => setLeaderboardScope("all")}
                >
                  All time
                </button>
              </div>
            </div>
            <div className="list">
              {filteredCatalog.slice(0, 10).map((m, i) => (
                <div key={i} className="list-item">
                  <div className="list-item-name">
                    {i + 1}. {m.name}
                  </div>
                  <div className="chipbar">
                    {(m.tags || ["AI"]).map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>Model Catalog</div>
            </div>
            <div className="catalog-tools">
              <input
                className="search"
                placeholder="Search models…"
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
              />
              <div className="lb-toolbar">
                <button
                  className={`lb-toggle ${catalogTab === "trending" ? "active" : ""}`}
                  onClick={() => setCatalogTab("trending")}
                >
                  Trending
                </button>
                <button
                  className={`lb-toggle ${catalogTab === "top" ? "active" : ""}`}
                  onClick={() => setCatalogTab("top")}
                >
                  Top rated
                </button>
                <button
                  className={`lb-toggle ${catalogTab === "most" ? "active" : ""}`}
                  onClick={() => setCatalogTab("most")}
                >
                  Most rated
                </button>
              </div>
            </div>
            <div className="catalog-grid">
              {catalog
                .filter((m) => m.name.toLowerCase().includes(catalogQuery.toLowerCase()))
                .map((m, i) => (
                  <div key={i} className="catalog-card">
                    <div className="catalog-row">
                      <div className="catalog-title">{m.name}</div>
                      <div>
                        <button
                          className="btn-outline"
                          style={{ marginRight: 8 }}
                          onClick={() => {
                            setQuestion(m.name);
                            setToast(`Selected “${m.name}” for rating.`);
                          }}
                        >
                          Select
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => setCatalog((arr) => arr.filter((x) => x.name !== m.name))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="chipbar">
                      {(m.tags || ["AI", "General"]).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div style={{ fontWeight: 800 }}>Rate this Model</div>
              <div className="pill">Active</div>
            </div>
            <div className="form-grid" style={{ marginBottom: 8 }}>
              <div className="form-row combo">
                <label>Rating Item Address</label>
                <input
                  value={ratingItemAddress}
                  onChange={(e) => setRatingItemAddress(e.target.value)}
                  placeholder="Search by model or paste 0x..."
                  onInput={(e) => setRateQuery((e.target as HTMLInputElement).value)}
                />
                {rateSuggestions.length > 0 && (
                  <div className="suggest">
                    {rateSuggestions.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setRateQuery("");
                          setRatingItemAddress(m.address || "");
                          setQuestion(m.name);
                          setToast(`Selected “${m.name}”. Paste or set its address to rate.`);
                        }}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              Rate 1–5 privately on Zama FHEVM. Your vote is encrypted; only the aggregated average can be revealed.
            </div>

            <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 12 }}>RATE ({options.length})</div>
            <div className="options">
              {options.map((o) => (
                <div
                  key={o.index}
                  className={`option ${selected === o.index ? "is-selected" : ""}`}
                  onClick={() => setSelected(o.index)}
                >
                  <input type="radio" checked={selected === o.index} readOnly />
                  <div className="stars" aria-hidden>
                    {new Array(5).fill(0).map((_, i) => (
                      <span key={i} className={`star ${i < o.index ? "filled" : ""}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  {/* remove text label -> stars only */}
                </div>
              ))}
            </div>

            <div className="footer">
              <div>{voters} voters</div>
              <div>
                {/* Hide manual reveal to streamline UX; can add back if needed */}
                <button
                  className="btn-secondary"
                  disabled={!isConnected || !ratingItemAddress || isGranting}
                  onClick={async () => {
                    try {
                      if (!walletClient) throw new Error("No wallet client");
                      setIsGranting(true);
                      setStatus("Enabling reveal…");
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
                      setHasGranted(true);
                      try {
                        const key = `grant:${chainId}:${ratingItemAddress}:${address}`;
                        localStorage.setItem(key, "1");
                      } catch {
                        // ignore write error (private mode, etc.)
                      }
                      setToast("Reveal enabled for your address.");
                      setStatus(`Access granted. Tx: ${hash}`);
                    } catch (e: unknown) {
                      const msg = friendlyError(e);
                      setStatus(msg);
                    } finally {
                      setIsGranting(false);
                    }
                  }}
                >
                  {hasGranted ? "Reveal Enabled" : isGranting ? "Enabling…" : "Enable Reveal"}
                </button>
                <button
                  style={{ marginLeft: 8 }}
                  disabled={!isConnected || !canUseSepolia || !ratingItemAddress || selected === null}
                  onClick={async () => {
                    try {
                      if (selected === null) return;
                      setStatus("Encrypting & sending rating… (you may see wallet popups)");
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
                      // Update local leaderboard instantly
                      try {
                        const last = lbData.length - 1;
                        if (last >= 0 && selected >= 1 && selected <= 5) {
                          setLbData((prev) =>
                            prev.map((row, idx) =>
                              idx === last ? row.map((v, j) => (j === selected - 1 ? v + 1 : v)) : row,
                            ),
                          );
                        }
                      } catch {
                        // ignore
                      }
                      setStatus(`Rating tx sent: ${hash}`);
                      setToast("Submitted. You can Reveal Average later once enough ratings.");
                    } catch (e: unknown) {
                      const msg = friendlyError(e);
                      setStatus(msg);
                    }
                  }}
                >
                  Rate Now
                </button>
              </div>
            </div>

            {/* Average block hidden when auto-flow mode; can be restored to show decrypted summary */}

            {!canUseSepolia && (
              <div
                style={{ color: "#aaa", marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
              >
                กรุณาเชื่อมต่อเครือข่าย Sepolia
                <button
                  className="btn-outline"
                  onClick={async () => {
                    try {
                      type Eth = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
                      const eth = (window as unknown as { ethereum?: Eth }).ethereum;
                      await eth?.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xaa36a7" }] });
                    } catch {
                      setStatus("Please switch network to Sepolia in your wallet.");
                    }
                  }}
                >
                  Switch to Sepolia
                </button>
                <a className="btn-outline" href={FAUCET_URL} target="_blank" rel="noreferrer">
                  Open Sepolia Faucet
                </a>
              </div>
            )}
            <div style={{ marginTop: 6, color: "var(--muted)" }}>{status}</div>
          </div>

          <div id="create-item" className="card" style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Create Rating Item</div>
            <div className="form-grid">
              <div className="form-row">
                <label>Name</label>
                <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Model name" />
              </div>
              <div className="form-row">
                <label>Tags (comma separated)</label>
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. general, coding"
                />
              </div>
              <div className="form-row">
                <label>Factory Address</label>
                <input
                  value={factoryAddress}
                  onChange={(e) => setFactoryAddress(e.target.value)}
                  placeholder="0x... RatingFactory"
                />
              </div>
              <div className="form-actions">
                <button
                  disabled={!isConnected || !publicClient || !factoryAddress}
                  onClick={async () => {
                    try {
                      if (!walletClient) throw new Error("No wallet client");
                      if (!publicClient) throw new Error("No public client");
                      if (!question.trim()) throw new Error("Please enter a model name");
                      const user = getAddress(address as Address);
                      const finalFactory = (factoryAddress || FACTORY_ADDRESS_ENV || "") as string;
                      if (!finalFactory) {
                        throw new Error("Missing factory address. Set VITE_RATING_FACTORY_ADDRESS or open Advanced.");
                      }

                      // ABI for factory
                      const factoryAbi = [
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
                      ] as const;

                      // Try to simulate to get predicted address, but DO NOT block tx if it fails
                      let predictedAddress: Address | undefined = undefined;
                      try {
                        const sim = await publicClient.simulateContract({
                          account: user,
                          abi: factoryAbi,
                          address: finalFactory as Address,
                          functionName: "createItem",
                          args: [question, "", 1, 5],
                        });
                        predictedAddress = (sim.result as unknown as [Address, bigint])[0];
                        setStatus(`Creating item… predicted address: ${predictedAddress}`);
                      } catch {
                        setStatus("Creating item… (simulation skipped)");
                      }

                      // Always open wallet popup to send tx
                      const hash = await walletClient.writeContract({
                        abi: factoryAbi,
                        address: finalFactory as Address,
                        functionName: "createItem",
                        args: [question, "", 1, 5],
                      });

                      if (predictedAddress) setRatingItemAddress(predictedAddress);
                      setStatus(`Item creation tx: ${hash}`);
                      setCatalog((arr) => [
                        {
                          name: question,
                          tags: newTags
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                          address: predictedAddress as string,
                        },
                        ...arr,
                      ]);
                      setToast(`Created “${question}” and added to Catalog.`);
                    } catch (e: unknown) {
                      const msg = friendlyError(e);
                      if (msg) setStatus(msg);
                    }
                  }}
                >
                  Create Item
                </button>
                <button
                  className="btn-outline"
                  onClick={() =>
                    alert("Set VITE_RATING_FACTORY_ADDRESS in web/.env or fill address above in Advanced step.")
                  }
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>
          {/* end container */}
        </div>
        {/* end main */}
      </main>
      {/* end layout */}
      {toast && (
        <div className="toast" onClick={() => setToast("")}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
