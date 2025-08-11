require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const path = require('path');
const { createClient } = require('redis');

const app = express();
console.log('🚀 server.js is executing...');
app.use(express.json());
// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Redis connection with TLS (Redis Cloud)
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    rejectUnauthorized: false, // optional, if cert issues
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redisClient
  .connect()
  .then(() => {
    console.log(
      `📡 Connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT} (TLS)`,
    );
  })
  .catch(console.error);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
