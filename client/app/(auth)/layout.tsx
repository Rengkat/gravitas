import AuthNav from "./Components/AuthNav";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AuthNav />
      {children}
    </div>
  );
}
