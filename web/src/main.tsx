import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WagmiConfig, http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { injected } from "wagmi/connectors";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia],
  transports: { [sepolia.id]: http() },
  connectors: [injected({ shimDisconnect: true })],
  multiInjectedProviderDiscovery: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </StrictMode>,
);
