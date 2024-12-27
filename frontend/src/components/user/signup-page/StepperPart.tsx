const StepperPart = () => {
  return (
    <div className="flex md:flex-col justify-between md:justify-evenly bg-slate-500 md:px-8 px-3 py-6 w-[100%] bg-center bg-no-repeat bg-contain h-[100%] md:rounded-l-2xl rounded-t-2xl">
      <div className="flex gap-3 md:mb-8 flex-col md:flex-row items-center">
        <div
          className={`rounded-full text-sky-200 hover:text-slate-900 border-2 border-sky-200 flex items-center justify-center hover:bg-sky-200 w-[35px] h-[35px]`}
        >
          <span>1</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-200 text-xs">STEP 1</span>
          <span className="font-medium text-sm text-slate-50">
            PROFILE INFO
          </span>
        </div>
      </div>
      <div className="flex gap-3 md:mb-8 flex-col md:flex-row items-center">
        <div
          className={`rounded-full text-sky-200 hover:text-slate-900 border-2 border-sky-200 flex items-center justify-center hover:bg-sky-200 w-[35px] h-[35px]`}
        >
          <span>2</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-200 text-xs">STEP 2</span>
          <span className="font-medium text-sm text-slate-50">
            VERIFICATIONS
          </span>
        </div>
      </div>
      <div className="flex gap-3 md:mb-8 flex-col md:flex-row items-center">
        <div
          className={`rounded-full text-sky-200 hover:text-slate-900 border-2 border-sky-200 flex items-center justify-center hover:bg-sky-200 w-[35px] h-[35px]`}
        >
          <span>3</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-slate-200 text-xs">STEP 3</span>
          <span className="font-medium text-sm text-slate-50">PASSWORD</span>
        </div>
      </div>
    </div>
  );
};

export default StepperPart;
