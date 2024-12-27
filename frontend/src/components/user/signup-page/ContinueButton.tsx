type propsType = {
  text: string;
  item: string;
  details?: {
    userFullName?: string;
    userName?: string;
    userLocation?: string;
    userEmail?: string;
    userPassword?: string;
  };
};

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const continueButton = (props: propsType) => {
  const { step } = useSelector((state: RootState) => state.registerStep);

  function handleVerifyAndContinue() {
    handleNext();
  }

  async function handleNext(): Promise<void> {
    if (step == 3) {
    }
  }

  return (
    <div>
      {props.item == "OTPButton" ? (
        <button className="w-full border text-white border-gray-500 text-md p-2 bg-black rounded-lg hover:bg-gray-300 hover:text-black transition-all ease-in-out duration-300 mt-4">
          {props.text}
        </button>
      ) : (
        <button
          onClick={handleVerifyAndContinue}
          className="w-full border text-white border-gray-500 text-md p-2 bg-black rounded-lg hover:bg-gray-300 hover:text-black transition-all ease-in-out duration-300 mt-4"
        >
          {props.text}
        </button>
      )}
    </div>
  );
};

export default continueButton;
