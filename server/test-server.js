import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Basic Node.js server working',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Test server running on port 5000');
});