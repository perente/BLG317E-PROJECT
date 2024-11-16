export const Button = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-xl duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}