import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  DollarSign,
  BadgeCheck,
  Settings,
  ArrowLeft,
  LogOut,
  Building2,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";

interface OrganizerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children, title, subtitle }) => {
  const { user, isOrganizer, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsed Sidebar state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("organizer_sidebar_collapsed") === "true";
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("organizer_sidebar_collapsed", String(next));
      return next;
    });
  };

  const navItems = [
    {
      name: "Tổng Quan",
      path: "/organizer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Quản Lý Sự Kiện",
      path: "/organizer/events",
      icon: Calendar,
      badge: "3",
    },
    {
      name: "Vé & Check-in QR",
      path: "/organizer/tickets",
      icon: Ticket,
    },
    {
      name: "Doanh Thu & Đối Soát",
      path: "/organizer/revenue",
      icon: DollarSign,
    },
    {
      name: "Nâng Hạng Tích Xanh",
      path: "/organizer/blue-tick",
      icon: BadgeCheck,
      highlight: true,
    },
    {
      name: "Cấu Hình Tổ Chức",
      path: "/organizer/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Guard: If not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-left">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/80 space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase font-heading">Yêu Cầu Đăng Nhập</h2>
            <p className="text-xs text-slate-500 font-semibold">
              Vui lòng đăng nhập tài khoản Ban tổ chức để truy cập Kênh Quản Trị.
            </p>
          </div>
          <Link to="/login" className="block">
            <Button variant="gradient" fullWidth className="font-heading uppercase text-xs tracking-wider font-extrabold py-3.5">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Guard: If not yet approved as Organizer
  if (!isOrganizer) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-left">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-amber-200 space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 uppercase font-heading">Chưa Có Quyền Ban Tổ Chức</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Tài khoản của bạn chưa được cấp quyền Ban tổ chức hoặc đang trong quá trình thẩm định KYC (48H).
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link to="/become-organizer" className="block">
              <Button variant="gradient" fullWidth className="font-heading uppercase text-xs tracking-wider font-extrabold py-3.5">
                Kiểm tra tiến trình / Đăng ký
              </Button>
            </Link>
            <Link to="/" className="block text-xs text-slate-500 hover:text-slate-900 font-semibold">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row text-left font-sans antialiased">
      {/* Sidebar - Matching Admin Light Theme */}
      <aside
        className={`bg-white border-r border-slate-200/80 flex flex-col flex-shrink-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-full md:w-20" : "w-full md:w-64"
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-slate-100 flex items-center transition-all ${
            isCollapsed ? "justify-center" : "px-5"
          }`}
        >
          <Link
            to="/organizer/dashboard"
            className="flex items-center gap-3 group overflow-hidden"
            title="HYPEORGANIZER Partner Portal"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white transition-transform group-hover:scale-105 flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-heading uppercase block leading-none">
                  HYPE<span className="text-indigo-600">ORGANIZER</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                  Partner Portal
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className={`p-3 space-y-1.5 flex-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {!isCollapsed ? (
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading whitespace-nowrap">
              Kênh quản trị sự kiện
            </div>
          ) : (
            <div className="h-2" />
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
                className={`transition-all ${
                  isCollapsed
                    ? "w-11 h-11 rounded-xl flex items-center justify-center relative mx-auto"
                    : "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold w-full"
                } ${
                  isActive
                    ? "bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-sm"
                    : item.highlight
                    ? "text-cyan-700 hover:bg-cyan-50/70 border border-transparent"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center relative" : "gap-3"}`}>
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-indigo-600" : item.highlight ? "text-cyan-600" : "text-slate-500"
                    }`}
                  />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 w-full">
            <Link
              to="/"
              title="Xem sàn vé khán giả"
              className={`transition-all ${
                isCollapsed
                  ? "w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-50 mx-auto"
                  : "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 w-full"
              }`}
            >
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-slate-400 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Xem sàn vé khán giả</span>}
              </div>
              {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          </div>
        </nav>

        {/* Sidebar Bottom: Organizer Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3 py-1">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || "Organizer")}`}
                alt="Organizer"
                title={user?.name || "Ban Tổ Chức"}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || "Organizer")}`}
                  alt="Organizer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate font-heading">
                    {user?.name || "Ban Tổ Chức"}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                    Official Organizer
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer flex-shrink-0"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Topbar with Collapse Toggle */}
        <header className="h-16 border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 bg-white sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer"
              title={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4.5 h-4.5" />
              ) : (
                <PanelLeftClose className="w-4.5 h-4.5" />
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">Kênh Đối Tác</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold font-heading">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/organizer/events">
              <Button
                variant="primary"
                size="sm"
                className="font-heading uppercase text-xs tracking-wider font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm py-2"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Tạo sự kiện mới
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-8 flex-1 w-full space-y-8">{children}</div>
      </main>
    </div>
  );
};
