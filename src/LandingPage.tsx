import { Link } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { useAuth } from "@/MockAuth";
import "./LandingPage.css";

const heroMetrics = [
  { label: "Active listings", value: "48" },
  { label: "Average reserve met", value: "92%" },
  { label: "Verified sellers", value: "32" },
];

const highlights = [
  {
    title: "Transparent minimums",
    description: "Every auction publishes its reserve, so you know exactly where bidding starts before you commit.",
  },
  {
    title: "Time you can trust",
    description: "Live countdowns keep you synced across devices so there are no last-minute surprises or silent extensions.",
  },
  {
    title: "Portfolio in one view",
    description: "Monitor bids you have placed and the pieces you are selling without juggling separate dashboards.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Sign in",
    text: "Use Google to join instantly. We create a secure profile and wallet address for you on the spot.",
  },
  {
    step: "02",
    title: "Browse curated drops",
    text: "Filter by designer, medium, or closing time. Every listing comes with a short story and minimum bid.",
  },
  {
    step: "03",
    title: "Track your activity",
    text: "Review offers you have made alongside listings you posted. Real-time status keeps you in the loop.",
  },
];

const faqs = [
  {
    question: "What currency do I bid with?",
    answer: "Bids are denominated in SUI. We show the minimum and current bid so you can place informed offers.",
  },
  {
    question: "Can I list my own items?",
    answer: "Yes. Once you sign in, use the portfolio tab inside the app to publish new listings in minutes.",
  },
  {
    question: "Is this ready for production?",
    answer: "This is a Cal Hacks showcase built to demonstrate a polished UX. Connect it to live contracts when you are ready.",
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
            <h2>A calm flow from sign-in to sale.</h2>
            <p>Select a lot, place a bid, or create your own listing; everything sits inside an uncluttered dashboard.</p>
          </header>
          <div className="workflow-grid">
            {workflow.map((item) => (
              <article key={item.step} className="workflow-card glow-border">
                <span className="workflow-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
