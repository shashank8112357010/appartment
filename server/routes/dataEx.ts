import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const DATA_DIR = path.resolve(process.cwd(), 'server/data');

// Helper to read JSON
const readJson = (file: string) => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Helper to write JSON
const writeJson = (file: string, data: any) => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all data (bootstrapping)
router.get('/data', (req, res) => {
    try {
        const transactions = readJson('transactions.json') || [];
        const apartments = readJson('apartments.json') || [];
        res.json({ transactions, apartments });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST save transactions
router.post('/save-transactions', (req, res) => {
    try {
        writeJson('transactions.json', req.body);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST save apartments
router.post('/save-apartments', (req, res) => {
    try {
        writeJson('apartments.json', req.body);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export { router as dataExRouter };
