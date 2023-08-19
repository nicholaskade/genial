import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { styleTimestamp } from "../utils/AppointmentTimestampStyler";

function AppointmentModal({
    appointmentList
}) {

    const ttpURL = "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true";

    function handleBook() {
        window.open(ttpURL, "_blank");
    }

    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [pageIndices, setPageIndices] = useState([0, 9]);
    const [pageNumber, setPageNumber] = useState(1);

    const pageCount = Math.ceil(appointmentList.length / 10);

    const listAppointments = 
        appointmentList.length > 0 ?
            appointmentList.slice(pageIndices[0], pageIndices[1]).map((appointment, i) => {
                return (
                    <>
                        <div className="appointment-list-item" key={i}>
                            <p>{styleTimestamp(appointment.startTimestamp)}</p>
                        </div>
                    </>
                )
            }) : <></>
    
    function goBack() {
        if (pageIndices[0] <= 0) {
            setPageIndices([0, 9]);
            return;
        } else {
            setPageNumber(pageNumber - 1);
            setPageIndices([pageIndices[0] - 10, pageIndices[1] - 10]);
        };
    };

    function nextPage() {
        if (pageIndices[1] >= appointmentList.length - 1) {
            return;
        } else {
            setPageNumber(pageNumber + 1);
            setPageIndices([pageIndices[1] + 1, pageIndices[1] + 10]);
        };
    };

    function closeModal() {
        setPageNumber(1);
        setShowAppointmentModal(false);
        setPageIndices([0, 9]);
    };
    
    return (
        <>
            <button id="view-all-button" className="search-button" onClick={() => setShowAppointmentModal(!showAppointmentModal)}>View All in Range</button>

            <Modal
                show={showAppointmentModal}
                onHide={closeModal}
            >
                <Modal.Header closeButton>
                    <p className="modal-text">Available Appointments</p>
                </Modal.Header>

                <Modal.Body>
                    
                    { listAppointments }

                    {
                        appointmentList.length > 10 ? 
                            <div id="page-number-holder">
                                {
                                    pageNumber === 1 ?
                                        <button className="greyed-out-button" disabled>Back</button>
                                            :
                                        <button className="search-button" onClick={() => goBack()}>Back</button>
                                }
                                <p>{pageNumber} / {pageCount}</p>
                                { 
                                    pageNumber === pageCount ? 
                                        <button className="greyed-out-button" disabled>Next</button>
                                            :
                                        <button className="search-button" onClick={() => nextPage()}>Next</button>
                                }
                            </div> : <></>
                    }

                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => handleBook()} className="search-button" id="book-button">Book Now</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AppointmentModal;