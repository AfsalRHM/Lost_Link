const Main = ({ scrollToContact }: { scrollToContact: any }) => {
  return (
    <div className="w-full bg-banner flex md:flex-row">
      <div className="w-full md:w-2/3 px-10 md:px-32 py-5 md:py-20">
        <div
          className="font-bold md:font-extrabold text-[30px] md:text-[45px] mb-10 text-shadow-sm"
          style={{ lineHeight: "1" }}
        >
          What’s lost can be found.<br></br>
          <span
            className="text-[30px] md:text-[45px] font-semibold md:font-bold"
            style={{ lineHeight: "1" }}
          >
            Together, we make it <br></br> Happen.
          </span>
        </div>
        <div className="font-semibold text-xl mb-5 md:mb-20 text-shadow-lg">
          LostLink connects lost items with their owners, making it easy to
          report, find, and earn rewards. Your lost belongings are just a step
          away from being found.
        </div>
        <div>
          <button
            onClick={scrollToContact}
            className="px-8 py-3 rounded-full bg-blue-400 shadow-lg hover:bg-blue-500 ease-in-out transition-all duration-300 font-semibold text-lg"
          >
            Talk to Us
          </button>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center md:pl-8">
        <img
          className="w-auto h-[450px]"
          src="/Banner-Image.png"
          alt="Bannerimage"
        />
      </div>
    </div>
  );
};

export default Main;
