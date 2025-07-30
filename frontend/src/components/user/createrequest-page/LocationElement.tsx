import { useEffect, useState } from "react";

import InputElement from "./InputElement";
import { LocationElementProps } from "../../../interface/IrequestProps";
import ValidationError from "../shared/ValidationError";

const LocationElement = ({
  setData,
  missingWhileErrorData,
  missingPlaceErrorData,
  modeOfTravelErrorData,
  missingRouteErrorData,
}: LocationElementProps) => {
  const [locationFormat, setLocationFormat] = useState<
    "route" | "specific" | null
  >(null);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      missingWhile: locationFormat ?? "",
    }));
  }, [locationFormat]);

  const handleChange = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="w-8/12">
        <ValidationError
          display={missingWhileErrorData.display}
          name="userLoginValidation"
          content={missingWhileErrorData.content}
        />
        <p className="text-violet-700 font-semibold mb-2">
          How did your item gone missing?
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
          <InputElement
            onChange={(e) => handleChange("travelMode", e.target.value)}
            item="modeOfTravel"
            placeHolder="Mode of Travel"
            errorData={modeOfTravelErrorData}
          />
          <InputElement
            onChange={(e) => handleChange("travelRoutes", e.target.value)}
            item="Routes"
            placeHolder="Routes"
            errorData={missingRouteErrorData}
          />
        </>
      ) : locationFormat == "specific" ? (
        <InputElement
          onChange={(e) => handleChange("missingPlace", e.target.value)}
          item="place"
          placeHolder="Place"
          errorData={missingPlaceErrorData}
        />
      ) : null}
    </>
  );
};

export default LocationElement;
