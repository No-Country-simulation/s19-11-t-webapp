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
      motive: getRandomMotive()
      
    }));
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};
