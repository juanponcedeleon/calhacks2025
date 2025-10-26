module listing_sui::listing;

use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::balance::{Self, Balance};
use sui::sui::SUI;
use sui::event;

const EDeadlinePassed: u64 = 0;
const EEndedBeforeDeadline: u64 = 1;
const EBidTooLow: u64 = 2;
const EInvalidCancellation: u64 = 3;

public struct Bid has key, store {
    id: UID,
    owner: address,
    target: ID,
    bid: u64
}

public struct ListingCreated has copy, drop {
	owner: address,
	listing_id: ID
}

public struct ListingEnded has copy, drop {
	listing_id: ID
}

public struct ListingCancelled has copy, drop {
	listing_id: ID
}

public struct Listing has key {
    id: UID,
    owner: address,
    bidders: vector<address>,
    bids: vector<u64>,
    stored: u64,
    maxbid: u64,
    minbid: u64,
    collectedbids: Balance<SUI>,
    expiry: u64
}

public struct Seller has key {
    id: UID
}

public struct Storage has key {
    id: UID,
    value: u64
}

public fun create(
    stored: u64,
    owner: address,
    minbid: u64,
    expiry: u64,
    ctx: &mut TxContext
) {
    transfer::transfer(Seller {
        id: object::new(ctx)
    }, ctx.sender());

    let listed = Listing {
        id: object::new(ctx),
        owner: ctx.sender(),
        bidders: vector<address>[],
        bids: vector<u64>[],
        expiry: expiry,
        maxbid: 0,
        minbid: minbid,
        collectedbids: balance::zero<SUI>(),
        stored: stored
    };

    event::emit(ListingCreated {
        owner: ctx.sender(),
        listing_id: object::id(&listed)
    });

    transfer::share_object(listed);
}

public fun recievebid(
    listing: &mut Listing,
    bid: Coin<SUI>,
    ctx: &mut TxContext,
    clock: &Clock
): Bid {
    assert!(clock::timestamp_ms(clock) < listing.expiry, EDeadlinePassed);
    
    assert!(coin::value(&bid) >= listing.minbid, EBidTooLow);

    let bid_amount = coin::value(&bid);
    listing.bids.push_back(bid_amount);
    listing.bidders.push_back(ctx.sender());

    let balance = coin::into_balance(bid);
    balance::join(&mut listing.collectedbids, balance);

    Bid {
        id: object::new(ctx),
        bid: bid_amount,
        target: object::id(listing),
        owner: ctx.sender()
    }
}

public fun cancellisting(
    listing: &mut Listing,
    ctx: &mut TxContext
) {
    assert!(listing.owner == ctx.sender(), EInvalidCancellation);

    let size = vector::length(&listing.bids);
    let mut i = 0;

    while (i < size) {
        let refund_object = coin::take(&mut listing.collectedbids, listing.bids[i], ctx);
        transfer::public_transfer(refund_object, listing.bidders[i]);
        i = i + 1;
    };

    event::emit(ListingCancelled {
        listing_id: object::id(listing)
    });

    transfer::transfer(Storage {
        id: object::new(ctx),
        value: listing.stored
    }, listing.owner);
}

public fun endlisting(
    listing: &mut Listing,
    ctx: &mut TxContext,
    clock: &Clock
) {
    assert!(clock::timestamp_ms(clock) < listing.expiry, EEndedBeforeDeadline);

    event::emit(ListingEnded {
        listing_id: object::id(listing)
    });

    if (vector::length(&listing.bids) == 0) {
        transfer::transfer(Storage {
            id: object::new(ctx),
            value: listing.stored
        }, listing.owner);
    } else {
        let values = &listing.bids;
        let size = vector::length(values);
        let mut i = 0;
        let mut maximum = 0;
        let mut position = 0;

        while (i < size) {
            if (values[i] > maximum) {
                maximum = values[i];
                position = i;
            };
            i = i + 1;
        };

        let mut j = 0;
        while (j < size) {
            if (j != position) {
                let refund_object = coin::take(&mut listing.collectedbids, listing.bids[j], ctx);
                transfer::public_transfer(refund_object, listing.bidders[j]);
            };
            j = j + 1;
        };

        let sale_object = coin::take(&mut listing.collectedbids, listing.bids[position], ctx);
        transfer::public_transfer(sale_object, listing.owner);

        transfer::transfer(Storage {
            id: object::new(ctx),
            value: listing.stored
        }, listing.bidders[position]);
    }
}

