import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Search, Compass, Calendar, Grid, Ticket, User, LogOut, LogIn, ChevronDown, ChevronUp, MapPin, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";
import { categories } from "../../data/categories";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: (tab: "login" | "register") => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ isOpen, onClose, onAuthClick }) => {
  const { user, logout, isAuthenticated, isOrganizer } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isLocationsExpanded, setIsLocationsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-y-0 left-0 w-full max-w-xs bg-bg-main border-r border-white/5 flex flex-col p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
              <Link to="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logo-gradient-mob" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D946EF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <rect x="15" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-mob)" />
                    <rect x="71" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-mob)" />
                    <rect x="29" y="47" width="42" height="6" rx="1.5" fill="url(#logo-gradient-mob)" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg text-white font-heading uppercase tracking-tight">
                  HYPE<span className="text-brand-primary">TICKET</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D946EF]/50 transition-colors"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-zinc-400 hover:text-[#D946EF]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-3 flex-grow text-xs font-bold text-zinc-400 font-heading uppercase tracking-wider">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left"
              >
                <Compass className="w-4.5 h-4.5 text-zinc-500" />
                Trang chủ
              </Link>
              <Link
                to="/events"
                onClick={onClose}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left"
              >
                <Calendar className="w-4.5 h-4.5 text-zinc-500" />
                Tất cả Sự kiện
              </Link>
              <Link
                to="/stories"
                onClick={onClose}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left"
              >
                <Compass className="w-4.5 h-4.5 text-[#FF176B]" />
                Khám phá & Tạp chí
              </Link>

              {/* Thể loại collapsible */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left w-full cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-4.5 h-4.5 text-zinc-500" />
                    Thể loại
                  </div>
                  {isCategoriesExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {isCategoriesExpanded && (
                  <div className="pl-8 pr-3 py-1.5 flex flex-col gap-1.5 border-l border-white/5 ml-5.5 my-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/events?category=${cat.slug}`}
                        onClick={onClose}
                        className="text-left text-[11px] font-bold text-zinc-500 hover:text-white py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all uppercase tracking-wider"
                      >
                        {cat.name.split(" / ")[0]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Địa điểm collapsible */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left w-full cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4.5 h-4.5 text-zinc-500" />
                    Địa điểm
                  </div>
                  {isLocationsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-550" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-550" />
                  )}
                </button>

                {isLocationsExpanded && (
                  <div className="pl-8 pr-3 py-1.5 flex flex-col gap-1.5 border-l border-white/5 ml-5.5 my-1.5">
                    {[
                      { value: "", label: "Tất cả địa điểm" },
                      { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
                      { value: "Hà Nội", label: "Hà Nội" },
                      { value: "Đà Nẵng", label: "Đà Nẵng" }
                    ].map((loc) => (
                      <Link
                        key={loc.value}
                        to={loc.value ? `/events?location=${encodeURIComponent(loc.value)}` : "/events"}
                        onClick={onClose}
                        className="text-left text-[11px] font-bold text-zinc-500 hover:text-white py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all uppercase tracking-wider"
                      >
                        {loc.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Organizer Link */}
              {isOrganizer ? (
                <Link
                  to="/organizer/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:text-white transition-all text-left"
                >
                  <Building2 className="w-4.5 h-4.5 text-[#00F0FF]" />
                  Kênh Người Tổ Chức
                </Link>
              ) : (
                <Link
                  to="/become-organizer"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white transition-all text-left"
                >
                  <Building2 className="w-4.5 h-4.5 text-brand-primary" />
                  Đăng ký Ban tổ chức
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left"
                  >
                    <Ticket className="w-4.5 h-4.5 text-zinc-500" />
                    Vé của tôi
                  </Link>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left"
                  >
                    <User className="w-4.5 h-4.5 text-zinc-500" />
                    Thông tin tài khoản
                  </Link>
                </>
              )}
            </nav>

            {/* Footer / Account section in drawer */}
            <div className="pt-6 border-t border-white/5 mt-auto">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/5"
                    />
                    <div className="overflow-hidden text-left">
                      <p className="font-extrabold text-white text-sm truncate font-heading">{user.name}</p>
                      <p className="text-zinc-500 text-xs truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<LogOut className="w-4 h-4" />}
                    className="border-white/10 hover:bg-rose-950/20 text-rose-400 font-bold"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<LogIn className="w-4 h-4" />}
                    onClick={() => {
                      onAuthClick?.("login");
                      onClose();
                    }}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      onAuthClick?.("register");
                      onClose();
                    }}
                  >
                    Đăng ký ngay
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
