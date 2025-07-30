import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userService } from "../../../services/userService";

import { Info } from "lucide-react";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import { RootState } from "../../../redux/store";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

interface MeetScheduleModalProps {
  onClose: () => void;
  requestId: string;
}

const MeetScheduleModal: React.FC<MeetScheduleModalProps> = ({
  onClose,
  requestId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const { userId, userName } = useSelector(
    (state: RootState) => state.userDetails
  );

  const handleSchedule = async () => {
    if (!date || !time) {
      showErrorToast2("Please select both date and time.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showErrorToast2("Please select a future date.");
      return;
    }

    const selectedTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDate.getTime() === today.getTime() && selectedTime < now) {
      showErrorToast2("Please select a future time.");
      return;
    }

    const selectedHour = selectedTime.getHours();
    if (selectedHour < 9 || selectedHour >= 21) {
      showErrorToast2("Please select a time between 9 AM and 9 PM.");
      return;
    }

    // API for creating meeting
    const response = await userService.createMeeting({
      date,
      time,
      userId: userId,
      requestId,
      userName,
    });

    if (response.status == 200) {
      showSuccessToast2(`Meet scheduled for ${time} on the day of ${date}`);
      onClose();
    } else {
      console.log(response, "this is the error response on createMeeting");
      UserErrorHandling(response, dispatch, navigate);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Schedule a Meet
          <span
            className="ml-2 relative cursor-pointer"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          >
            <Info className="w-5 h-5 text-blue-500" />
            {showInfo && (
              <div className="absolute w-32 top-6 left-6 bg-gray-800 text-white text-xs p-2 rounded-md shadow-lg transition-opacity duration-300">
                The meeting will last for 15 minutes.
              </div>
            )}
          </span>
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Time:
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetScheduleModal;
