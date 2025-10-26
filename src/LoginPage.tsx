import "./LoginPage.css";
import { useAuth } from "@/MockAuth";
import { ConnectButton } from "@mysten/dapp-kit";


export default function LoginPage() {
  const { login } = useAuth();

  return (
    <main className="login-shell">
      <section className="login-panel glow-border">
        <div className="login-brand">
          <div className="login-badge">OA</div>
          <div>
            <h1>Orchid Auctions</h1>
            <p>
              Sign in with Google to browse upcoming auctions, review minimum bids,
              check time remaining, and stay close to your portfolio.
            </p>
          </div>
        </div>

        <ConnectButton onClick={() => {
          login({ name: "Demo Bidder" });
          window.location.replace("/app");
        }}/>

        {/* <button
          className="login-google"
          onClick={() => {
            login({ name: "Demo Bidder" });
            window.location.replace("/app");
          }}
        >
          <span className="google-icon" aria-hidden="true">
            <span className="google-dot dot-blue" />
            <span className="google-dot dot-red" />
            <span className="google-dot dot-yellow" />
            <span className="google-dot dot-green" />
          </span>
          Continue with Google
        </button> */}

        <p className="login-hint">
          A single tap unlocks your activity feed and the items you are listing.
        </p>
      </section>
    </main>
  );
}
