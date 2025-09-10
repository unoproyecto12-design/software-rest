import mysql from "mysql2/promise";

// Crea un pool de conexiones
const pool = mysql.createPool({
  host: "localhost",
  user: "root",       // tu usuario
  password: "",       // tu contraseña
  database: "restaurant_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params: any[] = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
