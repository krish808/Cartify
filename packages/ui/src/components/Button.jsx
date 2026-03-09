export default function Button({ children, variant = "primary" }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
  };

  return (
    <button className={`px-4 py-2 rounded ${styles[variant]}`}>
      {children}
    </button>
  );
}
