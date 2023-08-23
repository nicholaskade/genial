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
    const ttpURL = "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true";

    function handleRefresh() {
        setRefreshState(true);
        setSearchMode(false);
        fetchNextAvailable(locationId);    
        setTimeout(() => {
            setRefreshState(false);
        }, 1000);
    }

    function handleBook() {
        window.open(ttpURL, "_blank");
    }

    if (locationId !== "default") {
        if (nextAvailable.length !== 0) {
            let appointmentInfo = nextAvailable.map((appointment) => styleTimestamp(appointment.startTimestamp));
            return (
                    <>
                        <div id="next-available-container" className="card-container">
                            {
                                refreshState ?
                                    <Spinner variant="border" role="info"/>
                                        :
                                    <>
                                        <p>Next Available Appointment:</p>
                                        <p>{ appointmentInfo }</p>
                                        <div id="next-available-button-container">
                                            <button id="refresh-button" className="search-button" onClick={() => handleRefresh()}>Refresh</button>
                                            <button className="search-button" id="book-button" onClick={() => handleBook()}>Book Now</button>
                                        </div>
                                        <div id="scan-message-container">
                                            <p>Need an appointment sooner? Select your dates and use our scan feature below.</p>
                                        </div>  
                                    </>
                            }
                        </div>

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
                    </>
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