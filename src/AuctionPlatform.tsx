import { useMemo, useState } from "react";
import "./AuctionPlatform.css";
import { useAuth } from "@/MockAuth";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

type Listing = {
  id: string;
  name: string;
  description: string;
  minBid: number;
  currentBid: number;
  endTime: Date;
  seller: string;
};

type ActivityBid = {
  id: string;
  name: string;
  bidAmount: number;
  status: "leading" | "outbid" | "pending";
  endsAt: Date;
  minBid: number;
};

type PortfolioEntry = {
  id: string;
  name: string;
  minBid: number;
  highestBid: number | null;
  endsAt: Date;
};

function hoursFromNow(hours: number): Date {
  const next = new Date();
  next.setHours(next.getHours() + hours);
  return next;
}

const listings: Listing[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    description: "Hand blown lavender glass with etched chrome accents.",
    minBid: 1.25,
    currentBid: 1.4,
    endTime: hoursFromNow(4),
    seller: "Atelier Morrow",
  },
  {
    id: "silk-02",
    name: "Lilac Silk Poster",
    description: "Limited run screen print on archival lavender silk.",
    minBid: 0.9,
    currentBid: 1.05,
    endTime: hoursFromNow(7),
    seller: "Studio Ember",
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    description: "Four track ambient vinyl release signed by the artist.",
    minBid: 0.7,
    currentBid: 0.82,
    endTime: hoursFromNow(2),
    seller: "Nova Rooms",
  },
  {
    id: "chair-04",
    name: "Contour Lounge Chair",
    description: "Ash frame with plum boucle upholstery and matte hardware.",
    minBid: 2.5,
    currentBid: 2.85,
    endTime: hoursFromNow(12),
    seller: "Form Index",
  },
];

const activityBids: ActivityBid[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    bidAmount: 1.4,
    status: "leading",
    endsAt: listings[0].endTime,
    minBid: listings[0].minBid,
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    bidAmount: 0.8,
    status: "outbid",
    endsAt: listings[2].endTime,
    minBid: listings[2].minBid,
  },
];

const portfolioEntries: PortfolioEntry[] = [
  {
    id: "lamp-11",
    name: "Halo Table Lamp",
    minBid: 1.1,
    highestBid: 1.24,
    endsAt: hoursFromNow(6),
  },
  {
    id: "planter-12",
    name: "Carved Stone Planter",
    minBid: 0.6,
    highestBid: null,
    endsAt: hoursFromNow(18),
  },
];

const statusCopy: Record<ActivityBid["status"], string> = {
  leading: "Leading bid",
  outbid: "Outbid",
  pending: "Pending",
};

export default function AuctionPlatform() {
  const { profile, logout } = useAuth();
  const [tab, setTab] = useState<"browse" | "activity">("browse");
  const [query, setQuery] = useState("");
  const account = useCurrentAccount();

  const filteredListings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return listings;
    }
    return listings.filter((listing) => {
      return (
        listing.name.toLowerCase().includes(normalized) ||
        listing.description.toLowerCase().includes(normalized) ||
        listing.seller.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  return (
    <div className="auction-shell">
      <header className="auction-header">
        <div className="auction-header__content">
          <div>
            <h1>Orchid Auctions</h1>
            <p>Minimal auctions for people who love deliberate design.</p>
          </div>
          <div className="auction-user">
            <div className="auction-user__meta">
              <span className="auction-user__label">Signed in</span>
              <span className="auction-user__name">
                {profile?.name ?? "Guest"}
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="auction-container">
        <section className="auction-toolbar">
          <div className="auction-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className={tab === "browse" ? "is-active" : ""}
              onClick={() => setTab("browse")}
              aria-selected={tab === "browse"}
            >
              Browse
            </button>
            <button
              type="button"
              role="tab"
              className={tab === "activity" ? "is-active" : ""}
              onClick={() => setTab("activity")}
              aria-selected={tab === "activity"}
            >
              Your Activity
            </button>
          </div>

          <label className="auction-search">
            <span className="auction-search__label">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search listings or sellers"
              aria-label="Search listings"
            />
          </label>
        </section>

        {tab === "browse" ? (
          <section aria-label="Browse listings">
            <div className="listing-grid">
              {filteredListings.map((listing) => (
                <article key={listing.id} className="listing-card glow-border">
                  <div className="listing-header">
                    <h2>{listing.name}</h2>
                    <span className="listing-seller">{listing.seller}</span>
                  </div>
                  <p className="listing-description">{listing.description}</p>
                  <dl className="listing-meta">
                    <div>
                      <dt>Minimum bid</dt>
                      <dd>{formatSui(listing.minBid)}</dd>
                    </div>
                    <div>
                      <dt>Current bid</dt>
                      <dd>{formatSui(listing.currentBid)}</dd>
                    </div>
                    <div>
                      <dt>Time remaining</dt>
                      <dd>{formatTimeRemaining(listing.endTime)}</dd>
                    </div>
                  </dl>
                  <button type="button" className="listing-action">
                    Place a bid
                  </button>
                </article>
              ))}
            </div>
            {filteredListings.length === 0 && (
              <p className="empty-state">
                Nothing matched your search. Try another keyword.
              </p>
            )}
          </section>
        ) : (
          <section className="activity-layout" aria-label="Your activity">
            <div className="activity-card glow-border">
              <header>
                <h2>Things you have bid on</h2>
                <p>Track how your offers are performing across live auctions.</p>
              </header>
              {activityBids.length > 0 ? (
                <ul className="activity-list">
                  {activityBids.map((bid) => (
                    <li key={bid.id}>
                      <div className="activity-primary">
                        <span className="activity-title">{bid.name}</span>
                        <span className={`activity-status status-${bid.status}`}>
                          {statusCopy[bid.status]}
                        </span>
                      </div>
                      <div className="activity-secondary">
                        <span>
                          Your bid <strong>{formatSui(bid.bidAmount)}</strong>
                        </span>
                        <span>Minimum {formatSui(bid.minBid)}</span>
                        <span>Ends in {formatTimeRemaining(bid.endsAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">You have not placed any bids yet.</p>
              )}
            </div>

            <div className="activity-card glow-border">
              <header>
                <h2>Things you are selling</h2>
                <p>Review listings that are currently live in the marketplace.</p>
              </header>
              {portfolioEntries.length > 0 ? (
                <ul className="activity-list">
                  {portfolioEntries.map((entry) => (
                    <li key={entry.id}>
                      <div className="activity-primary">
                        <span className="activity-title">{entry.name}</span>
                        <span className="activity-status status-muted">
                          {formatTimeRemaining(entry.endsAt)}
                        </span>
                      </div>
                      <div className="activity-secondary">
                        <span>
                          Minimum <strong>{formatSui(entry.minBid)}</strong>
                        </span>
                        <span>
                          Highest bid {entry.highestBid ? formatSui(entry.highestBid) : "No bids yet"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">
                  You have not listed anything for auction yet.
                </p>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="auction-footer">
        <div className="auction-footer__content">
          <span>Copyright {new Date().getFullYear()} Orchid Auctions</span>
          <span>Thoughtful auctions built for Cal Hacks 2025</span>
        </div>
      </footer>
    </div>
  );
}

function formatSui(value: number): string {
  return `${value.toFixed(2)} SUI`;
}

function formatTimeRemaining(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return "Closed";
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${remainingMinutes}m`;
}
