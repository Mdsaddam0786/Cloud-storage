require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('redis');
const { processFileWithAI } = require('../jobs/aiProcessor'); // Ensure this file exists

// Connect MongoDB
console.log('🔌 Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected in Worker'))
  .catch((err) => console.error('❌ MongoDB connection error in Worker:', err));

// Redis connection with TLS
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    rejectUnauthorized: false, // optional, if cert issues
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis/Worker connection error:', err);
});

redisClient
  .connect()
  .then(() => {
    console.log(
      `📡 Worker connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT} (TLS)`,
    );
    // Start processing jobs here...
  })
  .catch(console.error);

// Listen for jobs in Redis
async function listenForJobs() {
  console.log('👂 Worker listening for AI processing jobs...');
  while (true) {
    try {
      // Block until a job arrives
      const job = await redisClient.brPop('ai:tagging', 0);

      if (job && job.element) {
        const { fileId, filePath } = JSON.parse(job.element);
        console.log(`🧠 Processing file: ${filePath}`);
        await processFileWithAI(fileId, filePath);
        console.log(`✅ Finished processing file: ${filePath}`);
      }
    } catch (err) {
      console.error('❌ Error processing job:', err);
    }
  }
}
listenForJobs();
