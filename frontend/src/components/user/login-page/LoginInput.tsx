import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type inputProps = {
  name: string;
  item: string;
  stateFunc: (state: string) => void;
};

const LoginInput = (props: inputProps) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.stateFunc(e.target.value);
  }

  const [showPassword, setShowPassword] = useState<boolean>(true);

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="py-4 relative">
      <span className="mb-2 text-md">{props.name}</span>
      <input
        type={props.item == "password" ? showPassword == true ? "password" : "text" : "text"}
        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
        name={props.item}
        id={props.item}
        onChange={(e) => handleChange(e)}
      />
      {props.item == "password" ? (
        showPassword == false ? (
          <span className="absolute inset-y-0 top-6 right-3 flex items-center">
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{ fontSize: "20px" }}
              className=" cursor-pointer"
              onClick={handleShowPassword}
            />
          </span>
        ) : (
          <span className="absolute inset-y-0 top-6 right-3 flex items-center">
            <FontAwesomeIcon
              icon={faEye}
              style={{ fontSize: "20px" }}
              className="cursor-pointer"
              onClick={handleShowPassword}
            />
          </span>
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default LoginInput;
