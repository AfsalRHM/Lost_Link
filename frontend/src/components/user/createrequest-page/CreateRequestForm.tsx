import { useState } from "react";
import DescriptionElement from "./DescriptionElement";
import DropdownElement from "./DropdownElement";
import ImagesElement from "./ImagesElement";
import InputElement from "./InputElement";
import LocationElement from "./LocationElement";
import validateCreateRequestEntries from "../../../validations/createRequestValidation";
import { Errors } from "../../../interface/IrequestProps";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import createRequest from "../../../api/user-api/createRequestAPI";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../../../redux/slice/accessTokenSlice";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import makePayment from "../../../api/user-api/makePaymentAPI";

const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;

const CreateRequestForm = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    lastSeen: "",
    missingWhile: "",
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
    lastSeenValidationErrorData: { display: false, content: "" },
    missingWhileValidationErrorData: { display: false, content: "" },
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
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
      lastSeenValidationErrorData: { display: false, content: "" },
      missingWhileValidationErrorData: { display: false, content: "" },
    });

    console.log(
      "this is the from data going for frontend validation",
      formData
    );

    const errors = validateCreateRequestEntries(formData);

    console.log(errors);

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

    // Setting up the payment
    if (!STRIPE_KEY) {
      console.log("Stripe Key Not Provided");
      showErrorToast("Request Failed to Create...!");
      return;
    }

    const stripe: Stripe | null = await loadStripe(STRIPE_KEY);
    if (!stripe) {
      showErrorToast("Failed to load Stripe. Please try again.");
      return;
    }

    try {
      const paymentResponse = await makePayment({
        formData,
        accessToken,
      });

      const { sessionId } = paymentResponse.data.data;

      const response = await createRequest({
        formData,
        accessToken,
      });

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error("Stripe Checkout error: ", result.error);
        showErrorToast("Stripe Checkout error...!");
        return;
      }

      if (response === false) {
        dispatch(removeUserDetails());
        dispatch(removeAccessToken());
        navigate("/login");
        showErrorToast("Session Expired! Please Login...");
      } else {
        if (response.data.status) {
          showSuccessToast("Request Created Successfully.");
          navigate("/home");
        } else {
          showErrorToast("Request Failed to Create...!");
        }
      }
    } catch (error) {
      console.error(error);
      showErrorToast("An unexpected error occurred. Please try again.");
    }
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
                "Accessories"
              ]}
              onChange={(value) => handleChange("productCategory", value)}
              errorData={errorData.productCategoryValidationErrorData}
            />
            <InputElement
              item="last_seen"
              placeHolder="Last Seen At"
              onChange={(e) => handleChange("lastSeen", e.target.value)}
              errorData={errorData.lastSeenValidationErrorData}
            />
            <LocationElement
              setData={setFormData}
              missingWhileErrorData={errorData.missingWhileValidationErrorData}
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
