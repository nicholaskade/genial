import Modal from "react-bootstrap/Modal";
import failure from "./failed.mp3";
import success from "./success.mp3";
import useSound from "use-sound";
import { useEffect } from "react";

function ScanModal() {

    const [showScanModal, setShowScanModal] = useState(false);
    const [playFailure] = useSound(failure);
    const [playSuccess] = useSound(success);

    const [test, setTest] = useState([]);
    
    const dummy = {
        startTimestamp: new Date("2023-10-10T09:15")
    };

    function hideScanModal() {
        setShowScanModal(false);
    };

    function beginScanning() {
        let counter = 0;

        // await fetchNextAvailableInRange(locationId, startDate, endDate);

        setTest([dummy]);

        // if (appointmentList.length > 0) {
        if (test.length > 0) {
            console.log(appointmentList);
            playSuccess();
            return;
        } else {
            console.log(appointmentList);
            counter++;
            playFailure();
        };

        if (counter <= 60) {
            setTimeout(beginScanning, 10000);
        };

        assessResults();
    };

    return (
        <>
            <button className="search-button" onClick={() => beginScanning()}>Scan for Appointments</button>

            <Modal
                show={showScanModal}
                onHide={hideScanModal}
            >
                <Modal.Header closeButton>

                </Modal.Header>
            </Modal>
        </>
    );
};

export default ScanModal;