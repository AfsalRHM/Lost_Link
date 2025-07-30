import google from "/google.svg";

type propsType = { item: string; loginFunc?: any };

const LoginButton = (props: propsType) => {
  return (
    <>
      {props.item == "googleButton" ? (
        <button
          className="w-full border border-gray-500 text-md p-2 bg-blue-200 rounded-lg mb-6 hover:bg-blue-300 text-black transition-all ease-in-out duration-300"
          onClick={props.loginFunc}
        >
          <img src={google} alt="Google icon" className="w-6 h-6 inline mr-2" />
          Sign in with Google
        </button>
      ) : (
        <button className="w-full bg-blue-200 text-black p-2 rounded-lg mb-6 hover:bg-blue-300 border border-gray-500  transition-all ease-in-out duration-300">
          Sign in
        </button>
      )}
    </>
  );
};

export default LoginButton;
