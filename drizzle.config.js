// drizzle.config.js
import "dotenv/config"; // ADD THIS LINE BACK
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./config/schema.ts", // CHANGE .js to .ts
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});