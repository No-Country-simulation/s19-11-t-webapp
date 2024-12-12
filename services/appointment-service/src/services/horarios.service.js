import { pool } from "../config/db.js";

export const horariosService = {
  getAllHorarios: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM horario_medico WHERE activo = 1");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los horarios: " + error.message);
    }
  },

  getHorarioByMedicoId: async (id, dia) => {
    let rows = [];
    try {
      if (dia) [rows] = await pool.query("SELECT * FROM horario_medico WHERE id_medico = ? and dia_semana = ? and activo = 1", [id, dia]);
      else [rows] = await pool.query("SELECT * FROM horario_medico WHERE id_medico = ? and activo = 1", [id]);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener el horario: " + error.message);
    }
  },

  addHorario: async (horario) => {
    const { id_medico, dia_semana, hora_inicio, hora_fin } = horario;

    try {
      const [result] = await pool.query("INSERT INTO horario_medico (id_medico, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)", [
        id_medico,
        dia_semana,
        hora_inicio,
        hora_fin,
      ]);

      return { id_horario_medico: result.insertId, ...horario };
    } catch (error) {
      throw new Error("Error al agregar el horario: " + error.message);
    }
  },

  updateHorario: async (id, fields) => {
    const updates = [];
    const values = [];

    if (fields.dia_semana) {
      updates.push("dia_semana = ?");
      values.push(fields.dia_semana);
    }
    if (fields.hora_inicio) {
      updates.push("hora_inicio = ?");
      values.push(fields.hora_inicio);
    }
    if (fields.hora_fin) {
      updates.push("hora_fin = ?");
      values.push(fields.hora_fin);
    }
    if (fields.activo !== undefined) {
      updates.push("activo = ?");
      values.push(fields.activo);
    }
    values.push(id);

    const query = `UPDATE horario_medico SET ${updates.join(", ")} WHERE id_horario_medico = ?`;

    try {
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw new Error("Error al actualizar el horario: " + error.message);
    }
  },

  deleteHorario: async (id) => {
    try {
      const [result] = await pool.query("UPDATE horario_medico SET activo = 0 WHERE id_horario_medico = ?", [id]);
      return result;
    } catch (error) {
      throw new Error("Error al desactivar el horario: " + error.message);
    }
  },
};
