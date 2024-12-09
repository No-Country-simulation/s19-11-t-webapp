import express from "express";
import { citasRouter } from "./routes/citas.routes.js";
import horariosRouter from "./routes/horarios.routes.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/api/citas", citasRouter);
app.use("/api/horarios", horariosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
