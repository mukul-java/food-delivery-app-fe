import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
    setDesktopSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: ROUTES.LOGIN });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="flex min-h-dvh w-full bg-muted/30">
        {desktopSidebarOpen && (
          <div className="hidden md:block shrink-0">
            <Sidebar />
          </div>
        )}

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onOpenSidebar={handleToggleSidebar} />
          <main
            id="main-content"
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
          >
            <Breadcrumbs />
            <Outlet />
          </main>
          <Footer />
        </div>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}

