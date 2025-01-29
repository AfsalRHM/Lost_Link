const VerifyButton = () => (
  <div className="mt-6 flex justify-center gap-3">
    <button className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold transition-all">
    Edit Details
    </button>
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold transition-all">
      Verify Now
    </button>
  </div>
);

export default VerifyButton;
