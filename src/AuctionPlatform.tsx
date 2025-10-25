import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Gavel, Search, Plus, X } from "lucide-react";

type Auction = {
  id: string;
  title: string;
  seller: string;
  currentBid: number;
  endAt: Date;
};

const sampleAuctions: Auction[] = [
  { id: "1", title: "Genesis Sui NFT #001", seller: "0xa1b2…c3", currentBid: 1.25, endAt: hoursFromNow(4) },
  { id: "2", title: "Rare Pixel Blade", seller: "0x9ee…88", currentBid: 3.7,  endAt: hoursFromNow(9) },
  { id: "3", title: "Vintage Space Patch", seller: "0x11a…e5", currentBid: 0.42, endAt: hoursFromNow(2) },
  { id: "4", title: "Signed Cal Hacks Tee", seller: "0xb77…f0", currentBid: 0.88, endAt: hoursFromNow(6) },
];

export default function AuctionPlatform() {
  const [tab, setTab] = useState<"browse" | "yours">("browse");
  const [query, setQuery] = useState("");
  const [bidOpen, setBidOpen] = useState<null | Auction>(null);
  const [myOpen, setMyOpen] = useState(false);

  const items = useMemo(() => {
    const list = sampleAuctions; // hook up to real data later
    if (!query.trim()) return list;
    return list.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.seller.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="min-h-screen p-5 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="flex items-center gap-3">
            <span className="inline-flex rounded-xl bg-white/10 p-2"><Gavel className="h-6 w-6 text-purple-400" /></span>
            Auction Platform
          </h1>
          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
              <Search className="h-4 w-4 text-white/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items or sellers…"
                className="bg-transparent outline-none placeholder:text-white/50 text-sm"
                aria-label="Search auctions"
              />
            </div>
            <button className="btn-ghost" onClick={() => setMyOpen(true)}>
              <Plus className="h-4 w-4" /> New Listing
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass mb-6 inline-flex rounded-xl p-1">
          <TabButton active={tab === "browse"} onClick={() => setTab("browse")}>Browse</TabButton>
          <TabButton active={tab === "yours"} onClick={() => setTab("yours")}>Your Auctions</TabButton>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "browse" ? (
            <motion.section
              key="browse"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className="card"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <h3 className="text-xl font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-white/70">Seller: {a.seller}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-white/70 text-xs">Current Bid</div>
                        <div className="text-lg font-bold">{a.currentBid.toFixed(2)} SUI</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Clock className="h-4 w-4" />
                        <Countdown endAt={a.endAt} />
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button className="btn-primary" onClick={() => setBidOpen(a)}>Place Bid</button>
                      <button className="btn-ghost">View</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="yours"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="card">
                <h2 className="mb-1">Your Auctions</h2>
                <p className="text-white/70">When you list items, they’ll appear here with quick actions to edit, cancel, or accept a winning bid.</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Bid Modal */}
      <BidModal open={!!bidOpen} auction={bidOpen} onClose={() => setBidOpen(null)} />

      {/* New Listing Modal (skeleton) */}
      <SimpleModal open={myOpen} onClose={() => setMyOpen(false)} title="Create New Listing">
        <p className="text-white/80">
          Hook up your listing form here (title, image, starting bid, duration, etc.).  
          This modal is accessible and already styled.
        </p>
      </SimpleModal>
    </main>
  );
}

function TabButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative rounded-lg px-4 py-2 text-sm font-semibold transition",
        active ? "bg-white/15" : "hover:bg-white/10 text-white/80"
      ].join(" ")}
    >
      {children}
      {active && <span className="absolute inset-x-2 -bottom-[3px] h-[3px] rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />}
    </button>
  );
}

/* --------- Bid Modal --------- */
function BidModal({
  open, auction, onClose,
}: { open: boolean; auction: Auction | null; onClose: () => void }) {
  const [amount, setAmount] = useState<string>("");
  const minBid = auction ? Math.max(auction.currentBid + 0.01, auction.currentBid * 1.01) : 0;

  return (
    <SimpleModal open={open} onClose={onClose} title={`Place Bid${auction ? ` — ${auction.title}` : ""}`}>
      {auction ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const v = parseFloat(amount);
            if (isNaN(v) || v < minBid) {
              alert(`Enter a valid amount ≥ ${minBid.toFixed(2)} SUI`);
              return;
            }
            // Integrate wallet + on-chain call here
            alert(`Bid of ${v.toFixed(2)} SUI placed!`);
            onClose();
          }}
        >
          <div className="text-white/80 text-sm">
            Current bid: <strong>{auction.currentBid.toFixed(2)} SUI</strong>
          </div>
          <label className="block text-sm text-white/80">
            Your bid (SUI)
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={minBid.toFixed(2)}
              className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none border border-white/10 focus:border-purple-400"
              aria-label="Bid amount in SUI"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Confirm Bid</button>
          </div>
        </form>
      ) : (
        <p className="text-white/70">Select an auction to bid.</p>
      )}
    </SimpleModal>
  );
}

/* --------- Generic Accessible Modal --------- */
function SimpleModal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="glass relative w-full max-w-lg rounded-2xl p-6"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold">{title}</h3>
              <button aria-label="Close" className="rounded-lg p-1 hover:bg-white/10" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------- Helpers --------- */
function Countdown({ endAt }: { endAt: Date }) {
  const [tick, setTick] = useState(0);
  // simple re-render each second
  React.useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, endAt.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return <span aria-live="polite">{h}h {m}m {ss}s</span>;
}

function hoursFromNow(h: number) {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d;
}
