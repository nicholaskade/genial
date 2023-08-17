import { styleTimestamp } from "../utils/AppointmentTimestampStyler";
import AppointmentModal from "./AppointmentModal";
import ScanModal from "./ScanModal";

import useState from "react";

function AppointmentInRange( { 
    locationId, 
    nextAvailableInRange,
    searchMode,
    appointmentList
} ) {

    const [showScanModal, setShowScanModal] = useState(false);

    if (locationId !== "default") {
        if (nextAvailableInRange !== undefined && nextAvailableInRange.length !== 0) {
            let appointmentInfo = styleTimestamp(nextAvailableInRange[0].startTimestamp);
            return (
                <div id="next-available-container" className="card-container">
                    <p>Next Available Appointment in Range:</p>
                    <p>{appointmentInfo}</p>
                    <div>
                        <AppointmentModal 
                            appointmentList={appointmentList}
                        />
                    </div>
                </div>
            )
        } else {
            if (searchMode) {
                return (
                    <div id="next-available-container" className="card-container">
                        <p>There are no appointments available for the chosen dates at this time.</p>
                        <button>Scan for Appointments</button>
                        <ScanModal 
                            showScanModal={showScanModal}
                            setShowScanModal={setShowScanModal}
                        />
                    </div>
                );
            }
        };
    };
};

export default AppointmentInRange;