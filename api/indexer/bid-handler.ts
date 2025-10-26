import { SuiEvent } from '@mysten/sui/client';
import { type BidCreateInput } from '@prisma/client/index.ts';
import axios from 'axios';

import { prisma } from '../db';
import { Bid } from '@prisma/client';

type BidEvent = {
	bid_id: string;
};

export const handleBidObjects = async (events: SuiEvent[], type: string) => {
    const updates: Record<string, BidCreateInput> = {};

    for (const event of events) {
        if (!event.type.startsWith(type)) throw new Error('Invalid event module origin');
        const data = event.parsedJson as BidEvent;

        const listingId = data.bid_id;

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
            target: string,
            bid: number,
            name: string,
            expiry: number,
            minBid: number
        } = {
            ...rawObject,
            bid: parseInt(rawObject.bid),
            expiry: parseInt(rawObject.expiry),
            minBid: parseInt(rawObject.minBid)
        };

        await prisma.bid.upsert({
            where: {
                id: listingObject.id
            },
            create: {
                id: listingObject.id,
                name: listingObject.name,
                bid: listingObject.bid,
                endTime: listingObject.expiry,
                minBid: listingObject.minBid
            },
            update: {
                name: listingObject.name,
                bid: listingObject.bid,
                endTime: listingObject.expiry,
                minBid: listingObject.minBid
            }
        })
    }
};