import { useState } from "react";
import { type ListingType } from "@/AuctionPlatform";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../../constants";
import { useTransactionExecution } from "../useTransaction";
import { Transaction } from "@mysten/sui/transactions";

function getRandomU64() {
  // Generate four 16-bit random numbers and combine them.
  // Each Math.random() generates a number between 0 and 1.
  // Multiplying by 65536 (2^16) and flooring gives a random integer from 0 to 65535.
  const part1 = BigInt(Math.floor(Math.random() * 65536));
  const part2 = BigInt(Math.floor(Math.random() * 65536));
  const part3 = BigInt(Math.floor(Math.random() * 65536));
  const part4 = BigInt(Math.floor(Math.random() * 65536));

  // Combine the parts to form a 64-bit number.
  // Use bitwise left shifts and OR operations to combine the parts.
  // Each part represents 16 bits of the 64-bit number.
  const u64 = (part1 << 48n) | (part2 << 32n) | (part3 << 16n) | part4;

  return u64;
}

export function useCreateListingMutation() {
  const currentAccount = useCurrentAccount();
  const executeTransaction = useTransactionExecution();

  return (async ({
      listing,
    }: {
      listing: ListingType;
    }) => {
      if (!currentAccount?.address)
        throw new Error("You need to connect your wallet!");

      const txb = new Transaction();
      txb.moveCall({
        target: `${CONSTANTS.listingContract.packageId}::listing::create`,
        arguments: [
          txb.pure.u64(getRandomU64()),
          txb.pure.u64(Math.round(listing.minBid * 1000000000)),
          txb.pure.u64(listing.expiry.getMilliseconds()),
          txb.pure.string(listing.name),
          txb.pure.string(listing.description)
        ]
      });

      return executeTransaction(txb);
    })
}

type ListingDraft = {
  name: string;
  description: string;
  minBid: string;
  durationHours: string;
};

type PortfolioEntry = {
  id: string;
  name: string;
  minBid: number;
  highestBid: number | null;
  endsAt: Date;
};

function freshListingDraft(): ListingDraft {
  return {
    name: "",
    description: "",
    minBid: "0.50",
    durationHours: "6",
  };
}

type AddListingProps = {
    closeListingModal: () => void;
    setListings: React.Dispatch<React.SetStateAction<ListingType[]>>;
    setPortfolio: React.Dispatch<React.SetStateAction<PortfolioEntry[]>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function hoursFromNow(hours: number): Date {
  const next = new Date();
  next.setHours(next.getHours() + hours);
  return next;
}

// setListingDraft(freshListingDraft());

export function AddListing({ closeListingModal, setListings, setPortfolio, setQuery }: AddListingProps) {
    const account = useCurrentAccount();
    const [listingDraft, setListingDraft] = useState<ListingDraft>(freshListingDraft);

    const createListMutation = useCreateListingMutation();

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

        const newListing: ListingType = {
            id,
            name,
            description,
            minBid: minBidValue,
            currentBid: minBidValue,
            expiry: endTime,
        };

        const newPortfolio: PortfolioEntry = {
            id,
            name,
            minBid: minBidValue,
            highestBid: null,
            endsAt: endTime,
        };
        
        createListMutation({
            listing: newListing
        }).then(() => {
            setListings((prev) => [newListing, ...prev]);
            setPortfolio((prev) => [newPortfolio, ...prev]);

            setQuery("");
            setListingDraft(freshListingDraft());
            closeListingModal();
        }).catch(err => {
            alert(err);
        });
    };

    return (
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
    );
};
