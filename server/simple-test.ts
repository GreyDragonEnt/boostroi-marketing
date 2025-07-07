import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Simple server test working", timestamp: new Date().toISOString() });
});

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

const server = createServer(app);
const port = 5000;

console.log("Starting simple server...");
server.listen(port, "0.0.0.0", () => {
  console.log(`Simple server running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});