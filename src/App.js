import React, {useState, useEffect} from "react";
import Header from "./Header";
import LocationSelector from "./LocationSelector";
import LocationCard from "./LocationCard";
import NextAvailable from "./NextAvailable";
import { getCurrentDate } from "./utils/DateFunction";
import StateFilterSwitch from "./StateFilterSwitch";

function App() {
    const [locations, setLocations] = useState([]);
    const [locationId, setLocationId] = useState("default");
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [stateSorter, setStateSorter] = useState(false);
    const [stateSelected, setStateSelected] = useState("default");
    const [endDateMin, setEndDateMin] = useState(getCurrentDate());
    const [startDateMax, setStartDateMax] = useState([]);
    const [nextAvailable, setNextAvailable] = useState([]);
    const [nextAvailableInRange, setNextAvailableInRange] = useState([]);
    const [searchMode, setSearchMode] = useState(false);
    const [appointmentList, setAppointmentList] = useState([]);

    function startDateClicked(value){
        setStartDate(value);
        setEndDateMin(value);
        setNextAvailableInRange([]);
        setSearchMode(false);
    };

    function endDateClicked(value){
        setEndDate(value);
        setStartDateMax(value);
        setNextAvailableInRange([]);
        setSearchMode(false);
    };

    function locationClicked(e){
        setLocationId(e.target.value);
        fetchNextAvailable(e.target.value);
        setNextAvailableInRange([]);
        setNextAvailable([]);
        setSearchMode(false);
    };

    function stateSorterSwitchFlipped(){
        setLocationId("default");
        setStateSorter(!stateSorter);
        setStartDate(getCurrentDate());
        setEndDate(getCurrentDate());
        setEndDateMin(getCurrentDate());
        setStartDateMax([]);
    };

    useEffect(() => {
        fetch('https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global%20Entry')
        .then(response => response.json())
        .then(res => {
            function compareResponse(a, b) {
                if (a.state < b.state) {
                    return -1;
                }
                if (a.state > b.state) {
                    return 1;
                }
                if (a.state === b.state && a.name < b.name) {
                    return -1;
                }
                if (a.state === b.state && a.name > b.name) {
                    return 1;
                }
            };
            res.sort(compareResponse);
            setLocations(res);
        })
      }, []);

    function fetchNextAvailable(locationId) {
        fetch(`https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=1&locationId=${locationId}&minimum=1`)
        .then(response => response.json())
        .then(res => {
            setNextAvailable(res);
        });
    };

    function fetchNextAvailableInRange(locationId, startDate, endDate) {
        let start = new Date(`${startDate}T00:00:01`);
        let end = new Date(`${endDate}T23:59:59`);
        
        function evaluateSlots(appointmentArray) {
            for (let i = 0; i < appointmentArray.length; i++) {
                if (new Date(appointmentArray[i].startTimestamp) >= start && new Date(appointmentArray[i].endTimestamp) <= end) {
                    setNextAvailableInRange([ appointmentArray[i] ]);
                    return;
                };
                setNextAvailableInRange([]);
            };
        };

        function populateAppointments(appointmentArray) {
            const filteredAppointments =  appointmentArray.filter(appointment => new Date(appointment.startTimestamp) >= start && new Date(appointment.endTimestamp) <= end);
            setAppointmentList(filteredAppointments);
            console.log(filteredAppointments);
        };
        
        fetch(`https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&locationId=${locationId}&limit=1000`)
            .then(response => response.json())
            .then(response => {
                evaluateSlots(response);
                populateAppointments(response);
        });
    };

    return (
        <>
            <Header />
            
            <div id="app-body">
                
                <StateFilterSwitch 
                    stateSorter={stateSorter} 
                    stateSorterSwitchFlipped={stateSorterSwitchFlipped}
                />

                <LocationSelector 
                    stateSorter={stateSorter} 
                    locations={locations} 
                    locationClicked={locationClicked} 
                    setStateSelected={setStateSelected} 
                    stateSelected={stateSelected}
                />

                <LocationCard 
                    locations={locations} 
                    locationId={locationId}
                />

                <NextAvailable 
                    fetchNextAvailableInRange={fetchNextAvailableInRange} 
                    nextAvailable={nextAvailable} 
                    locationId={locationId} 
                    startDateClicked={startDateClicked} 
                    getCurrentDate={getCurrentDate} 
                    endDateClicked={endDateClicked} 
                    endDateMin={endDateMin} 
                    startDateMax={startDateMax} 
                    endDate={endDate} 
                    startDate={startDate} 
                    nextAvailableInRange={nextAvailableInRange} 
                    searchMode={searchMode} 
                    setSearchMode={setSearchMode}
                    appointmentList={appointmentList}
                />
                
            </div>
        </>
    );
};

export default App;