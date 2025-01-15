import { InputElementProps } from "../../../interface/IrequestProps";

const InputElement = (props: InputElementProps) => {
  return (
    <div className="w-8/12">
      <label htmlFor={props.item} className="text-violet-700 font-semibold">
        {props.placeHolder}
      </label>
      <input
        type={props.item == "missing_date" ? "date" : "text"}
        className="w-full rounded-md text-gray-500 bg-gray-200 h-8 text-base focus:outline-none focus:ring focus:border-blue-800 pl-2"
        name={props.item}
        placeholder={`Enter ${props.placeHolder}`}
      />
    </div>
  );
};

export default InputElement;
