import dotenv from "dotenv";
dotenv.config();

export const config = {
  db_appointments: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "citas",
    port: process.env.DB_PORT || 3306,
  },
};
