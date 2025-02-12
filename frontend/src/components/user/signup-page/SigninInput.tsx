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
      {props.item == "userFullName" ? (
        <span className="mb-2 font-light text-gray-500">
          ({props.item == "userFullName" ? "as per in your id" : undefined})
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
    </div>
  );
};

export default SigninInput;
