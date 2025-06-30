import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  STRIPE_API_KEY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_SECRET,
  MONGO_URI,
  SMTP_USER,
  SMTP_PASS,
  SMTP_PORT,
} = process.env;
