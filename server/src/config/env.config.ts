import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URI: z.string().url().nonempty("MONGODB_URI is required"),
  CLIENT_URL: z.string().url().nonempty("CLIENT_URI is required"),
  COOKIE_SECRET: z.string().nonempty("COOKIE_SECRET is required"),
  JWT_SECRET: z.string().nonempty("JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().nonempty("JWT_REFRESH_SECRET is required"),
  JWT_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_EXPIRATION: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  GOOGLE_CLIENT_ID: z.string().nonempty("GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().nonempty("GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .nonempty("GOOGLE_CALLBACK_URL is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
