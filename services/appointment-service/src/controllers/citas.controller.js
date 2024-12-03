import dayjs from "dayjs";

import { citasService } from "../services/citas.service.js";
import { horariosService } from "../services/horarios.service.js";

// Obtener todas las citas con filtros opcionales
export const getCitas = async (req, res) => {
  try {
    const { fecha, estado, pacienteId, medicoId } = req.query;

    const citas = await citasService.getAllCitas({ fecha, estado, pacienteId, medicoId });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cita
export const addCita = async (req, res) => {
  const { id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo } = req.body;

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
    res.status(201).json(newCita);
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
  const horarioValido = horariosMedico.some((item) => item.dia_semana == dia && item.hora_inicio <= hora_inicio && hora_fin <= item.hora_fin);
  return horarioValido;
};

export const getHorariosDisponibles = async (req, res) => {
  const { id_medico, duracion = 30, limite = 10, dia = null } = req.query;
  try {
    // 1. Obtener horarios de trabajo del médico
    const horarios = await horariosService.getHorarioByMedicoId(id_medico, dia);
    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ message: "El médico no tiene horarios definidos." });
    }
    // console.log("horarios disponibles del medico", horarios);

    // 2. Obtener citas agendadas del médico desde hoy en adelante
    const hoy = dayjs().startOf("day").format("YYYY-MM-DD");
    const citas = await citasService.getCitasByMedico(id_medico, hoy);

    // console.log("citas del medico", citas);

    // 3. Preparar bloques disponibles por día
    const horariosDisponibles = [];
    let encontrados = 0; // Contador de horarios encontrados
    let diasRecorridos = 0; // Contador de días recorridos
    const maxDias = 30; // Máximo de días a recorrer para evitar bucles infinitos

    while (encontrados < limite && diasRecorridos < maxDias) {
      const fecha = dayjs(hoy).add(diasRecorridos, "day");
      const diaSemana = fecha.day();

      // Filtrar horarios del médico para el día de la semana actual
      const horariosDia = horarios.filter((h) => h.dia_semana === diaSemana);

      horariosDia.forEach((horario) => {
        // Dividir horario en bloques de la duración especificada
        const bloques = dividirEnBloques(horario.hora_inicio, horario.hora_fin, duracion);

        bloques.forEach((bloque) => {
          // Verificar si el bloque está ocupado por una cita
          // console.log(`Bloque ${bloque.inicio} - ${bloque.fin}`);
          const ocupado = citas.some((cita) => {
            let fechaCita = dayjs(cita.fecha);
            // console.log(`Cita: ${cita.hora_inicio} - ${cita.hora_fin}`);
            return (
              fechaCita.format("YYYY-MM-DD") === fecha.format("YYYY-MM-DD") &&
              ((bloque.inicio >= cita.hora_inicio && bloque.inicio < cita.hora_fin) || (bloque.fin > cita.hora_inicio && bloque.fin <= cita.hora_fin))
            );
          });
          if (!ocupado && encontrados < limite) {
            horariosDisponibles.push({
              fecha: fecha.format("YYYY-MM-DD"),
              inicio: bloque.inicio,
              fin: bloque.fin,
            });
            encontrados++;
          }
        });
      });

      diasRecorridos++; // Avanzar al siguiente día
    }

    res.status(200).json(horariosDisponibles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para dividir en bloques
const dividirEnBloques = (horaInicio, horaFin, duracion) => {
  const bloques = [];
  let inicio = dayjs().hour(horaInicio.split(":")[0]).minute(horaInicio.split(":")[1]).second(horaInicio.split(":")[2]);
  const fin = dayjs().hour(horaFin.split(":")[0]).minute(horaFin.split(":")[1]).second(horaInicio.split(":")[2]);

  while (inicio.isBefore(fin)) {
    const bloqueFin = inicio.add(duracion, "minute");
    if (bloqueFin.isAfter(fin)) break;

    bloques.push({ inicio: inicio.format("HH:mm:ss"), fin: bloqueFin.format("HH:mm:ss") });
    inicio = bloqueFin;
  }

  return bloques;
};

// Ejemplo de uso
// const bloques = dividirEnBloques("09:00:00", "12:00:00", 30);
// console.log("ejemplo", bloques);
