import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
  },
  datasource: {
    url: "postgresql://user:password@localhost:5432/roomFinderDB", // Local database for generation
  },
});
