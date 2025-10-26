// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTANTS, QueryKey } from "@/constants";
import Listing from "./listing";
import { constructUrlSearchParams, getNextPageParam } from "@/utils/helpers";
import { type ListingType } from "../../AuctionPlatform"
import { useState } from "react";

type ListingQuery = {
  escrowId?: string;
  sender?: string;
  recipient?: string;
  cancelled?: string;
  swapped?: string;
  limit?: string;
};

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
export function ListingList({
  params,
  enableSearch,
}: {
  params: ListingQuery;
  enableSearch?: boolean;
}) {
  const [escrowId, setEscrowId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [QueryKey.Escrow, params, escrowId],
      queryFn: async ({ pageParam }) => {
        const data = await fetch(
          CONSTANTS.apiEndpoint +
            "escrows" +
            constructUrlSearchParams({
              ...params,
              ...(pageParam ? { cursor: pageParam as string } : {}),
              ...(escrowId ? { objectId: escrowId } : {}),
            }),
        );
        return data.json();
      },
      select: (data) => data.pages.flatMap((page) => page.data),
      getNextPageParam,
    });

  return (
    <section aria-label="Browse listings">
        <div className="listing-grid">
            {filteredListings.map((listing) => (
            <Listing 
                listing={listing}
                setBidOpen={setBidOpen}
                setCurrentListing={setCurrentListing}
            />
            ))}
        </div>
        {filteredListings.length === 0 && (
            <p className="empty-state">Nothing matched your search. Try another keyword.</p>
        )}
    </section>
  );
}