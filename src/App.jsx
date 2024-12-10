import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import "./App.css";

const mapContainerStyle = {
  width: "100vw",
  height: "60vh",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "fhdgjk",
    libraries: ["places"],
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    house: "",
    street: "",
    type: "Home",
  });

  const [locationError, setLocationError] = useState(false);

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(location);
  };

  const handleLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(false);
      },
      () => setLocationError(true)
    );
  };

  const handleSaveAddress = async () => {
    try {
      await axios.post("http://localhost:5000/api/save-location", {
        ...selectedLocation,
        ...addressDetails,
      });
      alert("Location saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving location.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h1>Location/Address Flow</h1>

      <button onClick={handleLocationPermission}>Enable Location</button>

      {locationError && (
        <p className="error-message">
          Location permission denied. Please enable it.
        </p>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={selectedLocation || center}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>

      <form className="address-form">
        <label>
          House/Flat No:
          <input
            type="text"
            value={addressDetails.house}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, house: e.target.value })
            }
          />
        </label>
        <label>
          Street/Area:
          <input
            type="text"
            value={addressDetails.street}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, street: e.target.value })
            }
          />
        </label>
        <label>
          Address Type:
          <select
            value={addressDetails.type}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, type: e.target.value })
            }
          >
            <option>Home</option>
            <option>Office</option>
            <option>Friends & Family</option>
          </select>
        </label>
        <button type="button" onClick={handleSaveAddress}>
          Save Address
        </button>
      </form>
    </div>
  );
}

export default App;
