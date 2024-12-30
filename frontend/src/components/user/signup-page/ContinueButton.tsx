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


const continueButton = (props: propsType) => {

  return (
    <div>
      {props.item == "OTPButton" ? (
        <button className="w-full border text-white border-gray-500 text-md p-2 bg-black rounded-lg hover:bg-gray-300 hover:text-black transition-all ease-in-out duration-300 mt-4">
          {props.text}
        </button>
      ) : (
        <button
          className="w-full border text-white border-gray-500 text-md p-2 bg-black rounded-lg hover:bg-gray-300 hover:text-black transition-all ease-in-out duration-300 mt-4"
        >
          {props.text}
        </button>
      )}
    </div>
  );
};

export default continueButton;
