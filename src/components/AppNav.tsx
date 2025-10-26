import { Link } from "react-router-dom";
import "./AppNav.css";

type AppNavProps = {
  loggedIn: boolean;
};

export default function AppNav({ loggedIn }: AppNavProps) {
  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-mark">OA</span>
          <span className="nav-name">Orchid Auctions</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <a href="#features">Why Orchid</a>
          <a href="#workflow">How it works</a>
          <a href="#faq">FAQs</a>
        </nav>

        <div className="nav-actions">
          {!loggedIn && (
            <Link to="/login" className="nav-button ghost">
              Sign in
            </Link>
          )}
          <Link to="/app" className="nav-button solid">
            Go to app
          </Link>
        </div>
      </div>
    </header>
  );
}
