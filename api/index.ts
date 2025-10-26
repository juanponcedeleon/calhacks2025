import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { PrismaClient } from "@prisma/client";


const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get("/api", async (req, res) => {
    const listing = await prisma.listing.create({
    data: {
      name: "First Item",
      description: "Testing Calhacks_2025 DB",
      endTime: new Date("2025-11-01T00:00:00Z"),
      minBid: 10.5,
    },
  });
})

app.post('/api/create-listing', async (req, res) => {
  const { id, name, description, endTime, minBid } = req.body;
  
  //TODO ADD IMAGE

  // add the listing a user created to the db
  const listing = await prisma.listing.create({
    data: {
      id: id,
      name: name,
      description: description,
      endTime: new Date(endTime),
      minBid: minBid,
    },
  });

  console.log("Added Listing ✅:")
  console.log(listing)
  res.status(200);
});

app.post('/api/bid', async (req, res) => {
  const { listingID, amount, personnnn } = req.body;

  // get the listing from database
  const listing = await prisma.listing.findUnique({
    where: { id: listingID }
  });
  // just in case endTime is null
  if (listing?.endTime == null) {
    console.log("bro it doesn't have an end time")
    return res.status(404).send("Sorry our services aren't working properly");
  }
  // ensure its in time
  if (Date.now() > listing?.endTime.getMilliseconds()) {
    console.log("It's too late to bid on this one!");
    return res.status(410).send("It's too late to bid on this one!");
  }
  //TODO submit bid

  res.status(200);
});


// get all listings in ascending order
app.get('/api/get-listing/', async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: { endTime: {
        gt: new Date()
      }
    },
    orderBy: {
      endTime: 'asc'
    },
    //take: 10
    //! uncomment the top one if you want to limit to 10
  });

  res.json(listings)
});

// get a specific listing
app.get('/api/get-listing/:listingId', async (req, res) => {
  const { listingId } = req.params;

  const listing = await prisma.listing.findFirst({
    where: { id: listingId }
  });

  res.json(listing);
});

export default app;
