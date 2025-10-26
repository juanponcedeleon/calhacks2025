import React, { useState } from "react";
import { forwardRef } from "react";
import { type Listing } from "./AuctionPlatform";

interface BidSenderProps {
  // any other props here
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  listing: Listing;
}




export const BidSender = forwardRef<HTMLDivElement, BidSenderProps>((props, ref) => {
    const [bidAmount, setBidAmount] = useState(String(props.listing.minBid));
    function submitBid() {
        //TODO PRANEEL!!
        //!! here is where you submit the bid
        const num = Number(bidAmount);
        if (num < props.listing.minBid) {
            console.log("tell the user to not make it lower")
            return
        }
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
