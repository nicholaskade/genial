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
    const ttpURL = "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true";

    function handleBook() {
        window.open(ttpURL, "_blank");
    }
    
    if (locationId !== "default") {
        if (nextAvailableInRange !== undefined && nextAvailableInRange.length !== 0 && searchMode) {
            let appointmentInfo = styleTimestamp(nextAvailableInRange[0].startTimestamp);
            return (
                <div id="search-results-container" className="card-container">
                    <p>Next Available Appointment in Range:</p>
                    <p>{appointmentInfo}</p>
                    <div id="next-available-buttons-container">
                        <AppointmentModal 
                            appointmentList={appointmentList}
                            ttpURL={ttpURL}
                        />
                        <button onClick={() => handleBook()} className="search-button" id="book-button">Book Now</button>
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