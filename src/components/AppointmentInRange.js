import { styleTimestamp } from "../utils/AppointmentTimestampStyler";
import AppointmentModal from "./AppointmentModal";
import ScanModal from "./ScanModal";

import { useState } from "react";

function AppointmentInRange( { 
    locationId, 
    nextAvailableInRange,
    fetchNextAvailableInRange,
    searchMode,
    appointmentList,
    startDate,
    endDate
} ) {

    const [showScanModal, setShowScanModal] = useState(false);

    if (locationId !== "default") {
        if (nextAvailableInRange !== undefined && nextAvailableInRange.length !== 0) {
            let appointmentInfo = styleTimestamp(nextAvailableInRange[0].startTimestamp);
            return (
                <div id="search-results-container" className="card-container">
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
                    <div id="search-results-container" className="card-container">
                        <p>There are no appointments available for the chosen dates at this time.</p>
                        <ScanModal 
                            showScanModal={showScanModal}
                            setShowScanModal={setShowScanModal}
                            locationId={locationId}
                            startDate={startDate}
                            endDate={endDate}
                            fetchNextAvailableInRange={fetchNextAvailableInRange}
                            appointmentList={appointmentList}
                        />
                    </div>
                );
            }
        };
    };
};

export default AppointmentInRange;