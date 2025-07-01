import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  STRIPE_API_KEY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_SECRET,
  MONGO_URI,
  SMTP_USER,
  SMTP_PASS,
  SMTP_PORT,
} = process.env;

export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || "your-apple-client-id";
export const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || "your-apple-team-id";
export const APPLE_KEY_ID = process.env.APPLE_KEY_ID || "your-apple-key-id";
export const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || "your-apple-private-key";
export const APPLE_CALLBACK_URL = process.env.APPLE_CALLBACK_URL || "http://localhost:3000/api/v1/auth/apple/callback";
