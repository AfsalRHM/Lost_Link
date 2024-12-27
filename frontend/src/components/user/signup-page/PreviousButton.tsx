import { useDispatch } from "react-redux";
import { prevStep } from "../../../redux/slice/registerStepSlice";

type propsType = { text: string; item: string };

const PreviousButton = (props: propsType) => {
  const dispatch = useDispatch();

  function handlePrevious(): void {
    dispatch(prevStep());
  }

  return (
    <div>
      <button
        onClick={handlePrevious}
        className="w-full border text-black border-gray-500 text-md p-2 bg-gray-300 rounded-lg md:mb-6 hover:bg-gray-900 hover:text-white transition-all ease-in-out duration-300 mt-4"
      >
        {props.text}
      </button>
    </div>
  );
};

export default PreviousButton;
