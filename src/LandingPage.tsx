import { Link } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { useAuth } from "@/MockAuth";
import "./LandingPage.css";

const heroMetrics = [
  { label: "Encrypted bids confirmed", value: "18,420" },
  { label: "Average finality (ms)", value: "480" },
  { label: "Sui objects securing auctions", value: "6,300" },
];

const highlights = [
  {
    title: "Encrypted intent, on-chain truth",
    description:
      "Orchid Auctions leverages Sui Move smart contracts to keep bids confidential until settlement while preserving a verifiable audit trail.",
  },
  {
    title: "Object-centric security",
    description:
      "Each auction, bid, and payout exists as a unique Sui object. Deterministic ownership eliminates tampering and removes opaque intermediaries.",
  },
  {
    title: "Parallel execution, instant UX",
    description:
      "Sui's horizontal scaling commits transactions in parallel, so bid submissions and settlement confirmations remain sub-second.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Connect with Mysten Dapp Kit",
    text: "Authenticate directly from your wallet—Orchid never holds private keys. Mysten's ConnectButton signs each transaction client-side.",
  },
  {
    step: "02",
    title: "Create sealed-bid auctions",
    text: "Deploy an auction object on Sui with start and end windows, reserve price, and metadata. All bid data stays encrypted until reveal.",
  },
  {
    step: "03",
    title: "Reveal and settle trustlessly",
    text: "When the timer expires, the contract decrypts bids, determines the winner, and transfers funds and ownership atomically.",
  },
];

const whatItDoes = [
  {
    title: "Create auctions",
    description:
      "Each marketplace listing is deployed as a Sui object with immutable rules defining timing, reserve price, and metadata.",
  },
  {
    title: "Place bids",
    description:
      "Users submit sealed bids that stay encrypted on chain until the reveal phase, keeping competitive intent private.",
  },
  {
    title: "Finalize autonomously",
    description:
      "When the auction ends, the Move contract reveals bids, determines the winner, and executes payouts without custodians.",
  },
  {
    title: "Connect wallets",
    description:
      "Powered by Mysten's ConnectButton, bidders authenticate securely with Sui-compatible wallets in a single click.",
  },
  {
    title: "Query live state",
    description:
      "The client streams Sui RPC calls (getOwnedObjects, queryTransactionBlocks, and more) to keep the UI synced with on-chain events.",
  },
];

const faqs = [
  {
    question: "How is confidentiality preserved?",
    answer:
      "Bids are written to Sui as encrypted objects. Only when the auction closes does the Move contract reveal values, ensuring fair competition.",
  },
  {
    question: "What happens after settlement?",
    answer:
      "Once the winner is declared, results become public chain data. Anyone can audit the winning amount, bidder, and payout transaction hashes.",
  },
  {
    question: "Do I need custom infrastructure?",
    answer:
      "No. Orchid streams live state using Sui's RPC APIs (getOwnedObjects, queryTransactionBlocks, etc.), so connecting your wallet is enough.",
  },
];

export default function LandingPage() {
  const { address } = useAuth();

  return (
    <div className="landing-shell">
      <AppNav loggedIn={!!address} />

      <main className="landing-main">
        <section className="landing-hero" id="top">
          <div className="hero-copy">
            <span className="hero-tag">Cal Hacks 2025 showcase</span>
            <h1>Minimal auctions for people who value thoughtful design.</h1>
            <p>
              Orchid Auctions keeps bidding calm and considered. Browse curated drops, understand the minimums,
              and manage every interaction from your first bid to your personal listings in one focused workspace.
            </p>

            <div className="hero-actions">
              {!address && (
                <Link to="/login" className="landing-button solid">
                  Sign in with Google
                </Link>
              )}
              <Link to="/app" className="landing-button outline">
                Browse auctions
              </Link>
            </div>

            <ul className="hero-points">
              <li>
                <span className="point-dot" /> Verified sellers and provenance checks
              </li>
              <li>
                <span className="point-dot" /> Clear minimum bids and closing times
              </li>
              <li>
                <span className="point-dot" /> Portfolio view for bids and listings
              </li>
            </ul>
          </div>

          <aside className="hero-panel" aria-label="Marketplace snapshot">
            <div className="panel-card glow-border">
              <h2>Today's snapshot</h2>
              <p>Activity across the marketplace updates in real time once you enter the app.</p>
              <dl className="panel-metrics">
                {heroMetrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </section>

        <section className="landing-highlights" id="features">
          <header>
            <span className="section-tag">Why Orchid</span>
            <h2>Make bids with confidence.</h2>
            <p>
              We highlight the essentials: minimum bid, current bid, and time remaining so you can stay focused on the piece.
            </p>
          </header>
          <div className="highlight-grid">
            {highlights.map((item) => (
              <article key={item.title} className="highlight-card glow-border">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-workflow" id="workflow">
          <header>
            <span className="section-tag">How it works</span>
            <h2>From wallet connect to settlement in three steps.</h2>
            <p>Orchid abstracts the blockchain busy work so you can focus on the market, not the plumbing.</p>
          </header>
          <div className="workflow-grid">
            {workflow.map((item) => (
              <article key={item.step} className="workflow-card glow-border">
                <span className="workflow-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
            {whatItDoes.map((item) => (
              <article key={item.title} className="workflow-card glow-border">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-faq" id="faq">
          <header>
            <span className="section-tag">FAQs</span>
            <h2>Details before you jump in.</h2>
          </header>
          <div className="faq-grid">
            {faqs.map((item) => (
              <article key={item.question} className="faq-item glow-border">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span>Copyright {new Date().getFullYear()} Orchid Auctions</span>
          <nav className="footer-links" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#faq">FAQs</a>
            <Link to="/app">Launch app</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
