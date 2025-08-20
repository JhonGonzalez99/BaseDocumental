import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="h-full bg-background flex-1">
        <Outlet />
      </main>
    </div>
  );
};
