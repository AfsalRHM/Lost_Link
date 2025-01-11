const Reviews = () => {
    return (
      <div className="w-full bg-banner m-0 flex flex-col py-12 items-center font-medium">
        <div className="text-3xl md:text-4xl font-semibold pb-8 text-center">
          What People are Saying
        </div>
  
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 lg:gap-20 justify-center items-center mx-3">
          <div className="w-full md:w-96 h-auto min-h-[300px] bg-reviews py-6 px-4 rounded-xl flex flex-col justify-between items-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              LostLink saved the day! I lost my bag during a hectic train ride,
              and within two days, someone found it and returned it through the
              app. The process was quick, secure, and I even got a notification
              when my item was matched. Highly recommended!
            </div>
            <div className="flex flex-row items-center gap-3 mt-4">
              <div className="w-12 h-12">
                <img className="rounded-full" src="/Profile-1.png" alt="Emily S" />
              </div>
              <div>Emily S</div>
            </div>
          </div>
  
          <div className="w-full md:w-96 h-auto min-h-[300px] bg-reviews py-6 px-4 rounded-xl flex flex-col justify-between items-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              I found a wallet on the bus and didn't know how to return it safely.
              LostLink made it super easy, and I even earned a small reward for
              doing the right thing. Great app with a great mission!
            </div>
            <div className="flex flex-row items-center gap-3 mt-4">
              <div className="w-12 h-12">
                <img className="rounded-full" src="/Profile-2.png" alt="James R" />
              </div>
              <div>James R</div>
            </div>
          </div>
  
          <div className="w-full md:w-96 h-auto min-h-[300px] bg-reviews py-6 px-4 rounded-xl flex flex-col justify-between items-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              I left my designer handbag on a crowded subway and thought it was
              gone forever. LostLink found it within a week, making the whole
              process simple and secure. Truly grateful!
            </div>
            <div className="flex flex-row items-center gap-3 mt-4">
              <div className="w-12 h-12">
                <img className="rounded-full" src="/Profile-3.png" alt="Sophia L" />
              </div>
              <div>Sophia L</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Reviews;
  