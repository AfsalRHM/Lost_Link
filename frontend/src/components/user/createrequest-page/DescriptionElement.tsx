import { DescriptionElementProps } from "../../../interface/IrequestProps";

const DescriptionElement = ({ onChange }: DescriptionElementProps) => {
  return (
    <div className="w-8/12">
      <label
        htmlFor="description"
        className="text-violet-700 font-semibold mb-2 block"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows={4}
        placeholder="Add any additional infromations. Like color, size, etc..."
        className="w-full rounded-md bg-gray-200 text-base h-28 focus:outline-none focus:ring text-gray-500 focus:border-blue-800 pl-2 pt-2 resize-none"
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
};

export default DescriptionElement;
