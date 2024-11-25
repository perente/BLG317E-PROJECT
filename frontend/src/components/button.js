export const Button = ({ children, onClick, size="md", className }) => {

  const buttonSize = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];



  return (
    <button
      className={"bg-blue-500 hover:bg-blue-700 text-white rounded-lg duration-300 " + buttonSize+ " focus:outline-none " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}