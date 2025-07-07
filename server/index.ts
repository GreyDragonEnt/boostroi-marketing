import dotenv from "dotenv";
// Load environment variables in all environments
dotenv.config({ path: '.env' });

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error("Error:", err);
});

async function startServer() {
  try {
    console.log("1. Starting server setup...");
    
    // Check required environment variables
    if (!process.env.DATABASE_URL) {
      console.error("ERROR: DATABASE_URL environment variable is missing");
      process.exit(1);
    }
    console.log("2. Environment variables checked ✓");
    
    // Add a simple health check that works without database
    app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    console.log("3. Health check endpoint added ✓");
    
    // Create the HTTP server FIRST
    const server = createServer(app);
    console.log("4. HTTP server created ✓");
    
    // Replit deployment requires dynamic port and host binding
    const port = parseInt(process.env.PORT || process.env.REPL_PORT || "5000", 10);
    const host = process.env.HOST || process.env.REPL_HOST || "0.0.0.0";
    
    console.log(`4.1. Target binding: ${host}:${port}`);
    
    // Add server error handlers
    server.on('error', (error: any) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      }
    });

    // Start listening with timeout handling for deployment
    const serverTimeout = setTimeout(() => {
      console.error('Server startup timeout - attempting alternative binding');
      process.exit(1);
    }, 30000); // 30 second timeout
    
    server.listen(port, host, () => {
      clearTimeout(serverTimeout);
      console.log(`5. ✓ Server listening on ${host}:${port}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Process ID: ${process.pid}`);
      console.log(`✓ Available environment variables: PORT=${process.env.PORT}, HOST=${process.env.HOST}`);
      log(`serving on port ${port}`);
      
      // In production, set up static files first (synchronous)
      if (process.env.NODE_ENV !== "development") {
        console.log("7. Setting up static file serving...");
        try {
          serveStatic(app);
          console.log("8. Static file serving ready ✓");
        } catch (error) {
          console.error("Warning: Static file serving failed:", error);
        }
      }
      
      // Register routes AFTER server is listening (async)
      registerRoutes(app).then(() => {
        console.log("6. Routes registered successfully ✓");
        console.log("✓ Server fully initialized and ready for requests");
      }).catch((error) => {
        console.error("Warning: Some routes failed to register:", error);
      });
      
      // Setup Vite LAST in development only
      if (process.env.NODE_ENV === "development") {
        console.log("9. Setting up Vite in development mode...");
        setupVite(app, server).then(() => {
          console.log("10. Vite setup completed ✓");
        }).catch((error) => {
          console.error("Warning: Vite setup failed:", error);
        });
      }
    });
  } catch (error) {
    console.error("FATAL: Failed to start server:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : String(error));
    console.error("Environment debug info:");
    console.error("- NODE_ENV:", process.env.NODE_ENV);
    console.error("- PORT:", process.env.PORT);
    console.error("- HOST:", process.env.HOST);
    console.error("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
