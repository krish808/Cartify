import { Navbar, Container } from "../components";

export default function AppLayout({
  children,
  user,
  totalItems,
  onSearch,
  onLogout,
  onNavigate,
}) {
  return (
    <div>
      <Navbar
        user={user}
        totalItems={totalItems}
        onLogout={onLogout}
        onNavigate={onNavigate}
        onSearch={onSearch}
      />
      <main className="py-8">{children}</main>
    </div>
  );
}
