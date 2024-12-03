import mysql from "mysql2/promise";
import { config } from "../config.js";

// Pool de conexiones a la base de datos
export const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

const [rows] = await pool.query("SELECT 1 + 1 AS result");
console.log("Conexión exitosa:", rows[0].result); // Debería imprimir "2"

console.log("DB config", config.db);
