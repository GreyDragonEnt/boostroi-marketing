import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, json, simple, colorize } = format;

// Custom format for development
const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  simple()
);

// Custom format for production
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "boostroi-api" },
  transports: [
    new transports.Console(),
    // In production, you might want to add file transports or external services
    ...(process.env.NODE_ENV === "production" 
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" })
        ] 
      : []
    )
  ],
});

// Create request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
    };

    if (res.statusCode >= 400) {
      logger.warn("HTTP Request Error", logData);
    } else {
      logger.info("HTTP Request", logData);
    }
  });

  next();
};
