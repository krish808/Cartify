export default function Section({ children, className = "" }) {
  return <section className={`py-6 ${className}`}>{children}</section>;
}
