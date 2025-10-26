// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { type ListingType } from "../../AuctionPlatform"
// import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
// import { Button } from "@radix-ui/themes";
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   CheckCircledIcon,
//   Cross1Icon,
// } from "@radix-ui/react-icons";
// import { CONSTANTS, QueryKey } from "@/constants";
// import { ExplorerLink } from "../ExplorerLink";
// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// import { ApiEscrowObject } from "@/types/types";
// import {
//   useAcceptEscrowMutation,
//   useCancelEscrowMutation,
// } from "@/mutations/escrow";
// import { useGetLockedObject } from "@/hooks/useGetLockedObject";
// import { LockedObject } from "../locked/LockedObject";

/**
 * A component that displays an escrow and allows the user to accept or cancel it.
 * Accepts an `escrow` object as returned from the API.
 */

type BidSenderProps = {
  // any other props here
  listing: ListingType;
  setBidOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListing: React.Dispatch<React.SetStateAction<ListingType>>;
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

export function Listing({ listing, setBidOpen, setCurrentListing }: BidSenderProps) {
    return (
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
                    <dd>{formatTimeRemaining(listing.expiry)}</dd>
                </div>
            </dl>
            <button type="button" className="listing-action" onClick={(e) => {
                setBidOpen(true);
                setCurrentListing(listing);
            }}>
                Place a bid
            </button>
        </article>
    );
};

// export function Escrow({ escrow }: { escrow: ApiEscrowObject }) {
//   const account = useCurrentAccount();
//   const [isToggled, setIsToggled] = useState(true);
//   const { mutate: acceptEscrowMutation, isPending } = useAcceptEscrowMutation();
//   const { mutate: cancelEscrowMutation, isPending: pendingCancellation } =
//     useCancelEscrowMutation();

//   const suiObject = useSuiClientQuery("getObject", {
//     id: escrow?.itemId,
//     options: {
//       showDisplay: true,
//       showType: true,
//     },
//   });

//   const lockedData = useQuery({
//     queryKey: [QueryKey.Locked, escrow.keyId],
//     queryFn: async () => {
//       const res = await fetch(
//         `${CONSTANTS.apiEndpoint}locked?keyId=${escrow.keyId}`,
//       );
//       return res.json();
//     },
//     select: (data) => data.data[0],
//     enabled: !escrow.cancelled,
//   });

//   const { data: suiLockedObject } = useGetLockedObject({
//     lockedId: lockedData.data?.objectId,
//   });

//   const getLabel = () => {
//     if (escrow.cancelled) return "Cancelled";
//     if (escrow.swapped) return "Swapped";
//     if (escrow.sender === account?.address) return "You offer this";
//     if (escrow.recipient === account?.address) return "You'll receive this";
//     return undefined;
//   };
//   const getLabelClasses = () => {
//     if (escrow.cancelled) return "text-red-500";
//     if (escrow.swapped) return "text-green-500";
//     if (escrow.sender === account?.address)
//       return "bg-blue-50 rounded px-3 py-1 text-sm text-blue-500";
//     if (escrow.recipient === account?.address)
//       return "bg-green-50 rounded px-3 py-1 text-sm text-green-700";
//     return undefined;
//   };

//   return (
//     <SuiObjectDisplay
//       object={suiObject.data?.data!}
//       label={getLabel()}
//       labelClasses={getLabelClasses()}
//     >
//       <div className="p-4 flex gap-3 flex-wrap">
//         {
//           <p className="text-sm flex-shrink-0 flex items-center gap-2">
//             <ExplorerLink id={escrow.objectId} isAddress={false} />
//           </p>
//         }
//         <Button
//           className="ml-auto cursor-pointer bg-transparent text-black"
//           onClick={() => setIsToggled(!isToggled)}
//         >
//           Details
//           {isToggled ? <ArrowUpIcon /> : <ArrowDownIcon />}
//         </Button>
//         {!escrow.cancelled &&
//           !escrow.swapped &&
//           escrow.sender === account?.address && (
//             <Button
//               color="amber"
//               className="cursor-pointer"
//               disabled={pendingCancellation}
//               onClick={() =>
//                 cancelEscrowMutation({
//                   escrow,
//                   suiObject: suiObject.data?.data!,
//                 })
//               }
//             >
//               <Cross1Icon />
//               Cancel request
//             </Button>
//           )}
//         {isToggled && lockedData.data && (
//           <div className="min-w-[340px] w-full justify-self-start text-left">
//             {suiLockedObject?.data && (
//               <LockedObject
//                 object={suiLockedObject.data}
//                 itemId={lockedData.data.itemId}
//                 hideControls
//               />
//             )}

//             {!lockedData.data.deleted &&
//               escrow.recipient === account?.address && (
//                 <div className="text-right mt-5">
//                   <p className="text-xs pb-3">
//                     When accepting the exchange, the escrowed item will be
//                     transferred to you and your locked item will be transferred
//                     to the sender.
//                   </p>
//                   <Button
//                     className="cursor-pointer"
//                     disabled={isPending}
//                     onClick={() =>
//                       acceptEscrowMutation({
//                         escrow,
//                         locked: lockedData.data,
//                       })
//                     }
//                   >
//                     <CheckCircledIcon /> Accept exchange
//                   </Button>
//                 </div>
//               )}
//             {lockedData.data.deleted &&
//               !escrow.swapped &&
//               escrow.recipient === account?.address && (
//                 <div>
//                   <p className="text-red-500 text-sm py-2 flex items-center gap-3">
//                     <Cross1Icon />
//                     The locked object has been deleted so you can't accept this
//                     anymore.
//                   </p>
//                 </div>
//               )}
//           </div>
//         )}
//       </div>
//     </SuiObjectDisplay>
//   );
// }
