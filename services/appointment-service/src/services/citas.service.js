import { pool } from "../config/db.js";

export const citasService = {
  getAllCitas: async ({ fecha, estado, pacienteId, medicoId }) => {
    try {
      let query = `SELECT * FROM cita WHERE 1=1`;
      if (fecha) query += ` AND fecha = '${fecha}'`;
      if (estado) query += ` AND estado = '${estado}'`;
      if (pacienteId) query += ` AND pacienteId = '${pacienteId}'`;
      if (medicoId) query += ` AND medicoId = '${medicoId}'`;

      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener las citas: " + error.message);
    }
  },

  addCita: async (cita) => {
    console.log("recibo", cita);
    const { id_medico, id_paciente, fecha, tipo } = cita;
    const [result] = await pool.query("INSERT INTO cita (id_medico, id_paciente, fecha, tipo) VALUES (?, ?, ?, ?)", [
      id_medico,
      id_paciente,
      fecha,
      tipo,
    ]);
    return { id: result.insertId, ...cita };
  },

  updateCita: async (id, fields) => {
    const updates = [];
    const values = [];

    if (fields.fecha) {
      updates.push("fecha = ?");
      values.push(fields.fecha);
    }
    if (fields.estado) {
      updates.push("estado = ?");
      values.push(fields.estado);
    }
    if (fields.tipo) {
      updates.push("tipo = ?");
      values.push(fields.tipo);
    }
    if (fields.id_medico) {
      updates.push("id_medico = ?");
      values.push(fields.id_medico);
    }
    if (fields.detalle) {
      updates.push("detalle = ?");
      values.push(fields.detalle);
    }
    values.push(id);

    const query = `UPDATE cita SET ${updates.join(", ")} WHERE id_cita = ?`;

    const [result] = await pool.query(query, values);
    return result;
  },

  deleteCita: async (id) => {
    const [result] = await pool.query("UPDATE cita SET estado = 'cancelada' WHERE id_cita = ?", [id]);
    return result;
  },
  getCitasByFecha: async (inicio, fin) => {
    try {
      const query = `SELECT * FROM cita WHERE fecha BETWEEN ? AND ?`;
      const [rows] = await pool.query(query, [inicio, fin]);

      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por rango de fechas: " + error.message);
    }
  },

  getCitasByPaciente: async (pacienteId) => {
    try {
      const query = `
      SELECT * FROM cita
      WHERE pacienteId = '${pacienteId}'
    `;

      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por paciente: " + error.message);
    }
  },

  getCitasByMedico: async (medicoId) => {
    try {
      const query = `
      SELECT * FROM cita
      WHERE medicoId = '${medicoId}'
    `;

      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por médico: " + error.message);
    }
  },
};
