import sql from "mssql";

const config: sql.config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DB,
  server: process.env.AZURE_SQL_SERVER as string,
  options: {
    encrypt: true
  }
};

let pool: sql.ConnectionPool | null = null;

export async function getDbPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}
