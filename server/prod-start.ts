// Production startup script that bypasses Node.js binding restrictions
// by using the same approach as development (tsx)

import dotenv from "dotenv";
dotenv.config({ path: '.env' });

// Set production environment
process.env.NODE_ENV = "production";

// Import and start the regular server
import "./index.js";