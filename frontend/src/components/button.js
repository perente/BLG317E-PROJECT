export const Button = ({ children, onClick, size="md", className, ...props }) => {

  const buttonSize = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];



  return (
    <button
      {...props}
      className={"bg-blue-500 text-white rounded-lg duration-300 " + buttonSize+ " focus:outline-none " + className + (props.disabled ? " opacity-50 cursor-not-allowed" : " hover:bg-blue-700")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}