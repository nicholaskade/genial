import { styleTimestamp } from "./utils/AppointmentTimestampStyler";
import DateSelector from "./DateSelector";
import AppointmentModal from "./AppointmentModal";

function NextAvailable( { 
    nextAvailable, 
    locationId, 
    getCurrentDate, 
    startDateClicked, 
    endDateClicked, 
    endDateMin, 
    startDateMax,
    startDate,
    endDate,
    fetchNextAvailableInRange,
    nextAvailableInRange,
    searchMode,
    setSearchMode,
    appointmentList
 } ) {
    if (locationId !== "default") {
        if (nextAvailable.length !== 0) {
            let appointmentInfo = nextAvailable.map((appointment) => styleTimestamp(appointment.startTimestamp));
            return (
                <div>
                    <div id="next-available-container" className="card-container">
                        <p>Next Available Appointment:</p>
                        <p>
                            {appointmentInfo}
                        </p>
                    </div>
                    <div>
                        <DateSelector 
                            locationId={locationId} 
                            startDateClicked={startDateClicked} 
                            getCurrentDate={getCurrentDate} 
                            endDateClicked={endDateClicked} 
                            endDateMin={endDateMin} 
                            startDateMax={startDateMax}
                            startDate={startDate}
                            endDate={endDate}
                            fetchNextAvailableInRange={fetchNextAvailableInRange}
                            nextAvailableInRange={nextAvailableInRange}
                            nextAvailable={nextAvailable}
                            searchMode={searchMode}
                            setSearchMode={setSearchMode}
                            appointmentList={appointmentList}
                        />
                    </div>
                </div>
                );
        } else {
            return (
                <div id="next-available-container" className="card-container">
                    <p>There are no appointment timeslots available at this time.</p>
                </div>
                );
        }
    };
};

export default NextAvailable;