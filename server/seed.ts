import "dotenv/config";
import { connectDB } from "./db/connection";
import Apartment from "./models/Apartment";
import Transaction from "./models/Transaction";

const apartments = [
  { id: 100, floor: "Ground Floor", owner: "AMAN", phone: "+91 97195 55369", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 },
  { id: 101, floor: "1st Floor", owner: "SHARMA JI", phone: "+91 96506 54026", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 },
  { id: 102, floor: "1st Floor", owner: "MANISH TOMAR", phone: "+91 99100 57679", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
  { id: 103, floor: "1st Floor", owner: "NAVEEN", phone: "+91 93128 90998", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
  { id: 201, floor: "2nd Floor", owner: "DANGWAL", phone: "+91 98104 15054", status: "Pending for Feb'26", lastPayment: "Jan 2026", amount: 250, type: "due", advance: 0, pending: 250, deposit: 0 },
  { id: 202, floor: "2nd Floor", owner: "GIRISH PANDEY", phone: "+91 99113 00816", status: "Pending for Oct'25-Feb'26", lastPayment: "Sep 2025", amount: 1250, type: "due", advance: 0, pending: 1250, deposit: 0 },
  { id: 203, floor: "2nd Floor", owner: "BIKRAM", phone: "+91 99112 20555", status: "Pending for Jan-Feb'26", lastPayment: "Dec 2025", amount: 500, type: "due", advance: 0, pending: 500, deposit: 0 },
  { id: 301, floor: "3rd Floor", owner: "GIRISH", phone: "+91 99999 71362", status: "Partial Advance till Mar'26", lastPayment: "Feb 2026", amount: 138, type: "advance", advance: 138, pending: 0, deposit: 0 },
  { id: 302, floor: "3rd Floor", owner: "ARVIND", phone: "+91 99996 06636", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
  { id: 303, floor: "3rd Floor", owner: "CHANDAN", phone: "+91 99118 28077", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 }
];

const transactions = [
  { txId: "TX-1707038400000", date: "2024-02-04", amount: 1000, description: "Maintenance Fee", category: "MAINTENANCE", type: "CREDIT", timestamp: 1707038400000 },
  { txId: "TX-1707124800000", date: "2024-02-05", amount: 500, description: "Late Fee", category: "PENALTY", type: "DEBIT", timestamp: 1707124800000 }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    await Apartment.deleteMany({});
    await Transaction.deleteMany({});
    console.log("Cleared existing data");

    // Insert apartments
    await Apartment.insertMany(apartments);
    console.log(`Inserted ${apartments.length} apartments`);

    // Insert transactions
    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
