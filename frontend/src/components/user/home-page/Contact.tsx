const Contact = ({contactRef}: {contactRef: any}) => {
  return (
    <div ref={contactRef} className="w-full bg-blue-400 flex flex-col md:flex-row justify-center gap-10 md:gap-20 py-14 px-4">
      <div className="flex flex-col gap-7 w-full md:w-1/2">
        <div className="font-bold text-3xl">Contact Us</div>
        <div className="text-lg">
          Feel free to contact us at any time, we will get back as soon as
          possible.
        </div>
        <div className="pl-4 flex flex-col gap-8">
          <div>
            <p className="font-semibold">Name</p>
            <input type="text" className="bg-blue-400 border-b-2 w-full" />
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <input type="text" className="bg-blue-400 border-b-2 w-full" />
          </div>
          <div>
            <p className="font-semibold">Message</p>
            <input type="text" className="bg-blue-400 border-b-2 w-full" />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-black text-white px-20 py-2 text-xl rounded-full font-semibold hover:bg-gray-600 transition-all ease-in-out duration-300">
            Send
          </button>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2">
        <img
          src="contact-image.jpg"
          className="opacity-85 rounded-lg w-full"
          alt="Contact"
        />
      </div>
    </div>
  );
};

export default Contact;
