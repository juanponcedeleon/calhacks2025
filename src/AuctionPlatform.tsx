import { useMemo, useRef, useState } from "react";
import "./AuctionPlatform.css";
import { useAuth } from "@/MockAuth";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { BidSender } from "./BidSender";
﻿import { useEffect, useMemo, useRef, useState } from "react";
import "./AuctionPlatform.css";
import { useAuth } from "@/MockAuth";
import { ConnectButton } from "@mysten/dapp-kit";
import { BidSender } from "./BidSender";
import Countdown from "react-countdown";

export type Listing = {
  id: string;
  name: string;
  description: string;
  minBid: number;
  currentBid: number;
  endTime: Date;
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

type ListingDraft = {
  name: string;
  description: string;
  minBid: string;
  durationHours: string;
};

function hoursFromNow(hours: number): Date {
  const next = new Date();
  next.setHours(next.getHours() + hours);
  return next;
}

const initialListings: Listing[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    description: "Hand blown lavender glass with etched chrome accents.",
    minBid: 1.25,
    currentBid: 1.4,
    endTime: hoursFromNow(4),
  },
  {
    id: "silk-02",
    name: "Lilac Silk Poster",
    description: "Limited run screen print on archival lavender silk.",
    minBid: 0.9,
    currentBid: 1.05,
    endTime: hoursFromNow(7),
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    description: "Four track ambient vinyl release signed by the artist.",
    minBid: 0.7,
    currentBid: 0.82,
    endTime: hoursFromNow(2),
  },
  {
    id: "chair-04",
    name: "Contour Lounge Chair",
    description: "Ash frame with plum boucle upholstery and matte hardware.",
    minBid: 2.5,
    currentBid: 2.85,
    endTime: hoursFromNow(12),
  },
];

const initialBids: ActivityBid[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    bidAmount: 1.4,
    status: "leading",
    endsAt: initialListings[0].endTime,
    minBid: initialListings[0].minBid,
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    bidAmount: 0.8,
    status: "outbid",
    endsAt: initialListings[2].endTime,
    minBid: initialListings[2].minBid,
  },
];

const initialPortfolio: PortfolioEntry[] = [
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

function freshListingDraft(): ListingDraft {
  return {
    name: "",
    description: "",
    minBid: "0.50",
    durationHours: "6",
  };
}



export default function AuctionPlatform() {
  // useEffect(async () => {
  //   initialListings = axios.get("/api/get-listing/")
  // }, [])

  const { profile } = useAuth();
  
  const [tab, setTab] = useState<"browse" | "activity">("browse");
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>(() => initialListings);
  const [activity, setActivity] = useState<ActivityBid[]>(() => initialBids);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(() => initialPortfolio);
  const [isListingModalOpen, setListingModalOpen] = useState(false);
  const [listingDraft, setListingDraft] = useState<ListingDraft>(freshListingDraft);
  const account = useCurrentAccount();

  const openListingModal = () => {
    setListingDraft(freshListingDraft());
    setListingModalOpen(true);
  };
  
  const closeListingModal = () => {
    setListingModalOpen(false);
    setListingDraft(freshListingDraft());
  };
  
  const filteredListings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return listings;
    }
    return listings.filter((listing) => {
      return (
        listing.name.toLowerCase().includes(normalized) ||
        listing.description.toLowerCase().includes(normalized)
      );
    });
  }, [listings, query]);
  
  const handleCreateListing = () => {
    const name = listingDraft.name.trim();
    const description = listingDraft.description.trim();
    const minBidValue = parseFloat(listingDraft.minBid);
    const durationValue = parseInt(listingDraft.durationHours, 10);
    
    if (!name || !description) {
      alert("Please provide a name and description.");
      return;
    }
    
    if (Number.isNaN(minBidValue) || minBidValue <= 0) {
      alert("Minimum bid must be greater than 0.");
      return;
    }
    
    if (Number.isNaN(durationValue) || durationValue <= 0) {
      alert("Duration should be at least one hour.");
      return;
    }
    
    const id = `listing-${Date.now()}`;
    const endTime = hoursFromNow(durationValue);
    const seller = profile?.name ?? "You";

    const newListing: Listing = {
      id,
      name,
      description,
      minBid: minBidValue,
      currentBid: minBidValue,
      endTime,
    };

    const newPortfolio: PortfolioEntry = {
      id,
      name,
      minBid: minBidValue,
      highestBid: null,
      endsAt: endTime,
    };
    
    setListings((prev) => [newListing, ...prev]);
    setPortfolio((prev) => [newPortfolio, ...prev]);
    setQuery("");
    closeListingModal();
  };
  
  const defaultListing : Listing = {
    id: "",
    name: "",
    description: "",
    minBid: 0,
    currentBid: 0,
    endTime: new Date,
  }
  const [bidOpen, setBidOpen] = useState(false); 
  const [currentListing, setCurrentListing] = useState(defaultListing); 
  const bidSenderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="auction-shell">
      <BidSender ref={bidSenderRef} open={bidOpen} setOpen={setBidOpen} listing={currentListing} />
      <header className="auction-header">
        <div className="auction-header__content">
          <div>
            <h1>Orchid Auctions</h1>
            <p>Minimal auctions for people who love deliberate design.</p>
          </div>
          <div className="auction-user">
            <div className="auction-user__meta">
              <span className="auction-user__label">Signed in</span>
              <span className="auction-user__name">{profile?.name ?? "Guest"}</span>
            </div>
            <ConnectButton connectText="Connect wallet" className="auction-wallet" />
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

          {tab === "browse" ? (
            <label className="auction-search">
              <span className="auction-search__label">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search listings or sellers"
                aria-label="Search listings"
              />
            </label>
          ) : (
            <button
              type="button"
              className="auction-create"
              onClick={openListingModal}
            >
              Add listing
            </button>
          )}
        </section>

        {tab === "browse" ? (
          <section aria-label="Browse listings">
            <div className="listing-grid">
              {filteredListings.map((listing) => (
                <article key={listing.id} className="listing-card">
                  <div className="listing-header">
                    <h2>{listing.name}</h2>
                  </div>
                  <p className="listing-description">{listing.description}</p>
                  <dl className="listing-meta">
                    <div>
                      <dt>Minimum bid</dt>
                      <dd>{formatSui(listing.minBid)}</dd>
                    </div>
                    <div>
                      <dt>Time remaining</dt>
                      <dd>{<Countdown daysInHours={true} date={listing.endTime} />}</dd>
                    </div>
                  </dl>
                  <button type="button" className="listing-action" onClick={(e) => {
                    setBidOpen(true);
                    setCurrentListing(listing);
                  }}>
                    Place a bid
                  </button>
                </article>
              ))}
            </div>
            {filteredListings.length === 0 && (
              <p className="empty-state">Nothing matched your search. Try another keyword.</p>
            )}
          </section>
        ) : (
          <section className="activity-layout" aria-label="Your activity">
            <div className="activity-card">
              <header>
                <h2>Things you have bid on</h2>
                <p>Track how your offers are performing across live auctions.</p>
              </header>
              {activity.length > 0 ? (
                <ul className="activity-list">
                  {activity.map((bid) => (
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
                        <span>Ends in {<Countdown daysInHours={true} date={bid.endsAt} />}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">You have not placed any bids yet.</p>
              )}
            </div>

            <div className="activity-card">
              <header>
                <h2>Things you are selling</h2>
                <p>Review listings that are currently live in the marketplace.</p>
              </header>
              {portfolio.length > 0 ? (
                <ul className="activity-list">
                  {portfolio.map((entry) => (
                    <li key={entry.id}>
                      <div className="activity-primary">
                        <span className="activity-title">{entry.name}</span>
                        <span className="activity-status status-muted">
                          {<Countdown daysInHours={true} date={entry.endsAt} />}
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
                <p className="empty-state">You have not listed anything for auction yet.</p>
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

      {isListingModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>Add a listing</h3>
                <p>Share the details so other collectors can bid.</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={closeListingModal}
                aria-label="Close add listing form"
              >
                ×
              </button>
            </header>

            <div className="modal-body">
              <label className="modal-label">
                Listing name
                <input
                  value={listingDraft.name}
                  onChange={(event) =>
                    setListingDraft((draft) => ({ ...draft, name: event.target.value }))
                  }
                  placeholder="Sui-native collectible"
                />
              </label>

              <label className="modal-label">
                Description
                <textarea
                  value={listingDraft.description}
                  onChange={(event) =>
                    setListingDraft((draft) => ({ ...draft, description: event.target.value }))
                  }
                  rows={4}
                  placeholder="Tell bidders what makes this piece special."
                />
              </label>

              <div className="modal-grid">
                <label className="modal-label">
                  Minimum bid (SUI)
                  <input
                    value={listingDraft.minBid}
                    onChange={(event) =>
                      setListingDraft((draft) => ({ ...draft, minBid: event.target.value }))
                    }
                    inputMode="decimal"
                  />
                </label>
                <label className="modal-label">
                  Duration (hours)
                  <input
                    value={listingDraft.durationHours}
                    onChange={(event) =>
                      setListingDraft((draft) => ({ ...draft, durationHours: event.target.value }))
                    }
                    inputMode="numeric"
                  />
                </label>
              </div>
            </div>

            <footer className="modal-footer">
              <button type="button" className="modal-secondary" onClick={closeListingModal}>
                Cancel
              </button>
              <button type="button" className="modal-primary" onClick={handleCreateListing}>
                Add listing
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSui(value: number): string {
  return `${value.toFixed(2)} SUI`;
}
