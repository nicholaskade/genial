import { styleTimestamp } from "../utils/AppointmentTimestampStyler";
import Spinner from "react-bootstrap/Spinner";
import DateSelector from "./DateSelector";
import { useState } from "react";

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
    fetchNextAvailable,
    fetchNextAvailableInRange,
    nextAvailableInRange,
    searchMode,
    setSearchMode,
    appointmentList
 } ) {

    const [refreshState, setRefreshState] = useState(false);

    function handleRefresh() {
        setRefreshState(true);
        setSearchMode(false);
        fetchNextAvailable(locationId);    
        setTimeout(() => {
            setRefreshState(false);
        }, 1000)
    }

    if (locationId !== "default") {
        if (nextAvailable.length !== 0) {
            let appointmentInfo = nextAvailable.map((appointment) => styleTimestamp(appointment.startTimestamp));
            return (
                <div>
                    <div id="next-available-container" className="card-container">
                        {
                            refreshState ?
                                <Spinner variant="border" role="info"/>
                                    :
                                <>
                                    <p>Next Available Appointment:</p>
                                    <p>{ appointmentInfo }</p>
                                    <button id="refresh-button" className="search-button" onClick={() => handleRefresh()}>Refresh</button>
                                </>
                        }
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