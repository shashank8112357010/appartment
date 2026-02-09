import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import "dotenv/config";
import express from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const router = express.Router();
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const DATA_DIR = path.resolve(__dirname$1, "../data");
const readJson = (file) => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};
const writeJson = (file, data) => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
router.post("/auth/login", (req, res) => {
  try {
    const { phone, password, role } = req.body;
    const users = readJson("users.json") || [];
    const user = users.find(
      (u) => u.phone === phone && u.password === password && u.role === role
    );
    if (user) {
      res.json({
        success: true,
        user: { id: user.id, name: user.name, role: user.role, flatId: user.flatId }
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/apartments", (req, res) => {
  try {
    const apartments = readJson("apartments.json") || [];
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/apartments", (req, res) => {
  try {
    writeJson("apartments.json", req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/apartments/:id", (req, res) => {
  try {
    const apartments = readJson("apartments.json") || [];
    const id = parseInt(req.params.id);
    const index = apartments.findIndex((a) => a.id === id);
    if (index !== -1) {
      apartments[index] = { ...apartments[index], ...req.body };
      writeJson("apartments.json", apartments);
      res.json({ success: true, apartment: apartments[index] });
    } else {
      res.status(404).json({ error: "Apartment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/transactions", (req, res) => {
  try {
    const transactions = readJson("transactions.json") || [];
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/transactions", (req, res) => {
  try {
    const transactions = readJson("transactions.json") || [];
    const newTransaction = { ...req.body, id: req.body.id || `TX-${Date.now()}` };
    transactions.push(newTransaction);
    writeJson("transactions.json", transactions);
    res.json({ success: true, transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/transactions", (req, res) => {
  try {
    writeJson("transactions.json", req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/notifications", (req, res) => {
  try {
    const notifications = readJson("notifications.json") || [];
    const { flatId } = req.query;
    if (flatId) {
      const filtered = notifications.filter(
        (n) => n.sendToAll || n.flatId === parseInt(flatId)
      );
      res.json(filtered);
    } else {
      res.json(notifications);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/notifications", (req, res) => {
  try {
    const notifications = readJson("notifications.json") || [];
    const newNotification = {
      ...req.body,
      id: `N-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    writeJson("notifications.json", notifications);
    res.json({ success: true, notification: newNotification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/notifications/:id", (req, res) => {
  try {
    const notifications = readJson("notifications.json") || [];
    const index = notifications.findIndex((n) => n.id === req.params.id);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...req.body };
      writeJson("notifications.json", notifications);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/notifications/:id", (req, res) => {
  try {
    let notifications = readJson("notifications.json") || [];
    notifications = notifications.filter((n) => n.id !== req.params.id);
    writeJson("notifications.json", notifications);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/messages", (req, res) => {
  try {
    const messages = readJson("messages.json") || [];
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/messages", (req, res) => {
  try {
    const messages = readJson("messages.json") || [];
    const newMessage = {
      ...req.body,
      id: `M-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    messages.push(newMessage);
    writeJson("messages.json", messages);
    res.json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/budget", (req, res) => {
  try {
    const budget = readJson("budget.json") || { items: [], monthlyCollections: [] };
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/budget", (req, res) => {
  try {
    writeJson("budget.json", req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/payments", (req, res) => {
  try {
    const payments = readJson("payments.json") || [];
    const { flatId } = req.query;
    if (flatId) {
      const filtered = payments.filter((p) => p.flatId === parseInt(flatId));
      res.json(filtered);
    } else {
      res.json(payments);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/payments", (req, res) => {
  try {
    const payments = readJson("payments.json") || [];
    const newPayment = {
      ...req.body,
      id: `P-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    payments.push(newPayment);
    writeJson("payments.json", payments);
    res.json({ success: true, payment: newPayment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/tenants", (req, res) => {
  try {
    const tenants = readJson("tenants.json") || [];
    const { flatId } = req.query;
    if (flatId) {
      const filtered = tenants.filter((t) => t.flatId === parseInt(flatId));
      res.json(filtered);
    } else {
      res.json(tenants);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/tenants", (req, res) => {
  try {
    const tenants = readJson("tenants.json") || [];
    const newTenant = {
      ...req.body,
      id: `T-${Date.now()}`,
      isActive: true
    };
    tenants.push(newTenant);
    writeJson("tenants.json", tenants);
    res.json({ success: true, tenant: newTenant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/tenants/:id", (req, res) => {
  try {
    const tenants = readJson("tenants.json") || [];
    const index = tenants.findIndex((t) => t.id === req.params.id);
    if (index !== -1) {
      tenants[index] = { ...tenants[index], ...req.body };
      writeJson("tenants.json", tenants);
      res.json({ success: true, tenant: tenants[index] });
    } else {
      res.status(404).json({ error: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/tenants/:id", (req, res) => {
  try {
    let tenants = readJson("tenants.json") || [];
    tenants = tenants.filter((t) => t.id !== req.params.id);
    writeJson("tenants.json", tenants);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/maintenance", (req, res) => {
  try {
    const maintenance = readJson("maintenance.json") || [];
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/maintenance", (req, res) => {
  try {
    const maintenance = readJson("maintenance.json") || [];
    const newRequest = {
      ...req.body,
      id: `MR-${Date.now()}`,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    maintenance.push(newRequest);
    writeJson("maintenance.json", maintenance);
    res.json({ success: true, request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/maintenance/:id", (req, res) => {
  try {
    const maintenance = readJson("maintenance.json") || [];
    const index = maintenance.findIndex((m) => m.id === req.params.id);
    if (index !== -1) {
      maintenance[index] = { ...maintenance[index], ...req.body };
      writeJson("maintenance.json", maintenance);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/settings", (req, res) => {
  try {
    const settings = readJson("settings.json") || {};
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/settings", (req, res) => {
  try {
    const settings = readJson("settings.json") || {};
    const updated = { ...settings, ...req.body };
    writeJson("settings.json", updated);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/data", (req, res) => {
  try {
    res.json({
      apartments: readJson("apartments.json") || [],
      transactions: readJson("transactions.json") || [],
      notifications: readJson("notifications.json") || [],
      messages: readJson("messages.json") || [],
      budget: readJson("budget.json") || { items: [], monthlyCollections: [] },
      payments: readJson("payments.json") || [],
      tenants: readJson("tenants.json") || [],
      maintenance: readJson("maintenance.json") || [],
      settings: readJson("settings.json") || {}
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/save-transactions", (req, res) => {
  try {
    writeJson("transactions.json", req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/save-apartments", (req, res) => {
  try {
    writeJson("apartments.json", req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
function createServer() {
  const app2 = express();
  app2.use(cors());
  app2.use(express.json());
  app2.use(express.urlencoded({ extended: true }));
  app2.use("/api", router);
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const possiblePaths = [
  path.join(__dirname, "../spa"),
  path.join(process.cwd(), "dist/spa"),
  path.join(process.cwd(), "dist", "spa"),
  path.resolve("dist/spa")
];
let distPath = possiblePaths[0];
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log("Found static files at:", p);
    break;
  }
}
console.log("Using static files path:", distPath);
console.log("Path exists:", fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
  console.log("Files in dist:", fs.readdirSync(distPath));
}
const mimeTypes = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const filePath = path.join(distPath, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    return res.sendFile(filePath);
  }
  next();
});
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Frontend: http://localhost:${port}`);
  console.log(`API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
