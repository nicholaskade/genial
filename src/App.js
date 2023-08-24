import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LocationSelector from "./components/LocationSelector";
import LocationCard from "./components/LocationCard";
import NextAvailable from "./components/NextAvailable";
import { getCurrentDate } from "./utils/DateFunction";
import StateFilterSwitch from "./components/StateFilterSwitch";
import Modal from "react-bootstrap/Modal";

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
    const [appointmentList, setAppointmentList] = useState(undefined);
    const [showNotificationDisclaimer, setShowNotificationDisclaimer] = useState(true);

    function handleResumeClick() {
        window.open("https://www.nicholasnip.com", "_blank");
    }

    function startDateClicked(value){
        setStartDate(value);
        setEndDateMin(value);
        setNextAvailableInRange([]);
        setSearchMode(false);
    }

    function endDateClicked(value){
        setEndDate(value);
        setStartDateMax(value);
        setNextAvailableInRange([]);
        setSearchMode(false);
    }

    function locationClicked(e){
        setLocationId(e.target.value);
        fetchNextAvailable(e.target.value);
        setNextAvailableInRange([]);
        setNextAvailable([]);
        setSearchMode(false);
    }

    function stateSorterSwitchFlipped(){
        setLocationId("default");
        setStateSorter(!stateSorter);
        setStartDate(getCurrentDate());
        setEndDate(getCurrentDate());
        setEndDateMin(getCurrentDate());
        setStartDateMax([]);
    }

    useEffect(() => {
        if (Notification.permission === "granted") { setShowNotificationDisclaimer(false); }

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
            }
            res.sort(compareResponse);
            setLocations(res);
        });
      }, []);

    function fetchNextAvailable(locationId) {
        console.log("Fetching next available appointment...");
        fetch(`https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=1&locationId=${locationId}&minimum=1`)
        .then(response => response.json())
        .then(res => {
            setNextAvailable(res);
        })
    }

    function fetchNextAvailableInRange(locationId, startDate, endDate) {
        let start = new Date(`${startDate}T00:00:01`);
        let end = new Date(`${endDate}T23:59:59`);
        
        function evaluateSlots(appointmentArray) {
            for (let i = 0; i < appointmentArray.length; i++) {
                if (new Date(appointmentArray[i].startTimestamp) >= start && new Date(appointmentArray[i].endTimestamp) <= end) {
                    console.log("Appointments found!");
                    setNextAvailableInRange([ appointmentArray[i] ]);
                    return;
                }
            }
            console.log("No appointments found.");
            setNextAvailableInRange([]);
        }

        function populateAppointments(appointmentArray) {
            const filteredAppointments =  appointmentArray.filter(appointment => new Date(appointment.startTimestamp) >= start && new Date(appointment.endTimestamp) <= end);
            filteredAppointments.length > 0 ? setAppointmentList(filteredAppointments) : setAppointmentList(undefined);
            console.log(filteredAppointments);
        }
        
        fetch(`https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&locationId=${locationId}&limit=1000`)
            .then(response => response.json())
            .then(response => {
                evaluateSlots(response);
                populateAppointments(response);
        });

        if (nextAvailableInRange !== undefined) {
            if (new Date(nextAvailableInRange.startTimestamp) < new Date(nextAvailable.startTimestamp)) {
                setNextAvailable(nextAvailableInRange);
            }
        }
    }

    function handleDismissDisclaimer() {
        Notification.requestPermission();
        setShowNotificationDisclaimer(false);
    }

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
                    fetchNextAvailable={fetchNextAvailable}
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
            <div id="footer">
                <button onClick={() => handleResumeClick()} className="search-button" id="personal-site-link" href="www.nicholasnip.com">About My Developer</button>
            </div>

            <Modal 
                show={showNotificationDisclaimer}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header><p className="modal-text">Notifications Disclaimer</p></Modal.Header>
                <Modal.Body>
                    <div id="notification-disclaimer-body">
                        <p>Genial uses browser notifications to keep you updated on the availability of Global Entry Interview appointments.</p>
                        <p>We will not send you notifications unless you use our scan function. Notification permissions can be adjusted in your browser at any time.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="search-button" onClick={() => handleDismissDisclaimer()}>I Understand</button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default App;