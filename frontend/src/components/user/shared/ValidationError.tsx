type propsType = {
  display: boolean;
  name: string;
  content: string;
};

const ValidationError = (props: propsType) => {
  return (
    <div className="w-8/12">
      <p
        id={props.name}
        className={`${
          props.display == true ? "text-red-700 text-xs font-medium " : "hidden"
        }`}
      >
        {props.content}*
      </p>
    </div>
  );
};

export default ValidationError;
