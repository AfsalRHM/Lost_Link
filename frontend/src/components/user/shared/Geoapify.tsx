import { useEffect, useRef, useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "../../../assets/css/geoapify-custom.css";
import { showErrorToast2 } from "../../../utils/iziToastUtils";

type geoapifyProps = {
  forThe: string;
  stateFunc?: (state: string) => void;
};

const Geoapify = (props: geoapifyProps) => {
  const geoapifyKey = import.meta.env.VITE_GEOPIFY_API_KEY;
  const [displayValue, setDisplayValue] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (props.stateFunc) {
      props.stateFunc(displayValue);
    }
  }, [displayValue]);

  const type: "city" = "city";
  const language = "en";
  const filterByCountryCode = ["IN"] as any;
  const limit = 5;

  function onPlaceSelect(value: any) {
    setDisplayValue(value?.properties?.city || "");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.stateFunc) {
      props.stateFunc(e.target.value);
    }
  }

  async function getLocationDetails({
    lat,
    lon,
  }: {
    lat: number;
    lon: number;
  }) {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${geoapifyKey}`
      );
      const data = await response.json();
      console.log("Location Details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  }

  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      const inputEl = inputRef.current.querySelector("input");
      if (inputEl) {
        inputEl.addEventListener("input", (e: any) => {
          if (props.stateFunc) {
            props.stateFunc(e.target.value);
          }
        });
      }
    }
  }, []);

  async function handleGetLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log(userLocation, "this is the location");
          const locationDetails = await getLocationDetails({
            lat: latitude,
            lon: longitude,
          });
          setDisplayValue(locationDetails.features[0].properties.city);
        },
        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      showErrorToast2("Geolocation is not supported by this browser");
      console.error("Geolocation is not supported by this browser.");
    }
  }

  const renderContent = () => {
    if (props.forThe === "onUserRegister") {
      return (
        <div className="py-1">
          <span className="mb-2 text-md">
            Enter Location
            <span className="mb-2 font-light text-gray-500">
              (your location)
            </span>
          </span>
          <div className="w-full border-gray-300 rounded-md">
            <GeoapifyGeocoderAutocomplete
              placeholder="Enter city name"
              type="city"
              lang={language}
              filterByCountryCode={filterByCountryCode}
              limit={limit}
              value={displayValue}
              placeSelect={onPlaceSelect}
            />
          </div>
          <span
            onClick={handleGetLocationClick}
            className="text-blue-600 font-normal text-sm hover:text-blue-800 cursor-pointer"
          >
            get current location
          </span>
        </div>
      );
    } else if (props.forThe === "filters") {
      return (
        <div className="w-full rounded-md" ref={inputRef}>
          <GeoapifyGeocoderAutocomplete
            placeholder="Enter city name in India"
            type={type}
            lang={language}
            filterByCountryCode={filterByCountryCode}
            limit={limit}
            value={displayValue}
            placeSelect={onPlaceSelect}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full bg-white rounded-lg">
          <GeoapifyGeocoderAutocomplete
            placeholder="Enter city name in India"
            type={type}
            lang={language}
            filterByCountryCode={filterByCountryCode}
            limit={limit}
            value={displayValue}
            placeSelect={onPlaceSelect}
          />
        </div>
      );
    }
  };

  return (
    <GeoapifyContext
      apiKey={geoapifyKey}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(e)
      }
    >
      {renderContent()}
    </GeoapifyContext>
  );
};

export default Geoapify;
