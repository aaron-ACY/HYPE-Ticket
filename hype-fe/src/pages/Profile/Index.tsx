import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, Ticket, LogOut, ShieldAlert, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ProfileEditForm } from "../../components/user/ProfileEditForm";
import { PasswordChangeForm } from "../../components/user/PasswordChangeForm";
import { Button } from "../../components/common/Button";
import { PhoneUpdateBanner } from "../../components/common/PhoneUpdateBanner";

export const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Safe Guard Route
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center gap-6 bg-bg-main min-h-[70vh] justify-center">
        <div className="w-14 h-14 bg-brand-primary/15 border border-brand-primary/30 rounded-full flex items-center justify-center text-brand-primary shadow-lg shadow-pink-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white leading-none font-heading uppercase tracking-wide">Chưa Đăng Nhập</h2>
        <p className="text-sm text-zinc-500 max-w-xs leading-relaxed font-semibold">
          Vui lòng đăng nhập tài khoản để xem chi tiết hồ sơ cá nhân và quản lý vé.
        </p>
        <Link to="/login" className="w-full">
          <Button variant="gradient" fullWidth className="font-heading uppercase text-xs tracking-wider font-bold py-3">Đăng nhập ngay</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 text-left bg-bg-main">
      <div className="pb-6 border-b border-white/5 mb-8">
        <h1 className="text-3xl sm:text-4.5xl font-black text-white uppercase tracking-tight font-heading">Hồ Sơ Cá Nhân</h1>
        <p className="text-sm text-zinc-500 font-semibold mt-1">Quản lý thông tin tài khoản và xem vé sự kiện đã đặt</p>
      </div>

      <PhoneUpdateBanner className="mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Avatar card */}
        <div className="lg:col-span-4 bg-bg-surface border border-white/5 rounded-3xl p-6.5 text-center space-y-6 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-lg bg-zinc-950">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white leading-tight font-heading">{user.name}</h3>
              <p className="text-xs text-zinc-500 mt-1.5 font-bold font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-5 border-t border-white/5">
            <Link to="/orders">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Ticket className="w-4 h-4 text-zinc-500" />}
                className="py-3 justify-start text-zinc-300 border-white/10 bg-bg-surface hover:bg-white/5 font-heading uppercase text-xs tracking-wider font-bold"
              >
                Lịch sử đặt vé
              </Button>
            </Link>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              fullWidth
              leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
              className="py-3 justify-start text-rose-400 border-white/10 hover:bg-rose-950/20 hover:border-transparent font-heading uppercase text-xs tracking-wider font-bold"
            >
              Đăng xuất tài khoản
            </Button>
          </div>
        </div>

        {/* Right column: Edit forms */}
        <div className="lg:col-span-8 bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Profile Edit Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white tracking-wider flex items-center gap-2.5 font-heading uppercase">
              <UserIcon className="w-5 h-5 text-brand-primary" />
              Cập Nhật Thông Tin Tài Khoản
            </h3>
            <p className="text-xs text-zinc-500 leading-none">Thông tin này sẽ tự động điền vào hóa đơn khi bạn mua vé mới.</p>
            
            <div className="pt-2 border-t border-white/5">
              <ProfileEditForm />
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Change Password Section */}
          <div className="space-y-6">
            {(() => {
              const isGoogleWithoutPassword =
                user?.hasPassword === false ||
                user?.authProvider === "GOOGLE" ||
                (Boolean(user?.email?.endsWith("@gmail.com")) && user?.hasPassword !== true);
              return (
                <>
                  <h3 className="font-bold text-lg text-white tracking-wider flex items-center gap-2.5 font-heading uppercase">
                    <Lock className="w-5 h-5 text-brand-primary" />
                    {isGoogleWithoutPassword ? "Thiết Lập Mật Khẩu" : "Thay Đổi Mật Khẩu"}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-none">
                    {isGoogleWithoutPassword
                      ? "Tạo mật khẩu giúp bạn có thể đăng nhập bằng email & mật khẩu bên cạnh tài khoản Google."
                      : "Mật khẩu mới phải có độ dài ít nhất 6 ký tự để bảo mật tài khoản."}
                  </p>
                </>
              );
            })()}
            
            <div className="pt-2 border-t border-white/5">
              <PasswordChangeForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
