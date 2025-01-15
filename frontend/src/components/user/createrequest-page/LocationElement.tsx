import { useState } from "react";
import InputElement from "./InputElement";

const LocationElement = () => {
  const [locationFormat, setLocationFormat] = useState<
    "route" | "specific" | null
  >(null);

  return (
    <>
      <div className="w-8/12">
        <p className="text-violet-700 font-semibold mb-2">
          Where did your item go missing?
        </p>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="missing_location"
              value="While traveling"
              className="h-4 w-4 text-violet-700 focus:ring focus:ring-violet-500"
              onClick={() => setLocationFormat("route")}
            />
            <span>While traveling</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="missing_location"
              value="At a specific place"
              className="h-4 w-4 text-violet-700 focus:ring focus:ring-violet-500"
              onClick={() => setLocationFormat("specific")}
            />
            <span>At a specific place</span>
          </label>
        </div>
      </div>
      {locationFormat == "route" ? (
        <>
          <InputElement item="modeOfTravel" placeHolder="Mode of Travel" />
          <InputElement item="Routes" placeHolder="Routes" />
        </>
      ) : locationFormat == "specific" ? (
        <InputElement item="place" placeHolder="Place" />
      ) : null}
    </>
  );
};

export default LocationElement;
