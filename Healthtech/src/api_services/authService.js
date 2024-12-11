import axios from "axios";

const API_BASE_URL = "https://dummyjson.com/auth/login";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(API_BASE_URL, {
      username,
      password,
    });


    const { role, firstName, lastName, token } = response.data;


    return { role, firstName, lastName, token };
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials. Please try again.");
  }
};
