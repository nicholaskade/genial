import AppointmentInRange from "./AppointmentInRange";

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

    function handleSearch() {
        setSearchMode(true);
        fetchNextAvailableInRange(locationId, startDate, endDate);
    };

    if (locationId !== "default") {
        return(
            <div>    
                <div id="date-selectors-container">
                    <p>Search for an Appointment</p>
                    <div id="date-selectors">
                        <label>
                            <div className="date-label">Earliest:</div>
                            <input type="date" defaultValue={getCurrentDate()} max={startDateMax} min={getCurrentDate()} onChange={(e) => startDateClicked(e.target.value)}/>
                        </label>
                        <label>
                            <div className="date-label">Latest:</div>
                            <input type="date" defaultValue={getCurrentDate()} min={endDateMin} onChange={(e) => endDateClicked(e.target.value)}/>
                        </label>
                        <button type="button" className="search-button" onClick={() => handleSearch()}>Search</button>
                    </div>
                </div>
                {
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