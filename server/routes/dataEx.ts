import express from 'express';
import Apartment from '../models/Apartment';
import Transaction from '../models/Transaction';

const router = express.Router();

// GET all data (bootstrapping)
router.get('/data', async (req, res) => {
  try {
    const apartments = await Apartment.find().sort({ id: 1 });
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json({
      transactions: transactions.map(t => ({
        id: t.txId,
        date: t.date,
        amount: t.amount,
        description: t.description,
        category: t.category,
        type: t.type,
        flatId: t.flatId,
        createdBy: t.createdBy,
        proofUrl: t.proofUrl,
        timestamp: t.timestamp
      })),
      apartments: apartments.map(a => ({
        id: a.id,
        floor: a.floor,
        owner: a.owner,
        phone: a.phone,
        status: a.status,
        lastPayment: a.lastPayment,
        amount: a.amount,
        type: a.type,
        advance: a.advance,
        pending: a.pending,
        deposit: a.deposit
      }))
    });
  } catch (err: any) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST save transactions (replace all)
router.post('/save-transactions', async (req, res) => {
  try {
    const transactions = req.body;

    // Clear existing and insert new
    await Transaction.deleteMany({});

    if (transactions && transactions.length > 0) {
      const docs = transactions.map((t: any) => ({
        txId: t.id,
        date: t.date,
        amount: t.amount,
        description: t.description,
        category: t.category,
        type: t.type,
        flatId: t.flatId,
        createdBy: t.createdBy,
        proofUrl: t.proofUrl,
        timestamp: t.timestamp
      }));
      await Transaction.insertMany(docs);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error saving transactions:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST save apartments (replace all)
router.post('/save-apartments', async (req, res) => {
  try {
    const apartments = req.body;

    // Clear existing and insert new
    await Apartment.deleteMany({});

    if (apartments && apartments.length > 0) {
      await Apartment.insertMany(apartments);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error saving apartments:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH update single apartment
router.patch('/apartments/:id', async (req, res) => {
  try {
    const apartmentId = parseInt(req.params.id);
    const updates = req.body;

    const apartment = await Apartment.findOneAndUpdate(
      { id: apartmentId },
      { $set: updates },
      { new: true }
    );

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    res.json({ success: true, apartment });
  } catch (err: any) {
    console.error('Error updating apartment:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST add single transaction
router.post('/transactions', async (req, res) => {
  try {
    const transaction = new Transaction({
      txId: req.body.id,
      date: req.body.date,
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      flatId: req.body.flatId,
      createdBy: req.body.createdBy,
      proofUrl: req.body.proofUrl,
      timestamp: req.body.timestamp
    });

    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (err: any) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: err.message });
  }
});

export { router as dataExRouter };
