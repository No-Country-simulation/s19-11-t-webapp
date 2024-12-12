import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/Home/HomeScreen";
import Footer from "./components/Footer/Footer";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import AuthModal from "./components/AuthModal/AuthModal";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";

function App() {
  const { isLoggedIn, user, restoreSession, login, logout } = useAuthStore();

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
    console.log("User received in App.jsx handleLogin:", user);
    login(user); // Call Zustand's login function

    if (user.user_type === "Medico" || user.user_type === "admin") {
      console.log("Navigating to /doctor-dashboard");
      navigate("/doctor-dashboard");
    } else if (user.user_type === "Paciente" || user.user_type === "moderator") {
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    } else {
      console.error("Unexpected user type:", user.user_type);
    }
  };

  // Handle user logout
  const handleLogout = (navigate) => {
    console.log("Logging out...");
    logout();
    navigate("/");
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <CustomNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} onShowModal={handleShowModal} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute user={user}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* Authentication Modal */}
        <AuthModal show={showModal} handleClose={handleCloseModal} mode={modalMode} onLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
