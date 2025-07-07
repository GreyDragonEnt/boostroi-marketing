#!/usr/bin/env node

// Specialized deployment script for Replit environments
// Handles the unique networking requirements of Replit deployments

const express = require('express');
const { createServer } = require('http');
const path = require('path');

console.log('Starting Replit deployment server...');

// Create Express app
const app = express();

// Health check endpoint (required for Replit deployments)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist/public')));

// Serve the frontend for all routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Create server
const server = createServer(app);

// Use Replit's environment variables
const port = process.env.PORT || process.env.REPL_PORT || 5000;
const host = process.env.HOST || process.env.REPL_HOST || '0.0.0.0';

// Start server with enhanced error handling
server.listen(port, host, () => {
  console.log(`✅ Replit deployment server running on ${host}:${port}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`✅ Serving static files from: ${path.join(__dirname, 'dist/public')}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});