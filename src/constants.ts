const packageId = '0x60e0e56eff9ee19d1baf072bea43883d911d1f9648149fcbc1729ad04fba636b';

export const CONSTANTS = {
  listingContract: {
    packageId,
    listingType: `${packageId}::listing::Listing`,
    sellerType: `${packageId}::listing::Seller`,
    storageType: `${packageId}::listing::Storage`,
    bidType: `${packageId}::bid::Bid`,
  },
  apiEndpoint: "http://localhost:3000/",
};