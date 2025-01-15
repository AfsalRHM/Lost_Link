import DescriptionElement from "./DescriptionElement";
import DropdownElement from "./DropdownElement";
import ImagesElement from "./ImagesElement";
import InputElement from "./InputElement";
import LocationElement from "./LocationElement";

const CreateRequestForm = () => {
  return (
    <div className="bg-activity">
      <div className="w-full bg-banner h-auto rounded-xl border border-black flex justify-center">
        <div className="w-11/12 md:w-6/12 bg-blue-300 my-8 rounded-md border border-black">
          <div className="flex justify-center p-5">
            <p className="font-medium text-2xl underline">New Request</p>
          </div>
          <div className="flex justify-center items-center pb-5 flex-col gap-3 mb-7">
            <InputElement item="product_name" placeHolder="Product Name" />
            <InputElement item="request_reward" placeHolder="Reward Amount" />
            <DropdownElement
              item="product_category"
              placeHolder="Product Category"
              options={[
                "Electronics",
                "Clothing",
                "Furniture",
                "Books",
                "Cosmetics",
              ]}
            />
            <LocationElement />
            <InputElement item="missing_date" placeHolder="Missing Date" />
            <DropdownElement
              item="expiration_month"
              placeHolder="Expiration Month"
              options={["1 Month", "2 Month", "3 Month"]}
            />
            <ImagesElement />
            <DescriptionElement />
            <button className="w-5/12 bg-violet-700 text-white font-semibold rounded-md h-10 hover:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-500 mt-5">
              Continue To Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestForm;
