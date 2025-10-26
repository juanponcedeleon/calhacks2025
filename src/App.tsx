import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/LandingPage";
import AuctionPlatform from "@/AuctionPlatform";
import LoginPage from "@/LoginPage";
import { AuthProvider, Protected } from "@/MockAuth";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, type SuiClientOptions } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	testnet: { url: getFullnodeUrl('testnet') }
});

const queryClient = new QueryClient();

export default function App() {
  return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider>
					<BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/app"
                  element={
                    <Protected>
                      <AuctionPlatform />
                    </Protected>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}
