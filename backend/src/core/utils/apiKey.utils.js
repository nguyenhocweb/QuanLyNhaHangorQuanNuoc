import crypto from 'crypto';

/**
 * Generate a new random API Key
 * @returns {string} The plain text API key
 */
export const generateApiKey = () => {
  const bytes = crypto.randomBytes(32);
  return `pk_live_${bytes.toString('hex')}`;
};

/**
 * Hash an API Key for storing in the database
 * @param {string} apiKey The plain text API key
 * @returns {string} The SHA-256 hash of the API key
 */
export const hashApiKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Get the prefix of an API Key for display purposes
 * @param {string} apiKey The plain text API key
 * @returns {string} The prefix of the API key (e.g. pk_live_****1234)
 */
export const getApiKeyPrefix = (apiKey) => {
  const parts = apiKey.split('_');
  if (parts.length < 3) return apiKey.substring(0, 8) + '****';
  
  const keyPart = parts[2];
  const last4 = keyPart.substring(keyPart.length - 4);
  return `pk_live_****${last4}`;
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.createHash('sha256').update('QuanLyNhaHangSecretKey2026!@#').digest();
const IV_LENGTH = 16;

/**
 * Encrypt a plain text API Key using AES-256-CBC
 * @param {string} text The plain text API key
 * @returns {string} The encrypted API key (iv:encryptedText)
 */
export const encryptKey = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt an encrypted API Key using AES-256-CBC
 * @param {string} text The encrypted API key (iv:encryptedText)
 * @returns {string} The decrypted plain text API key
 */
export const decryptKey = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
