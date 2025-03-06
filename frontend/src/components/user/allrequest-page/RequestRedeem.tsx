import React, { useEffect, useState } from "react";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import IrequestModel from "../../../interface/IrequestModel";
import { useLocation, useNavigate } from "react-router-dom";
import getRequestDetails from "../../../api/user-api/getRequestDetails";
import validateRequestRedeemFormEntries from "../../../validations/requestRedeemValidations";
import ValidationError from "../shared/ValidationError";
import saveRedeemRequest from "../../../api/user-api/saveRedeemRequestAPI";

const RequestRedeem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = location.state?.requestId;

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<IrequestModel | undefined>(
    undefined
  );

  const [errorData, setErrorData] = useState({
    foundLocationError: "",
    foundDateError: "",
    damageIssuesError: "",
    mobileNumberError: "",
    bankNameError: "",
    accountNumberError: "",
    ifscCodeError: "",
    accountHolderNameError: "",
    imagesError: "",
  });

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (requestId == undefined) {
          showErrorToast2("Invalid Access Detected");
          return;
        } else {
          const response = await getRequestDetails({
            requestId,
            from: "normalRequest",
          });
          if (response.status === 200) {
            setRequestData(response.data.data.requestData);
          } else {
            showErrorToast2(response.data.message);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Request Data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getRequestData();
  }, [requestId]);

  const [formData, setFormData] = useState({
    foundLocation: "",
    foundDate: "",
    damageIssues: "",
    mobileNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    images: [] as File[],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const CLOUDINARY_UPLOAD_PRESET = "request_redeem_preset";
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedImages = Array.from(e.target.files);

      if (uploadedImages.length > 4) {
        showSuccessToast2("Maximum No. of images is 4");
        return;
      }

      const uploadedImageUrls: any[] = [];

      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
          const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.secure_url) {
            uploadedImageUrls.push(data.secure_url);
          }
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }

      console.log(uploadedImageUrls);

      setPreviewImages((prev) => [...prev, ...uploadedImageUrls]);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImageUrls],
      }));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setErrorData({
      foundLocationError: "",
      foundDateError: "",
      damageIssuesError: "",
      mobileNumberError: "",
      bankNameError: "",
      accountNumberError: "",
      ifscCodeError: "",
      accountHolderNameError: "",
      imagesError: "",
    });

    const errors = validateRequestRedeemFormEntries({
      requestRedeemDetails: formData,
      requestCreationDate: requestData?.createdAt
        ? requestData?.missing_date
        : new Date(),
    });

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      setErrorData((prevState) => {
        const updatedErrors: typeof errorData = { ...prevState };

        Object.keys(errors).forEach((key) => {
          const errorKey = `${key}Error` as keyof typeof errorData;
          if (errors[key as keyof typeof errors]) {
            updatedErrors[errorKey] = errors[key as keyof typeof errors] || "";
          } else {
            updatedErrors[errorKey] = "";
          }
        });

        return updatedErrors;
      });
    } else {
      try {
        const response = await saveRedeemRequest({
          formData,
          requestId: requestData ? requestData._id : "noRequestedIdGot",
        });

        if (response.status) {
          showSuccessToast2(response.data.message);
          navigate("/requests");
        } else {
          showErrorToast2(response.data.message);
        }
      } catch (error) {
        console.error("Failed to Insert the Request Redeem Details:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-violet-50">
      <div className="w-full min-h-screen flex justify-center p-4">
        <div className="w-full max-w-3xl bg-white my-8 rounded-xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-violet-800 mb-6">
              Submit Found Item
            </h1>
            <div className="bg-violet-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-violet-600">Request ID</p>
                  <p className="font-semibold">
                    {requestData?._id.slice(0, 6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-violet-600 md:ml-[-100px]">
                    Item Name
                  </p>
                  <p className="font-semibold md:ml-[-100px]">
                    {requestData?.product_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-violet-600 md:ml-[40px]">
                    Reward Amount
                  </p>
                  <p className="font-semibold md:ml-[40px]">
                    ₹{requestData?.reward_amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  Found Location
                </label>
                <ValidationError
                  display={!!errorData.foundLocationError}
                  name="foundLocation"
                  content={errorData.foundLocationError}
                />{" "}
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter location where item was found"
                  onChange={(e) =>
                    handleChange("foundLocation", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  Mobile Number
                </label>
                <ValidationError
                  display={!!errorData.mobileNumberError}
                  name="mobileNumber"
                  content={errorData.mobileNumberError}
                />{" "}
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter Mobile Number here"
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  Found Date
                </label>
                <ValidationError
                  display={!!errorData.foundDateError}
                  name="foundDate"
                  content={errorData.foundDateError}
                />{" "}
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  onChange={(e) => handleChange("foundDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">
                  Damage Issues
                </label>
                <ValidationError
                  display={!!errorData.damageIssuesError}
                  name="damageIssues"
                  content={errorData.damageIssuesError}
                />{" "}
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 h-24"
                  placeholder="Describe any damage to the item otherways type None"
                  onChange={(e) => handleChange("damageIssues", e.target.value)}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h2 className="font-semibold text-violet-800">Bank Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ValidationError
                      display={!!errorData.bankNameError}
                      name="bankName"
                      content={errorData.bankNameError}
                    />{" "}
                    <input
                      type="text"
                      className="p-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Bank Name"
                      onChange={(e) => handleChange("bankName", e.target.value)}
                    />
                  </div>
                  <div>
                    <ValidationError
                      display={!!errorData.accountNumberError}
                      name="accountNumber"
                      content={errorData.accountNumberError}
                    />{" "}
                    <input
                      type="text"
                      className="p-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Account Number"
                      onChange={(e) =>
                        handleChange("accountNumber", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <ValidationError
                      display={!!errorData.ifscCodeError}
                      name="ifscCode"
                      content={errorData.ifscCodeError}
                    />{" "}
                    <input
                      type="text"
                      className="p-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="IFSC Code"
                      onChange={(e) => handleChange("ifscCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <ValidationError
                      display={!!errorData.accountHolderNameError}
                      name="accountHolderName"
                      content={errorData.accountHolderNameError}
                    />{" "}
                    <input
                      type="text"
                      className="p-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Account Holder Name"
                      onChange={(e) =>
                        handleChange("accountHolderName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <p className="text-violet-700 font-semibold mb-2">
                Upload Images
              </p>
              <ValidationError
                display={!!errorData.imagesError}
                name="images"
                content={errorData.imagesError}
              />{" "}
              <div className="border border-dashed border-gray-400 rounded-md p-4 bg-gray-100">
                <label className="flex flex-col items-center cursor-pointer">
                  <span className="text-violet-700 font-medium">
                    Click to upload images of the Item
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Uploaded preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleSubmit}
                className="w-full bg-violet-600 text-white font-semibold rounded-lg py-3 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors mt-6"
              >
                Submit Found Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRedeem;
