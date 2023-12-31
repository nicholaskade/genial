import AppointmentInRange from "./AppointmentInRange";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

function DateSelector( { 
    getCurrentDate, 
    locationId, 
    startDateClicked, 
    endDateClicked, 
    endDateMin, 
    startDateMax,
    fetchNextAvailableInRange,
    startDate,
    endDate,
    nextAvailableInRange,
    nextAvailable,
    searchMode,
    setSearchMode,
    appointmentList
} ) {
    const [showError, setShowError] = useState(false);

    function handleRefresh() {
        setSearchState(true);
        setTimeout(() => {
            setSearchState(false);
        }, 1000);
    }

    function handleSearch() {
        let start = new Date(`${startDate}T00:00:01`);
        let end = new Date(`${endDate}T23:59:59`);

        if (start > end) {
            setShowError(true);
            return;
        } else {
            setSearchMode(true);
            handleRefresh();
            fetchNextAvailableInRange(locationId, startDate, endDate);
        }
    };

    function handleDatePickerClick(event) {
        event.target.showPicker();
    }

    const [searchState, setSearchState] = useState(false);

    if (locationId !== "default") {
        return(
            <div id="search-container">    
                <div id="date-selectors-container">
                    <p>Search for an Appointment</p>
                    <div id="date-selectors">
                        <div className="date-label">Earliest:</div>
                        <input id="start-date" type="date" defaultValue={getCurrentDate()} max={startDateMax} min={getCurrentDate()} onChange={(e) => startDateClicked(e.target.value)} onClick={(e) => handleDatePickerClick(e)}/>
                        <div className="date-label">Latest:</div>
                        <input id="end-date" type="date" defaultValue={getCurrentDate()} min={endDateMin} onChange={(e) => endDateClicked(e.target.value)} onClick={(e) => handleDatePickerClick(e)}/>
                        <button type="button" id="date-search-button" className="search-button" onClick={() => handleSearch()}>Search</button>
                    </div>
                </div>
                {
                        showError ? 
                                <div className="error-container">
                                    <p className="error-text">Your start date must occur before your end date.</p>
                                    <button className="search-button" onClick={() => setShowError(false)}>X</button>
                                </div>
                                : <></>
                }
                {
                    searchState ?
                        <div id="search-results-container" className="card-container">
                            <Spinner variant="border"/> 
                        </div>
                            :
                        nextAvailable !== undefined && nextAvailable.length > 0 ? 
                            <AppointmentInRange 
                                startDate={startDate} 
                                endDate={endDate} 
                                locationId={locationId} 
                                nextAvailableInRange={nextAvailableInRange} 
                                searchMode={searchMode}
                                appointmentList={appointmentList}
                                fetchNextAvailableInRange={fetchNextAvailableInRange}
                            /> : <></>
                }
            </div>
        )
    }
};

export default DateSelector;