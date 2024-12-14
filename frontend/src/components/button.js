export const Button = ({ children, onClick, size = "md", className, ...props }) => {

  const buttonSize = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];

  const type = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    error: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  }[props.type] || "bg-blue-600 text-white hover:bg-blue-700";



  return (
    <button
      {...props}
      className={"bg-blue-600 text-white rounded-lg duration-300 " + buttonSize + " focus:outline-none " + className + (props.disabled ? " opacity-50 cursor-not-allowed" : " ") + " " + type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}