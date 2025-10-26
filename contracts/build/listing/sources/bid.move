module listing_sui::bid;

use std::string::{String};

public struct Bid has key, store {
    id: UID,
    owner: address,
    target: ID,
    bid: u64,
    name: String,
    expiry: u64,
    minBid: u64
}

public fun createBid (
    owner: address,
    target: ID,
    bid: u64,
    ctx: &mut TxContext,
    name: String,
    expiry: u64,
    minBid: u64
): Bid {
    Bid {
        id: object::new(ctx),
        owner: owner,
        target: target,
        bid: bid,
        name: name,
        expiry: expiry,
        minBid: minBid
    }
}

