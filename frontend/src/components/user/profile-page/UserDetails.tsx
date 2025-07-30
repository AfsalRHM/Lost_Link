import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { userService } from "../../../services/userService";

import { formDataType, userDataType } from "../../../interface/IuserModel";
import { validateUserEditDetails } from "../../../validations/editUserDetails";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

const UserDetails = ({ userData }: { userData: userDataType | undefined }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editDetails, setEditDetails] = useState<boolean>(false);

  const CLOUDINARY_UPLOAD_PRESET = "profile_preset";
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

  const [formData, setFormData] = useState<formDataType>({
    profilePic: userData?.profile_pic,
    fullName: userData?.full_name,
    userName: userData?.user_name,
    email: userData?.email,
    phone: userData?.phone,
  });

  const fileRef = useRef<any>(null);
  const [image, setImage] = useState<string | undefined>(formData.profilePic);

  async function handleImageSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    const currentImage = e.target.files ? e.target.files[0] : null;
    if (!currentImage) return;

    const formData = new FormData();
    formData.append("file", currentImage);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setImage(data.secure_url);

        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePic: data.secure_url,
        }));
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: type === "number" ? (value ? Number(value) : "") : value,
    }));
  };

  async function saveEditedData(formData: formDataType) {
    try {
      const errors = validateUserEditDetails(formData);
      if (errors.phone) {
        showErrorToast2(errors.phone.content);
        formData.profilePic = userData?.profile_pic;
        formData.fullName = userData?.full_name;
        formData.userName = userData?.user_name;
        formData.email = userData?.email;
        formData.phone = userData?.phone;
      } else if (errors.fullName) {
        showErrorToast2(errors.fullName.content);
        formData.profilePic = userData?.profile_pic;
        formData.fullName = userData?.full_name;
        formData.userName = userData?.user_name;
        formData.email = userData?.email;
        formData.phone = userData?.phone;
      } else if (errors.userName) {
        showErrorToast2(errors.userName.content);
        formData.profilePic = userData?.profile_pic;
        formData.fullName = userData?.full_name;
        formData.userName = userData?.user_name;
        formData.email = userData?.email;
        formData.phone = userData?.phone;
      } else {
        const response = await userService.updateUser({ formData });

        if (response.status === 200) {
          showSuccessToast2("user details updated successfully");
        } else {
          console.log(
            response,
            "this is the error response on saveUpdatedData"
          );
          UserErrorHandling(response, dispatch, navigate);
        }
      }
    } catch (error) {
      console.log("error while saving the user updated data", error);
    }
  }

  function removeProfileImage() {
    setImage(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
    formData.profilePic =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }

  return (
    <div className="flex items-center gap-6 mb-6">
      <div className="h-20 w-20 bg-gray-300 rounded-full shadow-md">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => handleImageSubmit(e)}
        />
        <img
          className="self-center cursor-pointer rounded-full object-cover"
          src={image}
          alt="profile_pic"
          onClick={editDetails ? () => fileRef?.current?.click() : undefined}
        />
        {editDetails &&
          image !==
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" && (
            <div className="flex justify-center">
              <button
                className="bg-red-500 px-1 mt-1 rounded-md"
                onClick={removeProfileImage}
              >
                Remove
              </button>
            </div>
          )}
      </div>

      <div className="md:grid grid-cols-2 gap-4 flex-grow">
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Full Name:</span>
          {editDetails ? (
            <input
              id="fullName"
              type="text"
              value={formData?.fullName}
              className="text-gray-500 bg-slate-200 rounded-sm block"
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-gray-600 block">{formData?.fullName}</span>
          )}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-700">User Name:</span>
          {editDetails ? (
            <input
              id="userName"
              type="text"
              value={formData?.userName}
              className="text-gray-500 bg-slate-200 rounded-sm block"
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-gray-600 block">{formData?.userName}</span>
          )}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-600 block">{userData?.email}</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Phone Number:</span>
          {editDetails ? (
            <input
              id="phone"
              type="number"
              value={formData?.phone ?? ""}
              className="text-gray-500 bg-slate-200 rounded-sm block"
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-gray-600 block">
              {formData?.phone ? formData?.phone : "Not Available"}
            </span>
          )}
        </div>
      </div>

      {editDetails ? (
        <button
          className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          onClick={() => {
            setEditDetails(!editDetails);
            saveEditedData(formData);
          }}
        >
          Save Details
        </button>
      ) : (
        <button
          className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          onClick={() => {
            setEditDetails(!editDetails);
          }}
        >
          Edit Details
        </button>
      )}
      {editDetails ? (
        <button
          className="md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          onClick={() => {
            setEditDetails(!editDetails);
            saveEditedData(formData);
          }}
        >
          Save
        </button>
      ) : (
        <button
          className="md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          onClick={() => {
            setEditDetails(!editDetails);
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default UserDetails;
