import "./AuctionPlatform.css";
import { useAuth } from "@/MockAuth";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { BidSender } from "./BidSender";
import { type ListingQuery, ListingList } from "./components/listing/ListingList";
﻿import { useEffect, useMemo, useRef, useState } from "react";
import { AddListing } from "./components/listing/addlisting";
import { ShowBids } from "./components/bids/showbids"
import "./AuctionPlatform.css";
import { CurrentListings } from "./components/listing/soldlistings";
import Countdown from "react-countdown";

export type ListingType = {
  id: string;
  name: string;
  description: string;
  minBid: number;
  currentBid: number;
  expiry: Date;
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

const initialListings: ListingType[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    description: "Hand blown lavender glass with etched chrome accents.",
    minBid: 1.25,
    currentBid: 1.4,
    expiry: hoursFromNow(4),
  },
  {
    id: "silk-02",
    name: "Lilac Silk Poster",
    description: "Limited run screen print on archival lavender silk.",
    minBid: 0.9,
    currentBid: 1.05,
    expiry: hoursFromNow(7),
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    description: "Four track ambient vinyl release signed by the artist.",
    minBid: 0.7,
    currentBid: 0.82,
    expiry: hoursFromNow(2),
  },
  {
    id: "chair-04",
    name: "Contour Lounge Chair",
    description: "Ash frame with plum boucle upholstery and matte hardware.",
    minBid: 2.5,
    currentBid: 2.85,
    expiry: hoursFromNow(12),
  },
];

const initialBids: ActivityBid[] = [
  {
    id: "orchid-01",
    name: "Orchid Glass Sculpture",
    bidAmount: 1.4,
    status: "leading",
    endsAt: initialListings[0].expiry,
    minBid: initialListings[0].minBid,
  },
  {
    id: "vinyl-03",
    name: "Midnight Vinyl Set",
    bidAmount: 0.8,
    status: "outbid",
    endsAt: initialListings[2].expiry,
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
  leading: "Live",
  outbid: "Outbid",
  pending: "Pending",
};

type BidQuery = {
  bidId?: string;
};


export default function AuctionPlatform() {
  // useEffect(async () => {
  //   initialListings = axios.get("/api/get-listing/")
  // }, [])

  const { profile } = useAuth();
  
  const [tab, setTab] = useState<"browse" | "activity">("browse");
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<ListingType[]>(() => initialListings);
  const [activity, setActivity] = useState<ActivityBid[]>(() => initialBids);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(() => initialPortfolio);
  const [isListingModalOpen, setListingModalOpen] = useState(false);
  const account = useCurrentAccount();

  const openListingModal = () => {
    // setListingDraft(freshListingDraft());
    setListingModalOpen(true);
  };
  
  const closeListingModal = () => {
    setListingModalOpen(false);
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
  
  const defaultListing : ListingType = {
    id: "",
    name: "",
    description: "",
    minBid: 0,
    currentBid: 0,
    expiry: new Date,
  }

  const defaultListingQuery : ListingQuery = {
    listingId: "",
    sender: "",
    recipient: "",
    cancelled: '',
    swapped: '',
    limit: ''
  };

  const paramQuery : ListingQuery = {
    listingId: "",
    sender: account?.address,
    recipient: "",
    cancelled: '',
    swapped: '',
    limit: ''
  };

  const defaultBidQuery : BidQuery = {
    bidId: ""
  };

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
          <ListingList
            params={defaultListingQuery}
            enableSearch={false}
            setBidOpen={setBidOpen}
            setCurrentListing={setCurrentListing}
          />
        ) : (
          <section className="activity-layout" aria-label="Your activity">
            <ShowBids params={defaultBidQuery} />
            <CurrentListings params={paramQuery}/>
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
        <AddListing 
          closeListingModal={closeListingModal}
          setListings={setListings}
          setPortfolio={setPortfolio}
          setQuery={setQuery}
        />
      )}
    </div>
  );
}
