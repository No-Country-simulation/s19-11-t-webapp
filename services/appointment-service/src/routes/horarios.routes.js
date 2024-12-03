import { Router } from "express";
import {
  getHorarios,
  getHorarioByMedicoId,
  addHorario,
  updateHorario,
  deleteHorario,
  getHorariosLibresByMedicoId,
  getHorariosLibresByEspecialidad,
} from "../controllers/horarios.controller.js";

const router = Router();

// Obtener todos los horarios
router.get("/", getHorarios);

// Obtener un horario de un médico
router.get("/:id", getHorarioByMedicoId);

// Crear un nuevo horario
router.post("/", addHorario);

// Actualizar un horario
router.put("/:id", updateHorario);

// Eliminar (o desactivar) un horario
router.delete("/:id", deleteHorario);

// Obtener horarios libres por médico
router.get("/libres/medico/:id", getHorariosLibresByMedicoId);

// Obtener horarios libres por médico
router.get("/libres/especialidad/:id", getHorariosLibresByEspecialidad);

export default router;
