import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);

    return response.data.users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      age: user.age,
      email: user.email,
      phone: user.phone,
      image: user.image,
      specialty: "General Medicine", // Mock specialty
      visitsToday: Math.floor(Math.random() * 10 + 1), // Random visits
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

const getRandomClass = () => {
  const classes = ["danger", "primary", "info", "success"];
  return classes[Math.floor(Math.random() * classes.length)];
};

const getRandomMotive = () => {
  const classes = ["Weekly Visit", "Routine Checkup", "Report"];
  return classes[Math.floor(Math.random() * classes.length)];
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 8) + 8;
  const minutes = Math.random() < 0.5 ? "00" : "30";
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours > 12 ? hours - 12 : hours;
  return `${formattedHour}:${minutes} ${period}`;
};

export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      age: user.age,
      gender: user.gender,
      symptoms: ["Fever", "Cough"],
      schedule: getRandomTime(),
      bgColorClass: getRandomClass(),
      motive: getRandomMotive(),
    }));
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

export const getEspecialidades = async () => {
  try {
    const url = `http://localhost:8000/api/especialidades`;
    const response = await axios.get(url);
    const especialidades = response.data;
    return especialidades;
  } catch (error) {
    console.error("Error fetching especialidades:", error);
    throw error;
  }
};

export const getMedicosByEspecialidad = async (especialidad) => {
  try {
    const url = `http://localhost:8000/api/medicos/${especialidad}`;
    const response = await axios.get(url);
    const medicos = response.data;
    return medicos;
  } catch (error) {
    console.error("Error fetching medicos:", error);
    throw error;
  }
};

export const getHorariosDisponibles = async (id_medico, dia) => {
  try {
    let url = "";
    if (dia > 0) url = `http://localhost:3000/api/horarios/disponibles?id_medico=${id_medico}&${dia}`;
    else url = `http://localhost:3000/api/horarios/disponibles?id_medico=${id_medico}`;

    const response = await axios.get(url);
    const horarios = response.data;
    return horarios;
  } catch (error) {
    console.error("Error fetching horarios:", error);
    throw error;
  }
};
