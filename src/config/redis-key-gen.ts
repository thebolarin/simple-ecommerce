// Prefix that all keys will start with, taken from .env file
let prefix = process.env.REDIS_KEY_PREFIX;
if (!prefix) prefix = 'keeneye_cache:'
/**
 * Takes a string containing a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.  Prefix is configured in .env file.
 *
 * @param {string} key - a Redis key
 * @returns {string} - a Redis key with the application prefix prepended to
 *  the value of 'key'
 */
const getKey = (key: string) => `${prefix}${key}`;

/**
 * Set the global key prefix, overriding the one set in .env file.
 *
 * This is used by the test suites so that test keys do not overlap
 * with real application keys and can be safely deleted afterwards.
 *
 * @param {*} newPrefix - the new key prefix to use.
 */
const setPrefix = (newPrefix: string) => {
  prefix = newPrefix;
};

let redisKeys = {
  setPrefix,
  getKey,
};


export default redisKeys;