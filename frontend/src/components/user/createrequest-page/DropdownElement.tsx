import { DropdownElementProps } from "../../../interface/IrequestProps";

const DropdownElement = (props: DropdownElementProps) => {
  return (
    <div className="w-8/12">
      <label htmlFor={props.item} className="text-violet-700 font-semibold">
        {props.placeHolder}
      </label>
      <select
        name={props.item}
        className="w-full rounded-md bg-gray-200 h-8 text-base focus:outline-none focus:ring focus:border-blue-800 pl-2"
      >
        <option value="" disabled selected>
          Select {props.placeHolder}
        </option>
        {props.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownElement;
