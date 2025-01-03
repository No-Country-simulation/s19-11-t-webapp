import dayjs from "dayjs";
import { citasService } from "../services/citas.service.js";
import { horariosService } from "../services/horarios.service.js";
import axios from "axios";

// Obtener todas las citas con filtros opcionales
export const getCitas = async (req, res) => {
  try {
    const { fecha, estado, pacienteId, medicoId, sort, order, limit } = req.query;

    const citas = await citasService.getAllCitas({ fecha, estado, pacienteId, medicoId, sort, order, limit });

    // Traer datos de los médicos y pacientes para cada cita
    const citasCompletas = await Promise.all(
      citas.map(async (cita) => {
        let medico = null;
        let paciente = null;

        try {
          // Obtener datos del médico
          const medicoApiUrl = `http://localhost:8000/api/medicos/${cita.id_medico}`;
          const medicoResponse = await axios.get(medicoApiUrl);
          const { usuario, ...restoMedico } = medicoResponse.data; // Desestructura `usuario` y el resto de `medico`
          usuario.initials = usuario.first_name[0] + usuario.last_name[0];
          medico = { ...usuario, ...restoMedico }; // Combina ambos objetos en un solo nivel
        } catch (error) {
          console.error(`Error al obtener datos del médico para cita ${cita.id_cita}:`, error.message);
        }

        try {
          // Obtener datos del paciente
          const pacienteApiUrl = `http://localhost:8000/api/pacientes/${cita.id_paciente}`;
          const pacienteResponse = await axios.get(pacienteApiUrl);
          const { usuario, ...restoPaciente } = pacienteResponse.data; // Desestructura `usuario` y el resto de `paciente`
          usuario.initials = usuario.first_name[0] + usuario.last_name[0];
          paciente = { ...usuario, ...restoPaciente }; // Combina ambos objetos en un solo nivel
        } catch (error) {
          console.error(`Error al obtener datos del paciente para cita ${cita.id_cita}:`, error.message);
        }

        // Retornar la cita con los datos planos
        return { ...cita, medico, paciente };
      })
    );

    res.json(citasCompletas); // Responde con las citas completas
  } catch (error) {
    console.error("Error al obtener las citas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cita
export const addCita = async (req, res) => {
  const { id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo } = req.body;
  console.log("citas recibe");
  console.log("pacienteId", id_paciente);
  console.log("medicoId", id_medico);
  console.log("fecha", fecha);
  console.log("hora_inicio", hora_inicio);
  console.log("hora_fin", hora_fin);
  console.log("tipo", tipo);

  try {
    // Validar campos requeridos
    if (!id_medico || !id_paciente || !fecha || !hora_inicio || !hora_fin || !tipo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar tipo de cita
    if (!["presencial", "virtual"].includes(tipo)) {
      return res.status(400).json({ message: 'El tipo de cita debe ser "presencial" o "virtual"' });
    }

    // Validar horarios
    if (hora_inicio >= hora_fin) {
      return res.status(400).json({ message: "La hora de inicio debe ser menor que la hora de fin" });
    }

    // Validar que se encuentre en los horarios del médico
    const horarioValido = await getHorarioValido(id_medico, fecha, hora_inicio, hora_fin);
    if (!horarioValido) return res.status(400).json({ message: "La cita no se encuentra en un horario disponible para este médico" });

    // Validar que no se superponga con otra cita
    const citas = await citasService.getCitasByMedicoAndDate(id_medico, fecha);
    const superposicion = citas.some((cita) => hora_inicio < cita.hora_fin && hora_fin > cita.hora_inicio);
    if (superposicion) {
      return res.status(400).json({ message: "La cita se superpone con otra cita existente" });
    }

    const newCita = await citasService.addCita({ id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo });
    // res.status(201).json(newCita);
    res.status(201).json({ status: "ok", message: "La cita fue agregada correctamente", data: newCita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cita existente
export const updateCita = async (req, res) => {
  const { id } = req.params;
  const { fecha, hora_inicio, hora_fin, estado, tipo, id_medico, detalle } = req.body;

  try {
    // Validar que al menos un campo sea proporcionado
    if (!fecha && !hora_inicio && !hora_fin && !estado && !tipo && !id_medico && !detalle) {
      return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
    }

    // Validar tipo de cita si es proporcionado
    if (tipo && !["presencial", "virtual"].includes(tipo)) {
      return res.status(400).json({ message: 'El tipo de cita debe ser "presencial" o "virtual"' });
    }

    // Validar estado de la cita si es proporcionado
    if (estado && !["agendada", "cancelada", "realizada", "ausente"].includes(estado)) {
      return res.status(400).json({ message: "El estado de la cita no es válido" });
    }

    // Validar horarios
    if (hora_inicio >= hora_fin) {
      return res.status(400).json({ message: "La hora de inicio debe ser menor que la hora de fin" });
    }

    // Validar que se encuentre en los horarios del médico
    const horarioValido = getHorarioValido(id_medico, fecha, hora_inicio, hora_fin);
    if (!horarioValido) return res.status(400).json({ message: "La cita no se encuentra en un horario disponible para este médico" });

    // Validar que no se superponga con otra cita
    const citas = await citasService.getCitasByMedicoAndDate(id_medico, fecha);
    const superposicion = citas.some((cita) => hora_inicio < cita.hora_fin && hora_fin > cita.hora_inicio && cita.id != id);
    if (superposicion) {
      return res.status(400).json({ message: "La cita se superpone con otra cita existente" });
    }

    const result = await citasService.updateCita(id, { fecha, hora_inicio, hora_fin, estado, tipo, id_medico, detalle });

    // Si no se actualizó ninguna fila, devolver error 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar (cancelar) una cita
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

// Obtener citas por rango de fechas
export const getCitasByFecha = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({ error: "Debe proporcionar 'inicio' y 'fin' como rango de fechas" });
    }

    const citas = await citasService.getCitasByFecha(inicio, fin);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener citas por paciente
export const getCitasByPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await citasService.getCitasByPaciente(id);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener citas por médico
export const getCitasByMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await citasService.getCitasByMedico(id);
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHorarioValido = async (id_medico, fecha, hora_inicio, hora_fin) => {
  const fechaIn = dayjs(fecha);
  const dia = fechaIn.day();
  console.log("dia: ", dia);
  const horariosMedico = await horariosService.getHorarioByMedicoId(id_medico, dia);
  console.log("horarios validos medico:", horariosMedico);
  const horarioValido = horariosMedico.some((item) => item.dia_semana == dia && item.hora_inicio <= hora_inicio && hora_fin <= item.hora_fin);
  return horarioValido;
};
