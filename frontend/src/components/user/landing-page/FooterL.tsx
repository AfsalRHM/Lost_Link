const Footer = () => {
  return (
    <div className="bg-footer w-full flex justify-center items-center flex-col py-10 gap-5">
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-3">
        <img className="w-14 rounded-full p-1" src="/Logo.png" alt="Logo" />
        <p className="text-2xl font-bold text-gray-300">LostLink</p>
      </div>
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex flex-row text-white gap-10 justify-center">
          <div>Home</div>
          <div>Requests</div>
          <div>Contact</div>
          <div>About</div>
        </div>
        <div className="text-white w-10/12 md:w-6/12 text-base mx-auto">
          LostLink is dedicated to reconnecting you with what matters most.
          Whether you've lost something valuable or found an item that needs a
          home, our mission is to make the process quick, secure, and rewarding
          for everyone. Join our community and help ensure that nothing stays
          lost for long. Together, we bring peace of mind to your journey.
        </div>
        <div className="flex gap-5 text-white text-2xl justify-center mt-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook hover:text-gray-400"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram hover:text-gray-400"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter hover:text-gray-400"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin hover:text-gray-400"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
