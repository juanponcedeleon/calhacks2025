import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/LandingPage";
import AuctionPlatform from "@/AuctionPlatform";
import LoginPage from "@/LoginPage";
import { AuthProvider, Protected } from "@/MockAuth";

export default function App() {
  return (
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
  );
}
