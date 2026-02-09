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

// ============ AUTH ============
router.post('/auth/login', (req, res) => {
  try {
    const { phone, password, role } = req.body;
    const users = readJson('users.json') || [];

    const user = users.find((u: any) =>
      u.phone === phone && u.password === password && u.role === role
    );

    if (user) {
      res.json({
        success: true,
        user: { id: user.id, name: user.name, role: user.role, flatId: user.flatId }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ APARTMENTS ============
router.get('/apartments', (req, res) => {
  try {
    const apartments = readJson('apartments.json') || [];
    res.json(apartments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/apartments', (req, res) => {
  try {
    writeJson('apartments.json', req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/apartments/:id', (req, res) => {
  try {
    const apartments = readJson('apartments.json') || [];
    const id = parseInt(req.params.id);
    const index = apartments.findIndex((a: any) => a.id === id);

    if (index !== -1) {
      apartments[index] = { ...apartments[index], ...req.body };
      writeJson('apartments.json', apartments);
      res.json({ success: true, apartment: apartments[index] });
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TRANSACTIONS ============
router.get('/transactions', (req, res) => {
  try {
    const transactions = readJson('transactions.json') || [];
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/transactions', (req, res) => {
  try {
    const transactions = readJson('transactions.json') || [];
    const newTransaction = { ...req.body, id: req.body.id || `TX-${Date.now()}` };
    transactions.push(newTransaction);
    writeJson('transactions.json', transactions);
    res.json({ success: true, transaction: newTransaction });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/transactions', (req, res) => {
  try {
    writeJson('transactions.json', req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ NOTIFICATIONS ============
router.get('/notifications', (req, res) => {
  try {
    const notifications = readJson('notifications.json') || [];
    const { flatId } = req.query;

    if (flatId) {
      const filtered = notifications.filter((n: any) =>
        n.sendToAll || n.flatId === parseInt(flatId as string)
      );
      res.json(filtered);
    } else {
      res.json(notifications);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notifications', (req, res) => {
  try {
    const notifications = readJson('notifications.json') || [];
    const newNotification = {
      ...req.body,
      id: `N-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    writeJson('notifications.json', notifications);
    res.json({ success: true, notification: newNotification });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/notifications/:id', (req, res) => {
  try {
    const notifications = readJson('notifications.json') || [];
    const index = notifications.findIndex((n: any) => n.id === req.params.id);

    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...req.body };
      writeJson('notifications.json', notifications);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/notifications/:id', (req, res) => {
  try {
    let notifications = readJson('notifications.json') || [];
    notifications = notifications.filter((n: any) => n.id !== req.params.id);
    writeJson('notifications.json', notifications);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CHAT MESSAGES ============
router.get('/messages', (req, res) => {
  try {
    const messages = readJson('messages.json') || [];
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/messages', (req, res) => {
  try {
    const messages = readJson('messages.json') || [];
    const newMessage = {
      ...req.body,
      id: `M-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    writeJson('messages.json', messages);
    res.json({ success: true, message: newMessage });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ BUDGET ============
router.get('/budget', (req, res) => {
  try {
    const budget = readJson('budget.json') || { items: [], monthlyCollections: [] };
    res.json(budget);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/budget', (req, res) => {
  try {
    writeJson('budget.json', req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAYMENTS ============
router.get('/payments', (req, res) => {
  try {
    const payments = readJson('payments.json') || [];
    const { flatId } = req.query;

    if (flatId) {
      const filtered = payments.filter((p: any) => p.flatId === parseInt(flatId as string));
      res.json(filtered);
    } else {
      res.json(payments);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payments', (req, res) => {
  try {
    const payments = readJson('payments.json') || [];
    const newPayment = {
      ...req.body,
      id: `P-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    writeJson('payments.json', payments);
    res.json({ success: true, payment: newPayment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ TENANTS ============
router.get('/tenants', (req, res) => {
  try {
    const tenants = readJson('tenants.json') || [];
    const { flatId } = req.query;

    if (flatId) {
      const filtered = tenants.filter((t: any) => t.flatId === parseInt(flatId as string));
      res.json(filtered);
    } else {
      res.json(tenants);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tenants', (req, res) => {
  try {
    const tenants = readJson('tenants.json') || [];
    const newTenant = {
      ...req.body,
      id: `T-${Date.now()}`,
      isActive: true
    };
    tenants.push(newTenant);
    writeJson('tenants.json', tenants);
    res.json({ success: true, tenant: newTenant });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/tenants/:id', (req, res) => {
  try {
    const tenants = readJson('tenants.json') || [];
    const index = tenants.findIndex((t: any) => t.id === req.params.id);

    if (index !== -1) {
      tenants[index] = { ...tenants[index], ...req.body };
      writeJson('tenants.json', tenants);
      res.json({ success: true, tenant: tenants[index] });
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tenants/:id', (req, res) => {
  try {
    let tenants = readJson('tenants.json') || [];
    tenants = tenants.filter((t: any) => t.id !== req.params.id);
    writeJson('tenants.json', tenants);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ MAINTENANCE REQUESTS ============
router.get('/maintenance', (req, res) => {
  try {
    const maintenance = readJson('maintenance.json') || [];
    res.json(maintenance);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/maintenance', (req, res) => {
  try {
    const maintenance = readJson('maintenance.json') || [];
    const newRequest = {
      ...req.body,
      id: `MR-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    maintenance.push(newRequest);
    writeJson('maintenance.json', maintenance);
    res.json({ success: true, request: newRequest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/maintenance/:id', (req, res) => {
  try {
    const maintenance = readJson('maintenance.json') || [];
    const index = maintenance.findIndex((m: any) => m.id === req.params.id);

    if (index !== -1) {
      maintenance[index] = { ...maintenance[index], ...req.body };
      writeJson('maintenance.json', maintenance);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SETTINGS ============
router.get('/settings', (req, res) => {
  try {
    const settings = readJson('settings.json') || {};
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/settings', (req, res) => {
  try {
    const settings = readJson('settings.json') || {};
    const updated = { ...settings, ...req.body };
    writeJson('settings.json', updated);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ BOOTSTRAP ALL DATA ============
router.get('/data', (req, res) => {
  try {
    res.json({
      apartments: readJson('apartments.json') || [],
      transactions: readJson('transactions.json') || [],
      notifications: readJson('notifications.json') || [],
      messages: readJson('messages.json') || [],
      budget: readJson('budget.json') || { items: [], monthlyCollections: [] },
      payments: readJson('payments.json') || [],
      tenants: readJson('tenants.json') || [],
      maintenance: readJson('maintenance.json') || [],
      settings: readJson('settings.json') || {}
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Legacy endpoints
router.post('/save-transactions', (req, res) => {
  try {
    writeJson('transactions.json', req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/save-apartments', (req, res) => {
  try {
    writeJson('apartments.json', req.body);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as dataExRouter };
