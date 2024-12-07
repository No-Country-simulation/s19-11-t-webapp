import { useState } from "react";
import CustomNavbar from "./components/Navbar/Navbar"
import HomeScreen from "./components/Home/HomeScreen"
import Footer from "./components/Footer/Footer"
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import AuthModal from "./components/AuthModal/AuthModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");

  const handleShowModal = (mode) => {
    setModalMode(mode); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); 
    handleCloseModal(); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    
  };


  return (
    <Router>
    <div className="App">
    <CustomNavbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          onShowModal={handleShowModal}
        />

      <Routes>
          <Route path="/" element={<HomeScreen />} />
           <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      <Footer/>
      {/* Auth Modal */}
      <AuthModal
          show={showModal}
          handleClose={handleCloseModal}
          mode={modalMode}
          onLogin={handleLogin}
        />

    </div>
    </Router>
  )
}

export default App
