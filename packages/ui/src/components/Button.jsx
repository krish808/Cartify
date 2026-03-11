export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-gray-300 hover:bg-gray-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition cursor-pointer ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
