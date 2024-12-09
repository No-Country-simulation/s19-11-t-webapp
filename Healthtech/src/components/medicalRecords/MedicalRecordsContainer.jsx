import { useState, useEffect } from "react";
import axios from "axios";
import ConsultationDropdown from "./ConsultationDropdown";
import GeneralMedicalHistory from "./GeneralMedicalHistory";
import ConsultationDetails from "./ConsultationDetails";
import ClinicalEvents from "./ClinicalEvents";
import NewConsultationForm from "./NewConsultationForm";
import { Container, Card } from "react-bootstrap";

// Hardcoded values for testing
const HARDCODED_PATIENT_ID = "paciente_001";
const HARDCODED_DOCTOR_ID = "medico_001";

const MedicalRecordsContainer = () => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3005/medical-history/${HARDCODED_PATIENT_ID}`
        );
        setMedicalHistory(response.data);

        // Set the most recent consultation as selected by default
        if (response.data?.consultas?.length > 0) {
          setSelectedConsulta(
            response.data.consultas[response.data.consultas.length - 1]
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching medical history:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, []);

  const handleAddNewConsultation = async (newConsulta, newEventoClinico) => {
    try {
      const updatedData = {
        pacienteId: HARDCODED_PATIENT_ID,
        consultas: [
          ...(medicalHistory?.consultas || []),
          {
            ...newConsulta,
            medicoId: HARDCODED_DOCTOR_ID,
            idConsulta: `consulta-${Date.now()}`,
          },
        ],
        eventosClinicos: [
          ...(medicalHistory?.eventosClinicos || []),
          newEventoClinico,
        ],
      };

      const response = await axios.post(
        "http://localhost:3005/medical-history",
        updatedData
      );
      setMedicalHistory(response.data);

      // Update selected consultation to the newly added one
      if (response.data.consultas.length > 0) {
        setSelectedConsulta(
          response.data.consultas[response.data.consultas.length - 1]
        );
      }
    } catch (error) {
      console.error("Error adding consultation:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading medical history</div>;

  return (
    <Container>
      <Card>
        <Card.Header>Medical Records</Card.Header>
        <Card.Body>
          {/* Consultation Dropdown */}
          <ConsultationDropdown
            consultas={medicalHistory?.consultas || []}
            selectedConsulta={selectedConsulta}
            onSelectConsulta={setSelectedConsulta}
          />

          {/* Selected Consultation Details */}
          {selectedConsulta && (
            <ConsultationDetails consulta={selectedConsulta} />
          )}

          {/* General Medical History */}
          {medicalHistory?.historiaGeneral && (
            <GeneralMedicalHistory
              historiaGeneral={medicalHistory.historiaGeneral}
            />
          )}

          {/* Clinical Events */}
          {medicalHistory?.eventosClinicos &&
            medicalHistory.eventosClinicos.length > 0 && (
              <ClinicalEvents eventos={medicalHistory.eventosClinicos} />
            )}

          {/* New Consultation Form */}
          <NewConsultationForm onAddConsultation={handleAddNewConsultation} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MedicalRecordsContainer;
