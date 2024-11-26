import express from "express";
import { getCitas, addCita, deleteCita, updateCita, getCitasByPaciente, getCitasByMedico, getCitasByFecha } from "../controllers/citas.controller.js";

export const citasRouter = express.Router();

// Obtener todas las citas
citasRouter.get("/", getCitas);

// Crear una nueva cita
citasRouter.post("/", addCita);

// Modificar una cita
citasRouter.patch("/:id", updateCita);

// Eliminar una nueva cita
citasRouter.delete("/:id", deleteCita);

// Obtener citas por fecha
citasRouter.get("/fecha", getCitasByFecha);

// Obtener citas por paciente
citasRouter.get("/paciente/:pacienteId", getCitasByPaciente);

// Obtener citas por medico
citasRouter.get("/medico/:medicoId", getCitasByMedico);
