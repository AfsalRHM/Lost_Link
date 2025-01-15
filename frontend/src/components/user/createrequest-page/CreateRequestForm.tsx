import { useState } from "react";
import DescriptionElement from "./DescriptionElement";
import DropdownElement from "./DropdownElement";
import ImagesElement from "./ImagesElement";
import InputElement from "./InputElement";
import LocationElement from "./LocationElement";
import validateCreateRequestEntries from "../../../validations/createRequestValidation";
import { Errors } from "../../../interface/IrequestProps";

const CreateRequestForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    requestReward: 0,
    productCategory: "",
    travelMode: "",
    travelRoutes: [] as string[],
    missingPlace: "",
    missingDate: "",
    expirationLimit: "",
    images: [] as File[],
    additionalInfo: "",
  });

  const [errorData, setErrorData] = useState({
    productNameValidationErrorData: { display: false, content: "" },
    requestRewardValidationErrorData: { display: false, content: "" },
    productCategoryValidationErrorData: { display: false, content: "" },
    travelModeValidationErrorData: { display: false, content: "" },
    travelRoutesValidationErrorData: { display: false, content: "" },
    missingPlaceValidationErrorData: { display: false, content: "" },
    missingDateValidationErrorData: { display: false, content: "" },
    expirationLimitValidationErrorData: { display: false, content: "" },
    imagesValidationErrorData: { display: false, content: "" },
    additionalInfoValidationErrorData: { display: false, content: "" },
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setErrorData({
      productNameValidationErrorData: { display: false, content: "" },
      requestRewardValidationErrorData: { display: false, content: "" },
      productCategoryValidationErrorData: { display: false, content: "" },
      travelModeValidationErrorData: { display: false, content: "" },
      travelRoutesValidationErrorData: { display: false, content: "" },
      missingPlaceValidationErrorData: { display: false, content: "" },
      missingDateValidationErrorData: { display: false, content: "" },
      expirationLimitValidationErrorData: { display: false, content: "" },
      imagesValidationErrorData: { display: false, content: "" },
      additionalInfoValidationErrorData: { display: false, content: "" },
    });
    const errors = validateCreateRequestEntries(formData);
    if (errors) {
      let hasErrors = false;
      Object.keys(errors).forEach((key) => {
        const errorKey = `${key}ValidationErrorData` as keyof typeof errorData;
        if (errors[key as keyof Errors]) {
          setErrorData((prevState) => ({
            ...prevState,
            [errorKey]: {
              display: errors[key as keyof Errors]?.display || false,
              content: errors[key as keyof Errors]?.content || "",
            },
          }));
          hasErrors = true;
        } else {
          setErrorData((prevState) => ({
            ...prevState,
            [errorKey]: {
              display: false,
              content: "",
            },
          }));
        }
      });
      if (hasErrors) {
        console.log(
          "Form contains errors, submission aborted.",
          errorData,
          formData
        );
        return;
      }
    }
    // If there has no errors what to do
    
  };

  return (
    <div className="bg-activity">
      <div className="w-full bg-banner h-auto rounded-xl border border-black flex justify-center">
        <div className="w-11/12 md:w-6/12 bg-blue-300 my-8 rounded-md border border-black">
          <div className="flex justify-center p-5">
            <p className="font-medium text-2xl underline">New Request</p>
          </div>
          <div className="flex justify-center items-center pb-5 flex-col gap-3 mb-7">
            <InputElement
              item="product_name"
              placeHolder="Product Name"
              onChange={(e) => handleChange("productName", e.target.value)}
              errorData={errorData.productNameValidationErrorData}
            />
            <InputElement
              item="request_reward"
              placeHolder="Reward Amount"
              onChange={(e) => handleChange("requestReward", e.target.value)}
              errorData={errorData.requestRewardValidationErrorData}
            />
            <DropdownElement
              item="product_category"
              placeHolder="Product Category"
              options={[
                "Electronics",
                "Clothing",
                "Furniture",
                "Books",
                "Cosmetics",
              ]}
              onChange={(value) => handleChange("productCategory", value)}
              errorData={errorData.productCategoryValidationErrorData}
            />
            <LocationElement
              setData={setFormData}
              missingPlaceErrorData={errorData.missingPlaceValidationErrorData}
              modeOfTravelErrorData={errorData.travelModeValidationErrorData}
              missingRouteErrorData={errorData.travelRoutesValidationErrorData}
            />
            <InputElement
              item="missing_date"
              placeHolder="Missing Date"
              onChange={(e) => handleChange("missingDate", e.target.value)}
              errorData={errorData.missingDateValidationErrorData}
            />
            <DropdownElement
              item="expiration_month"
              placeHolder="Expiration Month"
              options={["1 Month", "2 Month", "3 Month"]}
              onChange={(value) => handleChange("expirationLimit", value)}
              errorData={errorData.expirationLimitValidationErrorData}
            />
            <ImagesElement
              onChange={(uploadedImages) =>
                handleChange("images", uploadedImages)
              }
              errorData={errorData.imagesValidationErrorData}
            />
            <DescriptionElement
              onChange={(value) => handleChange("additionalInfo", value)}
            />
            <button
              onClick={handleSubmit}
              className="w-5/12 bg-violet-700 text-white font-semibold rounded-md h-10 hover:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-500 mt-5"
            >
              Continue To Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestForm;
