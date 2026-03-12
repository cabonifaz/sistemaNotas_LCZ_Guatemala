import mysql from 'mysql2/promise';

// Configuración de la conexión para Guatemala
export const pool = mysql.createPool({
  host: '84.46.245.240',
  port: 6432,
  user: 'user_guatemala', // <--- Usuario restringido
  password: 'Guat3_Notas#2026*', // <--- Contraseña del nuevo usuario
  database: 'Registro_Notas_Guatemala', 
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
    // Los SP en mysql2 suelen devolver un array de arrays, 
    // donde la primera posición son los resultados.
    return rows[0] || []; 
  } catch (error) {
    console.error(`❌ Error en SP ${spNombre}:`, error);
    throw error;
  }
}