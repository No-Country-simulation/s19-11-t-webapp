import { create } from 'zustand';

// Zustand store for authentication
const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,

  // Login action
  login: (user) => {
    console.log("Updating Zustand with user:", user);
    set({ isLoggedIn: true, user });
  
    // Persist user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
  },

  // Logout action
  logout: () => {
    set({ isLoggedIn: false, user: null });
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  },

  // Restore session on app load
  restoreSession: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ isLoggedIn: true, user: JSON.parse(storedUser) });
    }
  },
}));

export default useAuthStore;
