import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

async function run() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
  const pool = new Pool({ connectionString });
  const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
    console.log('Running', f);
    await pool.query(sql);
  }
  await pool.end();
  console.log('Migrations complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
