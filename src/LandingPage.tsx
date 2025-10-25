import { Link } from "react-router-dom";
import { Gavel, Shield, Zap, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/MockAuth";

export default function LandingPage() {
  const { address } = useAuth();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* subtle moving gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-10%] h-[40rem] w-[40rem] rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(closest-side, rgba(255,0,153,.35), transparent)" }} />
        <div className="absolute left-[-10%] bottom-[-10%] h-[36rem] w-[36rem] rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(closest-side, rgba(120,79,254,.4), transparent)" }} />
      </div>

      {/* NAV */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-3 focus-visible:ring-2 rounded-xl">
          <div className="glass rounded-xl p-2">
            <Gavel className="h-6 w-6 text-purple-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sui Auction House</span>
        </Link>
        <nav className="flex items-center gap-3">
          {/* show Login when logged out (mock auth) */}
          {!address && <Link to="/login" className="btn-ghost">Login</Link>}
          <Link to="/app" className="btn-primary">
            Enter Auction Platform <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-6 md:grid-cols-2 md:pb-24 md:pt-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Sui Auction House</span>
          </motion.h1>
          <motion.p
            className="mt-5 max-w-prose"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
          >
            Discover a new era of decentralized bidding and listings powered by the
            Sui blockchain. Create auctions, place bids, and explore unique items
            from across the community — all in one elegant interface.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
          >
            <Link to="/app" className="btn-primary">
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://docs.sui.io" target="_blank" rel="noreferrer"
              className="btn-ghost"
            >
              Learn about Sui
            </a>
          </motion.div>

          {/* STATS */}
          <motion.ul
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {[
              { k: "10K+", label: "Active Auctions" },
              { k: "$2M+", label: "Total Volume" },
              { k: "50K+", label: "Community Members" },
              { k: "99.99%", label: "Uptime" },
            ].map((s) => (
              <motion.li key={s.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="card text-center"
              >
                <div className="text-2xl font-extrabold">{s.k}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Right promo card */}
        <motion.div
          className="card relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="relative">
            <h2 className="mb-2">Why choose us?</h2>
            <p className="mb-6">
              Purpose-built for web3 marketplaces with transparent smart-contract
              logic, fast finality, and an elegant bidding experience judges
              will immediately understand.
            </p>
            <ul className="space-y-4">
              <Feature icon={<Shield className="h-5 w-5" />} title="Secure Transactions"
                desc="Auditable on Sui with transparent settlement." />
              <Feature icon={<Zap className="h-5 w-5" />} title="Lightning Fast"
                desc="Realtime updates and instant bid placement." />
              <Feature icon={<Globe className="h-5 w-5" />} title="Global Marketplace"
                desc="List and bid from anywhere with wallet connect." />
            </ul>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto w-full max-w-6xl px-5 pb-10">
        <div className="glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-white/70">
            Built for Cal Hacks — bring your best item, we’ll bring the bids.
          </p>
          <Link to="/app" className="btn-primary mt-4 sm:mt-0">
            Start Bidding
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Feature(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-1 rounded-lg bg-white/10 p-2">{props.icon}</div>
      <div>
        <div className="font-semibold">{props.title}</div>
        <div className="text-white/70 text-sm">{props.desc}</div>
      </div>
    </li>
  );
}
