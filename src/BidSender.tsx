import React, { useState } from "react";
import { forwardRef } from "react";
import { type ListingType } from "./AuctionPlatform";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTransactionExecution } from "./components/useTransaction";
import { Transaction } from "@mysten/sui/transactions";
import { CONSTANTS } from "./constants";

interface BidSenderProps {
  // any other props here
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  listing: ListingType;
}

export function useCreateListingMutation(bidAmount: number) {
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

      const [coinToSend] = txb.splitCoins(txb.gas, [bidAmount * 1000000])

      txb.moveCall({
        target: `${CONSTANTS.listingContract.packageId}::listing::recievebid`,
        arguments: [
          txb.object(listing.id),
          coinToSend,
          txb.pure.address('0x6')
        ]
      });

      return executeTransaction(txb);
    })
}

export const BidSender = forwardRef<HTMLDivElement, BidSenderProps>((props, ref) => {
    const [bidAmount, setBidAmount] = useState(String(props.listing.minBid));
    function submitBid() {
        //TODO PRANEEL!!
        //!! here is where you submit the bid
        const num = parseInt(bidAmount);
        if (num < props.listing.minBid) {
            console.log("tell the user to not make it lower")
            return
        }

        // once you have validated everything close it
        props.setOpen(false);
    }
    return <div className="modal-overlay" role="dialog" aria-modal="true" style={{visibility: props.open ? "visible" : "hidden"}}>
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>{props.listing.name}</h3>
                <p>Enter an amount to bid</p>
              </div>
              <button
                type="button"
                className="close-bid-sender"
                onClick={(e) => {
                    props.setOpen(false)
                }}
              >
                ×
              </button>
            </header>

            <div className="modal-body">
              <label className="modal-label">
                Amount must be &ge; {props.listing.minBid} SUI
                <input
                  type="number"
                  min={props.listing.minBid}
                  value={String(bidAmount)}
                  onChange={(e) => {
                    const num = e.target.value;
                    
                    setBidAmount(num);
                  }}
                />
            </label>
            </div>

            <footer className="modal-footer">
              <button type="button" className="modal-secondary" onClick={(e) => {
                props.setOpen(false);
              }}>
                Cancel
              </button>
              <button type="button" className="modal-primary" onClick={submitBid} >
                Submit Bid
              </button>
            </footer>
          </div>
        </div>
});
