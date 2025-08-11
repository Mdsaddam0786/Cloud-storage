// testRedis.js
require('dotenv').config();
const Redis = require('ioredis');

const client = new Redis({
  host: 'redis-19726.c91.us-east-1-3.ec2.redns.redis-cloud.com',
  port: 19726,
  username: 'default',
  password: 'E0InWL4TIbKgPKpIGJesb63O0Jg6WPVX',
  // No TLS here because your Redis Cloud instance is not SSL-enabled
});

client
  .ping()
  .then((res) => {
    console.log('✅ Redis PING:', res);
    client.quit();
  })
  .catch((err) => {
    console.error('❌ Redis connection failed:', err);
    client.quit();
  });
