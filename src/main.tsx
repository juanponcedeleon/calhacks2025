import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import App from "./App";
import "./index.css";

const { networkConfig } = createNetworkConfig({
  mainnet: { url: "https://fullnode.mainnet.sui.io:443" },
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
  devnet: { url: "https://fullnode.devnet.sui.io:443" },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
      <QueryClientProvider client={queryClient}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </QueryClientProvider>
    </SuiClientProvider>
  </React.StrictMode>
);
