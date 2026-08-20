import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import path from 'path'

export default defineConfig({
  schema: path.join(process.cwd(), 'src/databases/prisma/schema'),
  // migrations: {
  //   path: path.join(process.cwd(), 'src/databases/migrations'),
  // },
  //dùng cho sql
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
