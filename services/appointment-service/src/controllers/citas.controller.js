import { citasService } from "../services/citas.service.js";

export const getCitas = async (req, res) => {
  try {
    const { fecha, estado, pacienteId, medicoId } = req.query;

    const citas = await citasService.getAllCitas({ fecha, estado, pacienteId, medicoId });
    console.log(citas, "citas");
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCita = async (req, res) => {
  const { id_medico, id_paciente, fecha, tipo } = req.body;

  try {
    const newCita = await citasService.addCita({ id_medico, id_paciente, fecha, tipo });
    res.status(201).json(newCita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCita = async (req, res) => {
  const { id } = req.params;
  const { fecha, estado, tipo, id_medico, detalle } = req.body;

  try {
    // Validar que al menos un campo sea proporcionado
    if (!fecha && !estado && !tipo && !id_medico && !detalle) {
      return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
    }

    // Validar valores aceptables para "tipo" si es proporcionado
    if (tipo && !["presencial", "virtual"].includes(tipo)) {
      return res.status(400).json({ message: 'El tipo de cita debe ser "presencial" o "virtual"' });
    }

    // Actualizar la cita
    const result = await citasService.updateCita(id, { fecha, estado, tipo, id_medico, detalle });

    // Si no se actualizó ninguna fila, devolver un error 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await citasService.deleteCita(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json({ message: "Cita cancelada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCitasByFecha = async (req, res) => {
  try {
    const { inicio, fin } = req.query; // ver si pasar por query o body
    if (!inicio || !fin) {
      return res.status(400).json({ error: "Debe proporcionar 'inicio' y 'fin' como rango de fechas" });
    }

    const citas = await citasService.getCitasByFecha(inicio, fin);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCitasByPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await citasService.getCitasByPaciente(id);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCitasByMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await citasService.getCitasByMedico(id);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
