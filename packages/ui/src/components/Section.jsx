export default function Section({ children, className = "" }) {
  return <section className={`py-2 ${className}`}>{children}</section>;
}
