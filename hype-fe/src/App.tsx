import React, { useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { Navbar } from "./components/layout/Navbar";
import { MobileNavbar } from "./components/layout/MobileNavbar";
import { Footer } from "./components/layout/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { AppRoutes } from "./routes/AppRoutes";

const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const location = useLocation();

  const isPortalRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/organizer");

  const openAuth = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isPortalRoute ? "bg-[#F8FAFC] text-slate-900" : "bg-bg-main text-[#F3F4F6]"}`}>
      {/* Header / Navbar - Chỉ hiển thị trên website người dùng */}
      {!isPortalRoute && (
        <Navbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onAuthClick={openAuth}
        />
      )}
      
      {/* Mobile Navigation Drawer */}
      {!isPortalRoute && (
        <MobileNavbar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onAuthClick={openAuth}
        />
      )}

      {/* Global Authentication Popup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* Main Application Routes */}
      <main className="flex-grow">
        <AppRoutes />
      </main>

      {/* Footer - Chỉ hiển thị trên website người dùng */}
      {!isPortalRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
