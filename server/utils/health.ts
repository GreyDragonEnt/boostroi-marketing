import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../../shared/schema";

interface HealthCheck {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: "healthy" | "unhealthy";
    memory: "healthy" | "unhealthy";
    disk: "healthy" | "unhealthy";
  };
  details?: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    database: {
      connected: boolean;
      responseTime?: number;
    };
  };
}

export async function healthCheck(req: Request, res: Response) {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbStart = Date.now();
    let dbHealthy = false;
    let dbResponseTime = 0;
    
    try {
      // Simple database query to check connectivity
      await db.select().from(users).limit(1);
      dbResponseTime = Date.now() - dbStart;
      dbHealthy = dbResponseTime < 1000; // Consider healthy if response under 1s
    } catch (error) {
      console.error("Database health check failed:", error);
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;
    const memoryHealthy = memoryPercentage < 90; // Consider unhealthy if over 90%

    // Disk space would need additional checks in a real environment
    const diskHealthy = true; // Placeholder

    const allChecksHealthy = dbHealthy && memoryHealthy && diskHealthy;

    const healthData: HealthCheck = {
      status: allChecksHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      uptime: process.uptime(),
      checks: {
        database: dbHealthy ? "healthy" : "unhealthy",
        memory: memoryHealthy ? "healthy" : "unhealthy",
        disk: diskHealthy ? "healthy" : "unhealthy",
      },
      details: {
        memory: {
          used: usedMemory,
          total: totalMemory,
          percentage: Math.round(memoryPercentage * 100) / 100,
        },
        database: {
          connected: dbHealthy,
          responseTime: dbResponseTime,
        },
      },
    };

    const statusCode = allChecksHealthy ? 200 : 503;
    res.status(statusCode).json(healthData);
    
  } catch (error) {
    const errorResponse: HealthCheck = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      uptime: process.uptime(),
      checks: {
        database: "unhealthy",
        memory: "unhealthy",
        disk: "unhealthy",
      },
    };
    
    res.status(503).json(errorResponse);
  }
}

// Simple liveness probe
export function livenessProbe(req: Request, res: Response) {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
}

// Readiness probe
export async function readinessProbe(req: Request, res: Response) {
  try {
    // Check if the app is ready to accept traffic
    await db.select().from(users).limit(1);
    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      error: "Database not available",
      timestamp: new Date().toISOString(),
    });
  }
}
