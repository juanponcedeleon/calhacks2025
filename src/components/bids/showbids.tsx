import { useInfiniteQuery } from "@tanstack/react-query";
import { constructUrlSearchParams, getNextPageParam } from "../helpers";
import Countdown from "react-countdown";
import { useState } from "react";
import { type ListingType } from "@/AuctionPlatform";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../../constants";
import { useTransactionExecution } from "../useTransaction";
import { Transaction } from "@mysten/sui/transactions";
/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
function formatSui(value: number): string {
  return `${value.toFixed(2)} SUI`;
}

export type BidQuery = {
  bidId?: string;
};

type BidProps = {
    params: BidQuery
}

export function ShowBids({ params }: BidProps) {
  const [bidId, setbidId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: ["bids", params, bidId],
      queryFn: async ({ pageParam }) => {
        const data = await fetch(
          "http://localhost:3000/" +
            "bids" +
            constructUrlSearchParams({
              ...params,
              ...(pageParam ? { cursor: pageParam as string } : {}),
              ...(bidId ? { objectId: bidId } : {}),
            }),
        );
        return data.json();
      },
      select: (data) => data.pages.flatMap((page) => page.data),
      getNextPageParam,
    });

  return (
    <div className="activity-card">
        <header>
        <h2>Things you have bid on</h2>
        <p>Track how your offers are performing across live auctions.</p>
        </header>
        {data?.length && data?.length > 0 ? (
            <ul className="activity-list">
                {data?.map((bid) => (
                <li key={bid.id}>
                    <div className="activity-primary">
                    <span className="activity-title">{bid.name}</span>
                    </div>
                    <div className="activity-secondary">
                    <span>
                        Your bid <strong>{formatSui(bid.bidAmount)}</strong>
                    </span>
                    <span>Minimum {formatSui(bid.minBid)}</span>
                    <span>Ends in {<Countdown daysInHours={true} date={bid.endTime} />}</span>
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p className="empty-state">You have not placed any bids yet.</p>
        )}
    </div>
  );
}

    // <section aria-label="Browse listings">
    //         <div className="listing-grid">
    //             {data?.map((listing: ListingType) => (
    //               <Listing 
    //                   listing={listing}
    //                   setBidOpen={setBidOpen}
    //                   setCurrentListing={setCurrentListing}
    //               />
    //             ))}
    //         </div>
    //         {data?.length === 0 && (
    //             <p className="empty-state">Nothing matched your search. Try another keyword.</p>
    //         )}
    //     </section>