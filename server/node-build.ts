import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple possible paths for dist/spa
const possiblePaths = [
  path.join(__dirname, "../spa"),
  path.join(process.cwd(), "dist/spa"),
  path.join(process.cwd(), "dist", "spa"),
  path.resolve("dist/spa"),
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

// MIME type map
const mimeTypes: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Custom static file handler with proper MIME types
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }

  const filePath = path.join(distPath, req.path);

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    return res.sendFile(filePath);
  }

  next();
});

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
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

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});
