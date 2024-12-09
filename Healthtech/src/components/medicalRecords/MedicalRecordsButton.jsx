import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import MedicalRecordsContainer from "./MedicalRecordsContainer";

const MedicalRecordsButton = () => {
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);

  const handleOpenMedicalRecords = () => {
    setShowMedicalRecords(true);
  };

  const handleCloseMedicalRecords = () => {
    setShowMedicalRecords(false);
  };

  return (
    <>
      <Button variant="primary" onClick={handleOpenMedicalRecords}>
        Medical Records
      </Button>

      <Modal
        show={showMedicalRecords}
        onHide={handleCloseMedicalRecords}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Medical Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MedicalRecordsContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMedicalRecords}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MedicalRecordsButton;
