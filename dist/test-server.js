const http = require('http');

console.log('Starting minimal test server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT env var:', process.env.PORT);
console.log('HOST env var:', process.env.HOST);

const port = parseInt(process.env.PORT || '5000', 10);
const host = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Minimal test server running'
  }));
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`✓ Minimal server listening on ${host}:${port}`);
  console.log('Process ID:', process.pid);
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});