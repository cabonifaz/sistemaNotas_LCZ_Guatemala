import mysql from 'mysql2/promise';

// Configuración de la conexión
export const pool = mysql.createPool({
  host: '84.46.245.240',
  port: 6432,
  user: 'root', 
  password: 'SqlDev123*', 
  database: 'Registro_Notas_Guatemala', // <--- Nombre actualizado
  waitForConnections: true,
  connectionLimit: 10,
});

export async function ejecutarSP(spNombre: string, params: any[] = []) {
  const placeholders = params.map(() => '?').join(',');
  const sql = `CALL ${spNombre}(${placeholders})`;
  
  try {
    const [rows]: any = await pool.execute(sql, params);
    return rows[0]; // Retorna los datos que devuelve el SP
  } catch (error) {
    console.error(`Error en SP ${spNombre}:`, error);
    throw error;
  }
}