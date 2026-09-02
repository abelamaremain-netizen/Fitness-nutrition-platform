// Override the parent admin layout for the login page
// so the sidebar doesn't appear before the user is authenticated
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
