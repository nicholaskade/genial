import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import success from "../success.mp3";
import useSound from "use-sound";
import genialIcon from "../assets/genial-icon.png";

import { useEffect, useState, useRef } from "react";

function ScanModal({
    appointmentList,
    showScanModal, 
    setShowScanModal,
    startDate,
    endDate,
    locationId
}) {

    const [scanMode, setScanMode] = useState(false);
    const [counter, setCounter] = useState(0);
    const [successState, setSuccessState] = useState(false);
    const [validAppointments, setValidAppointments] = useState(undefined);

    const ttpURL = "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true";

    const [playSuccess] = useSound(success);

    const scanModeRef = useRef(scanMode);
    scanModeRef.current = scanMode;

    useEffect(() => {
        if (counter === 600) {
            const options = { 
                body: "We were unable to locate an appointment for you. Please try again.",
                icon: genialIcon
            };
            const notification = new Notification("Genial", options);
            setScanMode(false);
        } else if (scanModeRef.current && validAppointments !== undefined) {
            console.log(appointmentList);
            playSuccess();
            setScanMode(false);
            setSuccessState(true);
            const options = { 
                body: "We have located an appointment for you!",
                icon: genialIcon
            };
            const notification = new Notification("Genial", options);
            window.open(ttpURL, "_blank");
        } else if (scanModeRef.current && validAppointments === undefined) {
            setTimeout(() => {
                if (scanModeRef.current) {
                    console.log("I have waited ten seconds.");
                    scanForAppointments(locationId, startDate, endDate);
                    setCounter(counter + 1);
                }
            }, 10000);
        }
    }, [counter]);

    function scanForAppointments(locationId, startDate, endDate) {
        let start = new Date(`${startDate}T00:00:01`);
        let end = new Date(`${endDate}T23:59:59`);

        function populateAppointments(appointmentArray) {
            const filteredAppointments =  appointmentArray.filter(appointment => new Date(appointment.startTimestamp) >= start && new Date(appointment.endTimestamp) <= end);
            filteredAppointments.length > 0 ? setValidAppointments(filteredAppointments) : setValidAppointments(undefined);
        }
        
        fetch(`https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&locationId=${locationId}&limit=1000`)
            .then(response => response.json())
            .then(response => {
                populateAppointments(response);
        });
    }

    function hideScanModal() {
        setShowScanModal(false);
        setSuccessState(false);
        setScanMode(false);
        setCounter(0);
        setValidAppointments(undefined);
    }

    function openScanModal() {
        setShowScanModal(true);
        setScanMode(true);
        scanForAppointments(locationId, startDate, endDate);
        setCounter(1);
    }

    function handleRestart() {
        setScanMode(true);
        scanForAppointments(locationId, startDate, endDate);
        setCounter(1);
    }

    return (
        <>
            <button className="search-button" onClick={() => openScanModal()}>Scan for Appointments</button>

            <Modal
                show={showScanModal}
                onHide={hideScanModal}
            >
                <Modal.Header>
                    <p className="modal-text">Searching for your appointment now!</p>
                </Modal.Header>
                <Modal.Body>
                    <div id="scan-modal-body">
                        {
                            successState ?
                                <p className="modal-text">We have located an appointment for you!</p>
                                    :
                                counter > 1 ? 
                                    counter < 600 ?
                                        <>
                                            <p className="modal-text">We've scanned for your appointment {counter} times.</p>
                                            <Spinner animation="grow" variant="info"/>
                                        </> 
                                        :
                                                <p className="modal-text">You have exceeded the maximum number of scans for this search. Please try again.</p>
                                        : 
                                        <>
                                            <p className="modal-text">We've scanned for your appointment 1 time.</p> 
                                            <Spinner animation="grow" variant="info"/>
                                        </>
                        }
                    </div>
                </Modal.Body>
            
                <Modal.Footer>
                        <button onClick={() => hideScanModal()} className="search-button">Stop Scanning</button>
                        { counter < 600 ? 
                            <></>
                            :
                            <button className="search-button" onClick={() => handleRestart()}>Restart Scanner</button>
                        }
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ScanModal;