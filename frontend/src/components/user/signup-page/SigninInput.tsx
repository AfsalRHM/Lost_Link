type inputProps = {
  name: string;
  item: string;
  stateFunc: (state: string) => void;
};

const SigninInput = (props: inputProps) => {
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.stateFunc(e.target.value);
  }

  return (
    <div className="py-1">
      <span className="mb-2 text-md">{props.name}</span>
      {props.item == "userFullName" || props.item == "userLocation" ? (
        <span className="mb-2 font-light text-gray-500">
          (
          {props.item == "userFullName" ? "as per in your id" : "your location"}
          )
        </span>
      ) : (
        <span></span>
      )}

      <input
        type={
          props.item === "userPassword1" || props.item === "userPassword2"
            ? "password"
            : "text"
        }
        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
        name={props.item}
        id={props.item}
        onChange={(e) => handleInputChange(e)}
      />
      {props.item == "userLocation" ? (
        <span className="text-blue-600 font-normal text-sm hover:text-blue-800 cursor-pointer">
          get current location
        </span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default SigninInput;
