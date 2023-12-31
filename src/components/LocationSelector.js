function LocationSelector({ 
    locations, 
    locationClicked, 
    stateSorter, 
    setStateSelected, 
    stateSelected,
    setLocationId
}) {
    let validStates = [];
    
    locations.map((location) => {
        if (!validStates.includes(location.state) && location.countryCode === "US") {
            return validStates.unshift(location.state);
        }
    });

    validStates.sort();

    const createLocationElementsWithAbbr = locations.map((location) => {
        if (location.countryCode === "US" && location.shortName !== "Permanently Closed") {
            return (
                <option key={location.id} value={location.id}>
                    { `${location.state}: ${location.name}` }
                </option>
            )
        }
    });

    const createValidStates = validStates.map((state, i) => {
        return (
            <option key={i} value={state} onClick={(e) => setStateSelected(e.target.value)}>
                { state }
            </option>
        )
    });

    const createSortedLocationElements = locations.map((location) => {
        if (location.countryCode === "US" && location.shortName !== "Permanently Closed" && location.state === stateSelected) {
            return (
                <option key={location.id} value={location.id}>
                    { location.name }
                </option>
            )
        }
    });
    
    if (stateSorter === false) { 
        return (
            <>
                <div id="location-container">
                    <select onChange={(e) => locationClicked(e)} id="location-selector">
                        <option value="default">Select Interview Center</option>
                        { createLocationElementsWithAbbr }
                    </select>
                </div>
            </>
        );
    } else {
        return (
            <div id="filtered-container">
                <select onChange={(e) => setStateSelected(e.target.value)} id="state-selector"> 
                    <option value="default">Select State</option>
                    { createValidStates } 
                </select>
                <select onChange={(e) => locationClicked(e)} id="filtered-location-selector">
                    <option value="default">Select Interview Center</option>
                    { createSortedLocationElements }
                </select>
            </div>
        );
    }
}

export default LocationSelector;