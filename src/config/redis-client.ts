import * as redis from 'redis';
import bluebird from 'bluebird';

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration from env
const clientConfig:any = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: "1"
};

if (process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.length > 0 && process.env.REDIS_PASSWORD !== null) {
  clientConfig.password = process.env.REDIS_PASSWORD;
}

if (process.env.REDIS_URL && process.env.REDIS_URL.length > 0 && process.env.REDIS_URL !== null) {
  clientConfig.url = process.env.REDIS_URL;
}

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on('error', (error) => console.log(error));

client.connect();

let newRedis = {
  /**
   * Get the application's connected Redis client instance.
   *
   * @returns {Object} - a connected node_redis client instance.
   */
  getClient: () => client,
};

export default newRedis
