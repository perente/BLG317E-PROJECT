export const Button = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white  font-bold px-4 py-2 rounded-lg duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}