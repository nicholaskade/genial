import { phoneNumberStyler } from "../utils/PhoneNumberStyler";

function LocationCard({ locations, locationId }) {

    function addressAdditional(location){
        if (location.addressAdditional !== "") {
            return (
                <p>{location.addressAdditional}</p>
            )
        }
    }

    const createLocationBox = locations.map((location, i) => {
        if (location.id === parseInt(locationId)) {
            let phoneNumber = phoneNumberStyler(location.phoneNumber);
            return (
                <div id="location-card" className="card-container" key={i}>
                    <p>{location.name}</p>
                    <p>{location.address}</p>
                    { addressAdditional(location) }
                    <p>{location.city}, {location.state} {location.postalCode}</p>
                    <p>{phoneNumber}</p>
                </div>
            );
        }
    });
    
        return (
        <>
            {createLocationBox}
        </>
    )
};

export default LocationCard;