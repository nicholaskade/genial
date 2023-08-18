import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import failure from "../failed.mp3";
import success from "../success.mp3";
import useSound from "use-sound";

import { useEffect, useState, useRef } from "react";

function ScanModal({
    appointmentList,
    showScanModal, 
    setShowScanModal,
    startDate,
    endDate,
    locationId,
    fetchNextAvailableInRange
}) {

    const [scanMode, setScanMode] = useState(false);
    const [counter, setCounter] = useState(0);
    const [successState, setSuccessState] = useState(false);

    const [playFailure] = useSound(failure);
    const [playSuccess] = useSound(success);

    const scanModeRef = useRef(scanMode);
    scanModeRef.current = scanMode;

    useEffect(() => {
        if (counter === 60) {
            setScanMode(false);

        } else if (scanModeRef.current && appointmentList !== undefined) {
            console.log(appointmentList);
            playSuccess();
            setScanMode(false);
            setSuccessState(true);
            window.open("https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true", "_blank");
        } else if (scanModeRef.current && appointmentList === undefined) {
            console.log(appointmentList);
            playFailure();
            setTimeout(() => {
                if (scanModeRef.current) {
                    console.log("I have waited ten seconds.");
                    setCounter(counter + 1);
                }
            }, 10000);
        }
    }, [appointmentList, counter]);

    function hideScanModal() {
        setShowScanModal(false);
        setScanMode(false);
        setCounter(0);
    }

    function openScanModal() {
        setShowScanModal(true);
        setScanMode(true);
        fetchNextAvailableInRange(locationId, startDate, endDate);
        setCounter(1);
    }

    function handleRestart() {
        setScanMode(true);
        fetchNextAvailableInRange(locationId, startDate, endDate);
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
                    Searching for your appointment now!
                </Modal.Header>
                <Modal.Body>
                    <div id="scan-modal-body">
                        {
                            successState ?
                                <p>We have located an appointment for you!</p>
                                    :
                                counter > 1 ? 
                                    counter < 60 ?
                                        <>
                                            <p>We've scanned for your appointment {counter} times.</p>
                                            <Spinner animation="grow" variant="info"/>
                                        </> 
                                        :
                                        <>
                                            <p>You have exceeded the maximum number of scans for this search. Please try again.</p>
                                            <button className="search-button" onClick={() => handleRestart()}>Restart Scanner</button>
                                        </>
                                        : 
                                    <>
                                        <p>We've scanned for your appointment 1 time.</p> 
                                        <Spinner animation="grow" variant="info"/>
                                    </>
                        }
                    </div>
                </Modal.Body>
            
                <Modal.Footer>
                        <button onClick={() => hideScanModal()} className="search-button">Stop Scanning</button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ScanModal;