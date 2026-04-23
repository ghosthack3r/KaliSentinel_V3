import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import os from "os";
import sysinfo from "systeminformation";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Telemetry
  app.get("/api/telemetry", async (req, res) => {
    try {
      const cpuLoad = await sysinfo.currentLoad();
      const mem = await sysinfo.mem();
      const network = await sysinfo.networkStats();
      const rx = network && network.length > 0 ? network[0].rx_sec : 0;
      
      res.json({
        cpu: cpuLoad.currentLoad,
        memoryUsage: (mem.active / mem.total) * 100,
        rx_sec: rx,
        timestamp: Date.now()
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to get telemetry" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support React Router SPA fallback for all unknown routes
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
