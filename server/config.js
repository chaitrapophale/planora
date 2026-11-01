import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const geminiKey = process.env.GEMINI_API_KEY || '';
const isValidKey = Boolean(
  geminiKey && 
  geminiKey.trim() !== '' && 
  !geminiKey.includes('your_') && 
  geminiKey.length > 15
);

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  GEMINI_API_KEY: geminiKey.trim(),
  AI_MODEL: process.env.AI_MODEL || 'gemini-3-flash-preview',
  HAS_API_KEY: isValidKey,
  PROVIDER_NAME: 'Google Gemini'
};
