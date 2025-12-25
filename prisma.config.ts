import { defineConfig } from "prisma/config";
import { resolve } from "path";
import dotenv from "dotenv";

// Load env files
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url:  process.env.DIRECT_URL
  }
});

/*import 'dotenv/config'
import { defineConfig, env } from "prisma/config";*/


