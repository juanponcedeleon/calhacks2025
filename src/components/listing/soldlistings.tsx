// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
//import { CONSTANTS, QueryKey } from "@/constants";
import { constructUrlSearchParams, getNextPageParam } from "../helpers.tsx";
import { type ListingType } from "../../AuctionPlatform"
import { useState } from "react";
import Countdown from "react-countdown";
import { useCurrentAccount } from "@mysten/dapp-kit";

export type ListingQuery = {
  listingId?: string;
  sender?: string;
  recipient?: string;
  cancelled?: string;
  swapped?: string;
  limit?: string;
};

function formatSui(value: number): string {
  return `${value.toFixed(2)} SUI`;
}

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */

type ListingProps = {
    params: ListingQuery
}

export function CurrentListings({ params }: ListingProps) {
  const account = useCurrentAccount();
  const [listingId, setListingId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: ["listings", params, listingId],
      queryFn: async ({ pageParam }) => {
        const data = await fetch(
          "http://localhost:3000/" +
            "listings" +
            constructUrlSearchParams({
              ...params,
              ...(pageParam ? { cursor: pageParam as string } : {}),
              ...(listingId ? { objectId: listingId } : {}),
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
        <h2>Things you are selling</h2>
        <p>Review listings that are currently live in the marketplace.</p>
        </header>
        {account != null && (data != null && data?.length > 0) ? (
        <ul className="activity-list">
            {data?.map((listing) => (
            <li key={listing.id}>
                <div className="activity-primary">
                <span className="activity-title">{listing.name}</span>
                <span className="activity-status status-muted">
                    {<Countdown daysInHours={true} date={listing.endTime} />}
                </span>
                </div>
                <div className="activity-secondary">
                <span>
                    Minimum <strong>{formatSui(listing.minBid)}</strong>
                </span>
                <span>
                    Highest bid {listing.highestBid ? formatSui(listing.highestBid) : "No bids yet"}
                </span>
                </div>
            </li>
            ))}
        </ul>
        ) : (
        <p className="empty-state">You have not listed anything for auction yet.</p>
        )}
    </div>
  );
}