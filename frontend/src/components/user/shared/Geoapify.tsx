import { useEffect, useState } from "react";
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
  const countryCodes = ["IN"] as any;
  const limit = 5;

  function onPlaceSelect(value: any) {
    setDisplayValue(value?.properties?.city || "");
  }

  function onSuggestionChange(value: any) {
    console.log(value);
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

  return (
    <GeoapifyContext
      apiKey={geoapifyKey}
      className="bg-red-200 mt-36"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(e)
      }
    >
      {props.forThe !== "onUserRegister" ? (
        <div className="w-96 bg-blue-200 p-4 rounded-lg shadow-lg">
          <GeoapifyGeocoderAutocomplete
            placeholder="Enter city name in India"
            type={type}
            lang={language}
            countryCodes={countryCodes}
            limit={limit}
            value={displayValue}
            placeSelect={onPlaceSelect}
            suggestionsChange={onSuggestionChange}
          />
        </div>
      ) : (
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
              lang="en"
              countryCodes={countryCodes}
              limit={limit}
              value={displayValue}
              placeSelect={onPlaceSelect}
              suggestionsChange={onSuggestionChange}
            />
          </div>
          <span
            onClick={handleGetLocationClick}
            className="text-blue-600 font-normal text-sm hover:text-blue-800 cursor-pointer"
          >
            get current location
          </span>
        </div>
      )}
    </GeoapifyContext>
  );
};

export default Geoapify;
