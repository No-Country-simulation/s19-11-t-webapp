import { horariosService } from "../services/horarios.service.js";

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

/*
export const getHorariosLibresByMedicoId = async (req, res) => {
  const { id } = req.params;

  try {
    const horario = await horariosService.getHorariosLibresByMedicoId(id); // TODO

    if (!horario) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHorariosLibresByEspecialidad = async (req, res) => {
  const { id } = req.params;

  try {
    const horario = await horariosService.getHorarioByMedicoId(id); // TODO

    if (!horario) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
