type propsType = {
    display: boolean;
    name: string;
    content: string;
  };
  
  const ValidationError = (props: propsType) => {
    return (
      <p id={props.name} className={`${props.display == true ? "text-red-700 text-xs font-medium" : "hidden"}`}>
        {props.content}*
      </p>
    );
  };
  
  export default ValidationError;
  