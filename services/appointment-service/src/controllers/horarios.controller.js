import dayjs from "dayjs";
import { horariosService } from "../services/horarios.service.js";
import { citasService } from "../services/citas.service.js";

export const getHorarios = async (req, res) => {
  try {
    const horarios = await horariosService.getAllHorarios();
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHorarioByMedicoId = async (req, res) => {
  const { id } = req.params;
  const { dia } = req.query;

  try {
    const horario = await horariosService.getHorarioByMedicoId(id, dia);
    if (!horario) {
      return res.status(404).json({ message: "No se encontraron horarios" });
    }
    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addHorario = async (req, res) => {
  const { id_medico, dia_semana, hora_inicio, hora_fin } = req.body;

  try {
    if (hora_inicio >= hora_fin) {
      return res.status(400).json({ message: "La hora de inicio debe ser menor que la hora de fin" });
    }
    // Verificar si se superpone con otro horario
    const horarios = await horariosService.getAllHorarios();

    // Verificar si se superpone con otro horario del mismo día
    const superposicion = horarios.some((item) => {
      if (item.activo && item.id_medico === id_medico && item.dia_semana === dia_semana) {
        return (
          (hora_inicio >= item.hora_inicio && hora_inicio < item.hora_fin) || // Inicio dentro de otro rango
          (hora_fin > item.hora_inicio && hora_fin <= item.hora_fin) || // Fin dentro de otro rango
          (hora_inicio <= item.hora_inicio && hora_fin >= item.hora_fin) // El bloque actual engloba a otro rango
        );
      }
      return false;
    });

    if (superposicion) {
      return res.status(400).json({
        message: "Existe otro bloque horario que se superpone con las horas proporcionadas",
      });
    }

    const newHorario = await horariosService.addHorario({ id_medico, dia_semana, hora_inicio, hora_fin });
    res.status(201).json(newHorario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHorario = async (req, res) => {
  const { id } = req.params;
  const { dia_semana, hora_inicio, hora_fin, activo } = req.body;

  try {
    if (!dia_semana && !hora_inicio && !hora_fin && activo === undefined) {
      return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
    }

    const result = await horariosService.updateHorario(id, { dia_semana, hora_inicio, hora_fin, activo });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.json({ message: "Horario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHorario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await horariosService.deleteHorario(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.json({ message: "Horario desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

        // console.log("bloques", bloques);

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
