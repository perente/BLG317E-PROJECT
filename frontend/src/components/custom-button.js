export const CustomButton = ({ children, onClick, size = "md", className, color = "#000", bgLight, icon, ...props }) => {

  const buttonSize = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold",
  }[size];



  return (

    <div
      {...props}
      className={
        "text-white duration-300 cursor-pointer relative " +
        buttonSize +
        " focus:outline-none " +
        className
      }
      style={{
        backgroundColor: color,
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center transform rotate-x-0">
        {children}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center transform rotate-x-90"
        style={{
          backgroundColor: bgLight,
        }}
      >
        {icon}
      </div>
    </div>
  );
}