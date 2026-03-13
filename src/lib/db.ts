import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function ejecutarSP(spNombre: string, params: any[] = []) {
  const placeholders = params.map(() => '?').join(',');
  const sql = `CALL ${spNombre}(${placeholders})`;
  
  try {
    const [rows]: any = await pool.execute(sql, params);
    return rows[0] || []; 
  } catch (error) {
    console.error(`❌ Error en SP ${spNombre}:`, error);
    throw error;
  }
}
