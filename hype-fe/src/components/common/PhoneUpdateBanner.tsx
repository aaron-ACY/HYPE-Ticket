import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PhoneCall, ShieldCheck, ArrowRight, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "./Button";
import { Input } from "./Input";

interface PhoneUpdateBannerProps {
  className?: string;
  allowQuickUpdate?: boolean;
}

export const PhoneUpdateBanner: React.FC<PhoneUpdateBannerProps> = ({
  className = "",
  allowQuickUpdate = true,
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isUpdating, setIsUpdating] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Chỉ hiển thị khi đã đăng nhập và chưa có số điện thoại
  if (!user || (user.phone && user.phone.trim() !== "") || isDismissed) {
    return null;
  }

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phoneInput.trim().replace(/\s/g, "");

    if (!cleanPhone) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      showToast("Số điện thoại phải gồm đúng 10 chữ số", "error");
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(user.name, cleanPhone, user.avatar);
      showToast("Đã cập nhật số điện thoại thành công!", "success");
      setShowQuickForm(false);
    } catch (err: any) {
      showToast(err.message || "Cập nhật số điện thoại thất bại", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/45 via-emerald-900/20 to-teal-950/30 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 ${className}`}
    >
      {/* Decorative Emerald Glow Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon & Text */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/15">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wide font-heading flex items-center gap-1.5">
                Cập nhật số điện thoại nhận vé
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Xác thực SMS
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-semibold mt-1 leading-relaxed max-w-xl">
              Tài khoản của bạn chưa có số điện thoại. Hãy bổ sung ngay để nhận mã vé SMS và hỗ trợ check-in sự kiện thuận tiện nhất.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
          {allowQuickUpdate && !showQuickForm ? (
            <button
              type="button"
              onClick={() => setShowQuickForm(true)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold font-heading uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Cập nhật ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link to="/profile">
              <button
                type="button"
                className="py-2.5 px-4 rounded-xl text-xs font-bold font-heading uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Vào Hồ sơ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Phone Input Inline Form */}
      {showQuickForm && (
        <form
          onSubmit={handleSavePhone}
          className="mt-4 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="w-full sm:max-w-xs">
            <Input
              type="tel"
              placeholder="Nhập số điện thoại (vd: 0901234567)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="bg-bg-void/80 border-emerald-500/30 text-white placeholder:text-zinc-500 focus:border-emerald-400 text-xs py-2"
              leftIcon={<PhoneCall className="w-3.5 h-3.5 text-emerald-400" />}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isUpdating}
              className="py-2.5 px-4 rounded-xl text-xs font-bold font-heading uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Lưu số điện thoại</span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickForm(false)}
              className="text-xs text-zinc-400 hover:text-white py-2 cursor-pointer"
            >
              Hủy
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
