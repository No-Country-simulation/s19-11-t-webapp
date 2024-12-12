import { useState } from "react";
import CustomNavbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/Home/HomeScreen";
import Footer from "./components/Footer/Footer";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import AuthModal from "./components/AuthModal/AuthModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import MedicalRecordsPage from "./components/medicalRecords/MedicalRecordPage";
import useStore from "./useStore";  // Importa la tienda Zustand

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const user = useStore((state) => state.user);  // Obtén el usuario de la tienda Zustand
  const clearUser = useStore((state) => state.clearUser);  // Obtén la función clearUser de la tienda Zustand

  const handleShowModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = (user, navigate) => {
    setShowModal(false);

    if (user.user_type === "Medico" || user.user_type === "admin") {
      navigate("/doctor-dashboard");
    } else if (user.user_type === "Paciente" || user.user_type === "moderator") {
      navigate("/dashboard");
    } else {
      console.error("Unexpected user_type:", user.user_type);
    }
  };

  const handleLogout = (navigate) => {
    clearUser();
    navigate("/");
  };

  return (
    <Router>
      <CustomNavbar onShowModal={handleShowModal} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute user={user}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/medical-records" element={<ProtectedRoute user={user}><MedicalRecordsPage /></ProtectedRoute>} />
      </Routes>
      <Footer />
      <AuthModal show={showModal} handleClose={handleCloseModal} mode={modalMode} onLogin={handleLogin} />
    </Router>
  );
}

export default App;
