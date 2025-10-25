import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Gavel, Plus, Clock, Shield, Tag } from 'lucide-react';

export default function AuctionPlatform() {
  const [allAuctions, setAllAuctions] = useState<Array<{
    id: number;
    title: string;
    currentBid: number;
    endTime: string;
    seller: string;
    myBid: number | null;
  }>>([
    {
      id: 1,
      title: 'Vintage Watch',
      currentBid: 250,
      endTime: '2h 30m',
      seller: 'user123',
      myBid: null,
    },
    {
      id: 2,
      title: 'Rare Vinyl Record',
      currentBid: 80,
      endTime: '5h 15m',
      seller: 'collector99',
      myBid: null,
    },
    {
      id: 3,
      title: 'Antique Lamp',
      currentBid: 120,
      endTime: '1h 45m',
      seller: 'vintage_store',
      myBid: null,
    },
    {
      id: 4,
      title: 'Classic Camera',
      currentBid: 340,
      endTime: '3h 20m',
      seller: 'photo_fan',
      myBid: null,
    },
  ]);

  const [myListings, setMyListings] = useState([
    {
      id: 5,
      title: 'Gaming Console',
      currentBid: 180,
      endTime: '4h 10m',
      seller: 'You',
      myBid: null,
    },
  ]);

  const [bidAmount, setBidAmount] = useState('');
  const [newItem, setNewItem] = useState({ title: '', startingBid: '' });

  const handleBid = (id: number) => {
    const amount = parseFloat(bidAmount);
    if (!amount) return;
    setAllAuctions((prev) =>
      prev.map((auction) =>
        auction.id === id && amount > auction.currentBid
          ? { ...auction, currentBid: amount, myBid: amount }
          : auction,
      ),
    );
    setBidAmount('');
  };

  const createListing = () => {
    if (!newItem.title || !newItem.startingBid) return;
    const listing = {
      id: Date.now(),
      title: newItem.title,
      currentBid: parseFloat(newItem.startingBid),
      endTime: '24h 0m',
      seller: 'You',
      myBid: null,
    };
    setMyListings((prev) => [...prev, listing]);
    setAllAuctions((prev) => [...prev, listing]);
    setNewItem({ title: '', startingBid: '' });
  };

  const myBids = allAuctions.filter((auction) => auction.myBid !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3 mb-4">
            <Gavel className="h-10 w-10 text-purple-300" />
            Sui Auction House
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Discover, bid, and trade unique items on the world's most advanced decentralized auction platform
          </p>
        </motion.div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="browse"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white py-3"
            >
              <Shield className="h-4 w-4 mr-2" />
              Browse Auctions
            </TabsTrigger>
            <TabsTrigger 
              value="your-auctions"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white py-3"
            >
              <Tag className="h-4 w-4 mr-2" />
              Your Auctions
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="browse">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {allAuctions.map((auction, index) => (
                  <motion.div
                    key={auction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-all duration-200">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">{auction.title}</CardTitle>
                        <CardDescription className="text-purple-200">
                          Seller: {auction.seller}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-purple-200">Current Bid:</span>
                            <span className="text-white font-semibold text-lg">
                              ${auction.currentBid}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-purple-200 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Time Left:
                            </span>
                            <span className="text-white">{auction.endTime}</span>
                          </div>
                          {auction.myBid && (
                            <div className="text-sm text-green-400 font-medium bg-green-400/10 py-1 px-3 rounded-full inline-block">
                              Your bid: ${auction.myBid}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-white hover:bg-purple-50 text-purple-900"
                              disabled={auction.seller === 'You'}
                            >
                              Place Bid
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 text-white border-purple-500">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">{auction.title}</DialogTitle>
                              <DialogDescription className="text-purple-200">
                                Current bid: ${auction.currentBid}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="bid-amount" className="text-white">
                                  Your Bid ($)
                                </Label>
                                <Input
                                  id="bid-amount"
                                  type="number"
                                  min={auction.currentBid + 1}
                                  placeholder={`Min: $${auction.currentBid + 1}`}
                                  value={bidAmount}
                                  onChange={(e) => setBidAmount(e.target.value)}
                                  className="bg-gray-800 border-purple-500 text-white"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => handleBid(auction.id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Submit Bid
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="your-auctions">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Your Bids Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                      <Shield className="h-6 w-6 text-purple-300" />
                      Your Active Bids
                    </h2>
                  </div>
                  
                  {myBids.length === 0 ? (
                    <Card className="bg-white/10 backdrop-blur-sm border-0">
                      <CardContent className="pt-6 text-center text-purple-200">
                        You haven't placed any bids yet
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {myBids.map((auction, index) => (
                        <motion.div
                          key={auction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-all duration-200">
                            <CardHeader>
                              <CardTitle className="text-xl text-white">
                                {auction.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-200">Your Bid:</span>
                                  <span className="text-green-400 font-semibold text-lg">
                                    ${auction.myBid}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-200">Current Bid:</span>
                                  <span className="text-white font-semibold">
                                    ${auction.currentBid}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-200">Time Left:</span>
                                  <span className="text-white">{auction.endTime}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Your Listings Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                      <Tag className="h-6 w-6 text-purple-300" />
                      Your Listings
                    </h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          className="bg-white hover:bg-purple-50 text-purple-900"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Listing
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 text-white border-purple-500">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Create New Listing</DialogTitle>
                          <DialogDescription className="text-purple-200">
                            List an item for auction
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="item-title" className="text-white">
                              Item Title
                            </Label>
                            <Input
                              id="item-title"
                              placeholder="Enter item name"
                              value={newItem.title}
                              onChange={(e) =>
                                setNewItem({ ...newItem, title: e.target.value })
                              }
                              className="bg-gray-800 border-purple-500 text-white"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="starting-bid" className="text-white">
                              Starting Bid ($)
                            </Label>
                            <Input
                              id="starting-bid"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={newItem.startingBid}
                              onChange={(e) =>
                                setNewItem({ ...newItem, startingBid: e.target.value })
                              }
                              className="bg-gray-800 border-purple-500 text-white"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={createListing}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Create Listing
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/15 transition-all duration-200">
                          <CardHeader>
                            <CardTitle className="text-xl text-white">
                              {listing.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-purple-200">Current Bid:</span>
                                <span className="text-white font-semibold text-lg">
                                  ${listing.currentBid}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-purple-200">Time Left:</span>
                                <span className="text-white">{listing.endTime}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}