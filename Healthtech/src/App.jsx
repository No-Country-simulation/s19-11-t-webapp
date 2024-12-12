import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/Home/HomeScreen";
import Footer from "./components/Footer/Footer";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import AuthModal from "./components/AuthModal/AuthModal";



function App() {
  const { isLoggedIn, user, restoreSession, logout } = useAuthStore();

  const [showModal, setShowModal] = useState(false); 
  const [modalMode, setModalMode] = useState("login"); 

  // Restore session on app load
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Show the modal and set the mode
  const handleShowModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle user login
  const handleLogin = (user, navigate) => {
    console.log("User received in App.jsx handleLogin:", user); // Log user data
    useAuthStore.getState().login(user); // Call Zustand's login function
    console.log("After Zustand login, navigating to:", user.user_type === "Paciente" ? "/dashboard" : "/doctor-dashboard");
  
    if (user.user_type === "Doctor") {
      navigate("/doctor-dashboard");
    } else if (user.user_type === "Paciente") {
      navigate("/dashboard");
      console.log("Navigated to /dashboard");
    } else {
      console.error("Unexpected user type:", user.user_type);
    }
  };
  

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <CustomNavbar
          isLoggedIn={isLoggedIn}
          handleLogout={logout}
          onShowModal={handleShowModal} 
        />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <PatientDashboard userInfo={user} /> : <HomeScreen />}
          />
          <Route
            path="/doctor-dashboard"
            element={isLoggedIn ? <DoctorDashboard userInfo={user} /> : <HomeScreen />}
          />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* Authentication Modal */}
        <AuthModal
          show={showModal}
          handleClose={handleCloseModal}
          mode={modalMode}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;
