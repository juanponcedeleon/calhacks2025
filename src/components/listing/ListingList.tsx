// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
//import { CONSTANTS, QueryKey } from "@/constants";
import { Listing } from "./listing";
import { constructUrlSearchParams, getNextPageParam } from "../helpers.tsx";
import { type ListingType } from "../../AuctionPlatform"
import { useState } from "react";

export type ListingQuery = {
  listingId?: string;
  sender?: string;
  recipient?: string;
  cancelled?: string;
  swapped?: string;
  limit?: string;
};

type ListingListParams = {
  // any other props here
  params: ListingQuery;
  enableSearch: boolean;
  setBidOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListing: React.Dispatch<React.SetStateAction<ListingType>>;
}

/**
 * A component that fetches and displays a list of escrows.
 * It works by using the API to fetch them, and can be re-used with different
 * API params, as well as an optional search by escrow ID functionality.
 */
export function ListingList({
  params,
  enableSearch,
  setBidOpen,
  setCurrentListing
}: ListingListParams) {
  const [listingId, setListingId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [QueryKey.Escrow, params, listingId],
      queryFn: async ({ pageParam }) => {
        const data = await fetch(
          CONSTANTS.apiEndpoint +
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
    <section aria-label="Browse listings">
        <div className="listing-grid">
            {data?.map((listing: ListingType) => (
              <Listing 
                  listing={listing}
                  setBidOpen={setBidOpen}
                  setCurrentListing={setCurrentListing}
              />
            ))}
        </div>
        {data?.length === 0 && (
            <p className="empty-state">Nothing matched your search. Try another keyword.</p>
        )}
    </section>
  );
}