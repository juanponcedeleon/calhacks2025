import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Gavel, Plus, Clock } from 'lucide-react';

export default function AuctionPlatform() {
  const [allAuctions, setAllAuctions] = useState<Array<{
    id: number;
    title: string; 
    currentBid: number;
    endTime: string;
    seller: string;
    myBid: number | null;
  }>>([
    { id: 1, title: 'Vintage Watch', currentBid: 250, endTime: '2h 30m', seller: 'user123', myBid: null },
    { id: 2, title: 'Rare Vinyl Record', currentBid: 80, endTime: '5h 15m', seller: 'collector99', myBid: null },
    { id: 3, title: 'Antique Lamp', currentBid: 120, endTime: '1h 45m', seller: 'vintage_store', myBid: null },
    { id: 4, title: 'Classic Camera', currentBid: 340, endTime: '3h 20m', seller: 'photo_fan', myBid: null },
  ]);

  const [myListings, setMyListings] = useState([
    { id: 5, title: 'Gaming Console', currentBid: 180, endTime: '4h 10m', seller: 'You' },
  ]);

  const [bidAmount, setBidAmount] = useState('');
  const [newItem, setNewItem] = useState({ title: '', startingBid: '' });

  const placeBid = (id:number) => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return;

    setAllAuctions(prev => prev.map(auction => 
      auction.id === id && amount > auction.currentBid
        ? { ...auction, currentBid: amount, myBid: amount }
        : auction
    ));
    setBidAmount('');
  };

  const createListing = () => {
    if (!newItem.title || !newItem.startingBid) return;
    
    const listing = {
      id: Date.now(),
      title: newItem.title,
      currentBid: parseFloat(newItem.startingBid),
      endTime: '24h 0m',
      seller: 'You'
    };
    
    setMyListings(prev => [...prev, listing]);
    setNewItem({ title: '', startingBid: '' });
  };

  const myBids = allAuctions.filter(a => a.myBid !== null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Gavel className="h-8 w-8" />
            Auction House
          </h1>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="your-auctions">Your Auctions</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {allAuctions.map(auction => (
                <Card key={auction.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{auction.title}</CardTitle>
                    <CardDescription>Seller: {auction.seller}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Bid:</span>
                        <span className="font-semibold">${auction.currentBid}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Time Left:
                        </span>
                        <span>{auction.endTime}</span>
                      </div>
                      {auction.myBid && (
                        <div className="text-xs text-green-600 font-medium">
                          Your bid: ${auction.myBid}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Place Bid</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{auction.title}</DialogTitle>
                          <DialogDescription>
                            Current bid: ${auction.currentBid}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="bid-amount">Your Bid ($)</Label>
                            <Input
                              id="bid-amount"
                              type="number"
                              placeholder={`Min: $${auction.currentBid + 1}`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => placeBid(auction.id)}>Submit Bid</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="your-auctions" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Bids</h2>
              </div>
              {myBids.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    You haven't placed any bids yet
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myBids.map(auction => (
                    <Card key={auction.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{auction.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Your Bid:</span>
                            <span className="font-semibold text-green-600">${auction.myBid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Bid:</span>
                            <span className="font-semibold">${auction.currentBid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time Left:</span>
                            <span>{auction.endTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Listings</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      New Listing
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Listing</DialogTitle>
                      <DialogDescription>
                        List an item for auction
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="item-title">Item Title</Label>
                        <Input
                          id="item-title"
                          placeholder="Enter item name"
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="starting-bid">Starting Bid ($)</Label>
                        <Input
                          id="starting-bid"
                          type="number"
                          placeholder="0.00"
                          value={newItem.startingBid}
                          onChange={(e) => setNewItem({ ...newItem, startingBid: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={createListing}>Create Listing</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {myListings.map(listing => (
                  <Card key={listing.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Bid:</span>
                          <span className="font-semibold">${listing.currentBid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Left:</span>
                          <span>{listing.endTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}