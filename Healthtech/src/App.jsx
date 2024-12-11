import { useState } from "react";
import CustomNavbar from "./components/Navbar/Navbar"
import HomeScreen from "./components/Home/HomeScreen"
import Footer from "./components/Footer/Footer"
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import AuthModal from "./components/AuthModal/AuthModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");

  const handleShowModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = (user, navigate) => {
    setIsLoggedIn(true);
    setUserInfo(user); 
    setShowModal(false);


    if (user.role === "doctor" || user.role === "admin") {
      navigate("/doctor-dashboard");
    } else if (user.role === "patient" || user.role === "moderator") {
      navigate("/dashboard");
    } else {
      console.error("Unexpected role:", user.role);
    }
  };

  const handleLogout = (navigate) => {
    setIsLoggedIn(false);
    setUserInfo(null); 
    navigate("/"); 
  };

  return (
    <Router>
      <div className="App">
        <CustomNavbar
          isLoggedIn={isLoggedIn}
          handleLogout={(navigate) => handleLogout(navigate)}
          onShowModal={handleShowModal}
        />

        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route
            path="/dashboard"
            element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
                <PatientDashboard userInfo={userInfo} />
            </ProtectedRoute>
            } 
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <DoctorDashboard userInfo={userInfo} />
            </ProtectedRoute>} 
          />
        </Routes>

        <Footer />

        <AuthModal
          show={showModal}
          handleClose={handleCloseModal}
          mode={modalMode}
          onLogin={(user, navigate) => handleLogin(user, navigate)} 
        />
      </div>
    </Router>
  );
}

export default App
