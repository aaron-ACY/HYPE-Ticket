import React, { useState } from "react";
import { Lock, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

export const PasswordChangeForm: React.FC = () => {
  const { user, changePassword } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isGoogleUserWithoutPassword =
    user?.hasPassword === false ||
    user?.authProvider === "GOOGLE" ||
    (Boolean(user?.email?.endsWith("@gmail.com")) && user?.hasPassword !== true);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Chỉ yêu cầu mật khẩu hiện tại nếu tài khoản đã từng đặt mật khẩu
    if (!isGoogleUserWithoutPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Mật khẩu hiện tại không được để trống";
      }
    }

    if (!newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải từ 6 ký tự trở lên";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await changePassword(isGoogleUserWithoutPassword ? "" : currentPassword, newPassword, confirmPassword);
      showToast(
        isGoogleUserWithoutPassword ? "Thiết lập mật khẩu thành công!" : "Đổi mật khẩu thành công!",
        "success"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Thao tác thất bại", "error");
      setErrors({ currentPassword: err.message || "Thao tác thất bại" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-lg">
      {/* Notice for Google account without password */}
      {isGoogleUserWithoutPassword && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-violet-900/20 to-bg-surface border border-violet-500/30 flex items-start gap-3.5 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 flex-shrink-0 mt-0.5">
            <KeyRound className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wide font-heading">
                Tài khoản đăng nhập Google
              </h5>
              <span className="bg-violet-500/20 border border-violet-400/40 text-violet-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                Tùy chọn
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-semibold mt-1 leading-relaxed">
              Bạn có thể tạo mật khẩu riêng bên dưới để đăng nhập bằng cả <strong>Google</strong> lẫn <strong>Email & Mật khẩu</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Current Password input (Chỉ hiển thị khi tài khoản đã có mật khẩu) */}
        {!isGoogleUserWithoutPassword && (
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
            error={errors.currentPassword}
          />
        )}

        {/* New Password input */}
        <Input
          label={isGoogleUserWithoutPassword ? "Mật khẩu mới muốn tạo" : "Mật khẩu mới"}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
          leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          error={errors.newPassword}
        />

        {/* Confirm Password input */}
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Xác nhận lại mật khẩu mới"
          leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          error={errors.confirmPassword}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        isLoading={isLoading}
        className="px-6 py-2.5 font-bold uppercase tracking-wider text-xs font-heading"
        rightIcon={isGoogleUserWithoutPassword ? <Sparkles className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
      >
        {isGoogleUserWithoutPassword ? "Thiết lập mật khẩu" : "Đổi mật khẩu"}
      </Button>
    </form>
  );
};
