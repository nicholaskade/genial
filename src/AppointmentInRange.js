import { styleTimestamp } from "./utils/AppointmentTimestampStyler";
import AppointmentModal from "./AppointmentModal";
import { useState } from "react";

function AppointmentInRange( { 
    locationId, 
    fetchNextAvailableInRange,
    startDate,
    endDate,
    nextAvailableInRange,
    searchMode,
    appointmentList
} ) {

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
                    </div>
                );
            }
        };
    };
};

export default AppointmentInRange;