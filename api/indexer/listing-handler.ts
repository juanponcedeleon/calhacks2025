import { SuiEvent } from '@mysten/sui/client';
import axios from 'axios';

import { prisma } from '../db';
import { Prisma } from '@prisma/client';

type ListingEvent = ListingCreated | ListingEnded | ListingCancelled;

type ListingCreated = {
	owner: string;
	listing_id: string;
};

type ListingEnded = {
	listing_id: string;
};

type ListingCancelled = {
	listing_id: string;
};

export const handleListingObjects = async (events: SuiEvent[], type: string) => {
    const updates: Record<string, Prisma.ListingCreateInput> = {};

    for (const event of events) {
        if (!event.type.startsWith(type)) throw new Error('Invalid event module origin');
        const data = event.parsedJson as ListingEvent;

        const listingId = data.listing_id;

        const res = await axios.post('https://fullnode.testnet.sui.io', JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "sui_getObject",
            "params": [
                listingId,
                {
                    "showType": true,
                    "showOwner": true,
                    "showPreviousTransaction": true,
                    "showDisplay": false,
                    "showContent": true,
                    "showBcs": false,
                    "showStorageRebate": true
                }
            ]
            }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status !== 200) continue;

        const rawObject = res.data.result.data.content.fields;
        const listingObject: {
            id: string,
            owner: string,
            bidders: string[],
            name: string,
            description: string,
            bids: number[],
            stored: number,
            maxbid: number,
            minbid: number,
            collectedbids: number,
            expiry: number
        } = {
            ...rawObject,
            bids: rawObject.bids.map((bid: string) => parseInt(bid)),
            stored: parseInt(rawObject.stored),
            maxbid: parseInt(rawObject.maxbid),
            minbid: parseInt(rawObject.minbid),
            collectedbids: parseInt(rawObject.collectedbids),
            expiry: parseInt(rawObject.expiry)
        };

        await prisma.listing.upsert({
            where: {
                id: listingObject.id
            },
            create: {
                id: listingObject.id,
                name: listingObject.name,
                description: listingObject.description,
                endTime: listingObject.expiry,
                minBid: listingObject.minbid
            },
            update: {
                name: listingObject.name,
                description: listingObject.description,
                endTime: listingObject.expiry,
                minBid: listingObject.minbid
            }
        })
    }
};