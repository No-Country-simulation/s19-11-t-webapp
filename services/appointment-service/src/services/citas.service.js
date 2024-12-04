import { pool } from "../config/db.js";
import axios from 'axios';

export const citasService = {
  // Obtener todas las citas con filtros opcionales
  getAllCitas: async ({ fecha, estado, pacienteId, medicoId }) => {
    try {
      let query = `SELECT * FROM cita WHERE 1=1`;
      const values = [];

      if (fecha) {
        query += ` AND fecha = ?`;
        values.push(fecha);
      }
      if (estado) {
        query += ` AND estado = ?`;
        values.push(estado);
      }
      if (pacienteId) {
        query += ` AND id_paciente = ?`;
        values.push(pacienteId);
      }
      if (medicoId) {
        query += ` AND id_medico = ?`;
        values.push(medicoId);
      }

      const [rows] = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener las citas: " + error.message);
    }
  },

  // Crear una nueva cita
  addCita: async (cita) => {
    const { id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo } = cita;
    try {
      const [result] = await pool.query(
        `INSERT INTO cita (id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo]
      );
      return { id: result.insertId, ...cita };
    } catch (error) {
      throw new Error("Error al agregar la cita: " + error.message);
    }
  },

  // Actualizar una cita existente
  updateCita: async (id, fields) => {
    try {
      const updates = [];
      const values = [];

      if (fields.fecha) {
        updates.push("fecha = ?");
        values.push(fields.fecha);
      }
      if (fields.hora_inicio) {
        updates.push("hora_inicio = ?");
        values.push(fields.hora_inicio);
      }
      if (fields.hora_fin) {
        updates.push("hora_fin = ?");
        values.push(fields.hora_fin);
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
    } catch (error) {
      throw new Error("Error al actualizar la cita: " + error.message);
    }
  },

  // Cancelar una cita
  deleteCita: async (id) => {
    try {
      const [result] = await pool.query("UPDATE cita SET estado = 'cancelada' WHERE id_cita = ?", [id]);
      return result;
    } catch (error) {
      throw new Error("Error al cancelar la cita: " + error.message);
    }
  },

  // Obtener citas por rango de fechas
  getCitasByFecha: async (inicio, fin) => {
    try {
      const query = `SELECT * FROM cita WHERE fecha BETWEEN ? AND ?`;
      const [rows] = await pool.query(query, [inicio, fin]);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por rango de fechas: " + error.message);
    }
  },

  // Obtener citas de un paciente
  getCitasByPaciente: async (pacienteId) => {
    try {
      const query = `SELECT * FROM cita WHERE id_paciente = ?`;
      const [rows] = await pool.query(query, [pacienteId]);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por paciente: " + error.message);
    }
  },

  // Obtener citas de un médico
  getCitasByMedico: async (medicoId) => {
    try {
      const query = `SELECT * FROM cita WHERE id_medico = ? and estado='agendada'`;
      const [rows] = await pool.query(query, [medicoId]);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por médico: " + error.message);
    }
  },

  // Obtener citas de un médico y fecha
  getCitasByMedicoAndDate: async (medicoId, fecha) => {
    try {
      const query = `SELECT * FROM cita WHERE id_medico = ? and fecha = ? and estado <> 'cancelada'`;
      const [rows] = await pool.query(query, [medicoId, fecha]);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener citas por médico: " + error.message);
    }
  },
};

// ----------- Conexión con Microservicios HC y Mails ------------ //

export const getPaciente = async (pacienteId) => {
  try {
    const response = await axios.get(`http://medicalhistoryservice:3001/pacientes/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener paciente", error);
    return null; // En caso de error, devolvemos null para que se pueda manejar el fallo
  }
};

export const getMedico = async (medicoId) => {
  try {
    const response = await axios.get(`http://medicalhistoryservice:3001/medicos/${medicoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener médico", error);
    return null; // En caso de error, devolvemos null
  }
};

//const sendCitaConfirmation = async (email, pacienteNombre, medicoNombre, fechaCita) => {
  export const sendCitaConfirmation = async (id_medico, id_paciente, fecha, hora_inicio, hora_fin, tipo) => {
    const data = {
      id_medico: id_medico,
      id_paciente: id_paciente,
      fecha: fecha,
      hora_inicio: hora_inicio,
      hora_fin: hora_fin,
      tipo: tipo
    };
  
    try {
      const response = await axios.post('http://email-service:3002/sendConfirmation', data);
  
      // Verificar que el correo se haya enviado correctamente
      if (response.status === 200) {
        console.log("Correo de confirmación enviado");
        return { success: true, message: "Correo de confirmación enviado exitosamente" };
      } else {
        console.log("Error al enviar correo de confirmación:", response.data);
        return { success: false, message: "Error al enviar correo de confirmación" };
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      return { success: false, message: "Error al hacer la solicitud al servicio de correo" };
    }
  };
  
