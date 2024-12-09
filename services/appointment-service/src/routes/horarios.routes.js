import { Router } from "express";
import {
  getHorarios,
  getHorarioByMedicoId,
  addHorario,
  updateHorario,
  deleteHorario,
  getHorariosDisponibles,
} from "../controllers/horarios.controller.js";

const router = Router();

// Obtener todos los horarios
router.get("/", getHorarios);

// Obtener horarios disponibles por médico
router.get("/disponibles", getHorariosDisponibles);

// Obtener un horario de un médico
router.get("/:id", getHorarioByMedicoId);

// Crear un nuevo horario
router.post("/", addHorario);

// Actualizar un horario
router.put("/:id", updateHorario);

// Eliminar (o desactivar) un horario
router.delete("/:id", deleteHorario);

export default router;
