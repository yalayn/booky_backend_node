// src/infrastructure/config/redis.js

const redis = require('redis');
const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

console.info('\nIniciando cliente redis...\n');

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.on('connect', () => {
    console.info('Connected to Redis');
});

module.exports = client;
