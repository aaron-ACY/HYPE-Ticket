import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogOut, Ticket, Settings, Menu, Calendar, Compass, Grid, MapPin, ChevronDown, Building2, Plus, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";
import { categories } from "../../data/categories";
import * as LucideIcons from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
  onAuthClick?: (tab: "login" | "register") => void;
}

const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onAuthClick }) => {
  const { user, logout, isAuthenticated, isOrganizer, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"category" | "location" | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 glass-navbar h-[76px] flex items-center px-4 sm:px-6 lg:px-12 transition-all">
      <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between gap-6">
        {/* Left: Hamburger menu for mobile & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-zinc-400 hover:text-[#D946EF] rounded-lg lg:hidden transition-colors"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-gradient-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <rect x="15" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-nav)" />
                <rect x="71" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-nav)" />
                <rect x="29" y="47" width="42" height="6" rx="1.5" fill="url(#logo-gradient-nav)" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white hidden sm:block font-heading uppercase">
              HYPE<span className="text-brand-primary">TICKET</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop only) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-400 select-none">
          <Link to="/events" className="hover:text-white flex items-center gap-1.5 transition-colors font-heading uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-zinc-550" />
            Sự kiện
          </Link>
          <Link to="/stories" className="hover:text-white flex items-center gap-1.5 transition-colors font-heading uppercase tracking-wide">
            <Compass className="w-4 h-4 text-zinc-550" />
            Khám phá
          </Link>
          
          {/* Thể loại dropdown */}
          <div 
            className="relative py-4"
            onMouseEnter={() => setActiveDropdown("category")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="hover:text-white flex items-center gap-1 transition-colors font-heading uppercase tracking-wide cursor-pointer focus:outline-none">
              <Grid className="w-4 h-4 text-zinc-550" />
              Thể loại
              <ChevronDown className="w-3.5 h-3.5 text-zinc-550 group-hover:text-white transition-transform duration-200" />
            </button>
            
            {activeDropdown === "category" && (
              <div className="absolute top-[80%] left-[-80px] w-[540px] bg-[#0B0B0F] border border-[#24242B] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 z-50 grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-top-1.5 duration-200">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/events?category=${cat.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-transparent hover:bg-[#181824] border border-transparent hover:border-[#2C2C3A] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#121217] border border-[#202028] flex items-center justify-center text-[#85858D] group-hover:text-white group-hover:bg-white/10 group-hover:border-white/25 transition-all duration-200 shrink-0">
                      <CategoryIcon name={cat.iconName} className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#F5F5F5] leading-none font-heading uppercase tracking-wide group-hover:text-white transition-colors">
                        {cat.name.split(" / ")[0]}
                      </p>
                      <p className="text-[10px] text-[#85858D] font-medium mt-1.5 leading-none group-hover:text-[#CBD5E1] transition-colors">
                        {cat.name.split(" / ")[1] || "Sự kiện hấp dẫn"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Địa điểm dropdown */}
          <div 
            className="relative py-4"
            onMouseEnter={() => setActiveDropdown("location")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="hover:text-white flex items-center gap-1 transition-colors font-heading uppercase tracking-wide cursor-pointer focus:outline-none">
              <MapPin className="w-4 h-4 text-zinc-550" />
              Địa điểm
              <ChevronDown className="w-3.5 h-3.5 text-zinc-550 group-hover:text-white transition-transform duration-200" />
            </button>
            
            {activeDropdown === "location" && (
              <div className="absolute top-[80%] left-0 w-52 bg-[#0B0B0F] border border-[#24242B] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-2 z-50 flex flex-col gap-1 mt-2 animate-in fade-in slide-in-from-top-1.5 duration-200">
                {[
                  { value: "", label: "Tất cả địa điểm" },
                  { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
                  { value: "Hà Nội", label: "Hà Nội" },
                  { value: "Đà Nẵng", label: "Đà Nẵng" }
                ].map((loc) => (
                  <Link
                    key={loc.value}
                    to={loc.value ? `/events?location=${encodeURIComponent(loc.value)}` : "/events"}
                    onClick={() => setActiveDropdown(null)}
                    className="w-full text-left text-xs font-bold font-heading uppercase tracking-wider text-[#85858D] hover:text-[#F5F5F5] hover:bg-[#15151D] hover:border-[#282834] border border-transparent px-3.5 py-2.5 rounded-xl transition-all"
                  >
                    {loc.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Search & User controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64 xl:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, nghệ sĩ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all rounded-full pl-4 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/30"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Organizer / Create Event Action Button */}
          {isOrganizer ? (
            <Link to="/organizer/dashboard" className="hidden sm:inline-flex flex-shrink-0">
              <button className="h-10 px-4 rounded-full bg-gradient-to-r from-violet-600/20 via-[#FF176B]/15 to-[#00F0FF]/10 hover:from-violet-600/30 hover:to-[#FF176B]/25 border border-violet-500/35 hover:border-violet-400 text-violet-200 hover:text-white text-xs font-extrabold font-heading uppercase tracking-wider transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer">
                <Building2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Kênh Tổ Chức</span>
              </button>
            </Link>
          ) : (
            <Link to="/become-organizer" className="hidden sm:inline-flex flex-shrink-0">
              <button className="h-10 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white text-xs font-extrabold font-heading uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer group">
                <Plus className="w-3.5 h-3.5 text-brand-primary group-hover:scale-110 transition-transform" />
                <span>Tạo sự kiện</span>
              </button>
            </Link>
          )}

          {/* User Auth display */}
          {isAuthenticated && user ? (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 flex items-center gap-2.5 p-1 pr-3 rounded-full border border-white/10 hover:border-white/20 bg-bg-surface hover:bg-white/[0.03] focus:outline-none transition-all cursor-pointer whitespace-nowrap"
              >
                {avatarError ? (
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-extrabold text-xs select-none border border-white/10">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    onError={() => setAvatarError(true)}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                )}
                <span className="text-xs font-bold text-zinc-300 hidden md:inline max-w-[110px] truncate font-heading">
                  {user.name}
                </span>
              </button>

              {/* Redesigned User Dropdown Panel */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 bg-bg-surface border border-white/5 rounded-2xl shadow-2xl p-2 z-20 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3.5 py-3 border-b border-white/5 mb-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Tài khoản</p>
                        {isAdmin ? (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md">
                            Admin
                          </span>
                        ) : isOrganizer ? (
                          <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md">
                            Organizer
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm font-extrabold text-white truncate font-heading mt-0.5">{user.name}</p>
                      <p className="text-xs text-zinc-450 truncate mt-0.5">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-950/40 border border-rose-500/20 bg-rose-500/10 rounded-xl transition-all uppercase tracking-wider text-left mb-1"
                      >
                        <Shield className="w-4 h-4 text-rose-400" />
                        Master Admin Portal
                      </Link>
                    )}

                    {isOrganizer ? (
                      <Link
                        to="/organizer/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-violet-300 hover:text-white hover:bg-violet-950/40 border border-violet-500/20 bg-violet-500/10 rounded-xl transition-all uppercase tracking-wider text-left mb-1"
                      >
                        <Building2 className="w-4 h-4 text-[#00F0FF]" />
                        Kênh Người Tổ Chức
                      </Link>
                    ) : (
                      <Link
                        to="/become-organizer"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-wider text-left mb-1"
                      >
                        <Building2 className="w-4 h-4 text-brand-primary" />
                        Đăng ký Ban tổ chức
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-wider text-left"
                    >
                      <Settings className="w-4 h-4 text-zinc-500" />
                      Hồ sơ cá nhân
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-wider text-left"
                    >
                      <Ticket className="w-4 h-4 text-zinc-500" />
                      Vé của tôi
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-all font-bold w-full text-left mt-1 border-t border-white/5 pt-2.5 uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-455 font-heading select-none whitespace-nowrap">
              <button
                onClick={() => onAuthClick?.("login")}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                Đăng nhập
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={() => onAuthClick?.("register")}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
