import mysql from "mysql2/promise";
import { config } from "../config.js";

// Pool de conexiones a la base de datos
export const pool = mysql.createPool({
  host: config.db_appointments.host,
  user: config.db_appointments.user,
  password: config.db_appointments.password,
  database: config.db_appointments.database,
  port: config.db_appointments.port,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

// console.log("DB config", config.db);
