import React from "react";

const Badge = ({ type = "default", children }) => {
  const baseStyles = "inline-block px-3 py-1 rounded text-sm font-medium";

  const typeStyles = {
    success: "bg-green-100 text-green-800 border border-green-200",
    error: "bg-red-100 text-red-800 border border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    alert: "bg-orange-100 text-orange-800 border border-orange-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    default: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const styles = `${baseStyles} ${typeStyles[type] || typeStyles.default}`;

  return <span className={styles}>{children}</span>;
};

export default Badge;
