import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User as UserIcon, Mail, Phone, Lock, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Họ tên không được để trống";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không trùng khớp";
    }

    if (!agreeTerms) {
      showToast("Vui lòng đồng ý với Điều khoản dịch vụ", "warning");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), phone.trim(), password);
      setIsLoading(false);
      showToast("Đăng ký tài khoản thành công!", "success");
      navigate(redirectUrl);
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.message || "Đăng ký thất bại";
      showToast(errMsg, "error");
      setErrors({ email: errMsg });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left flex flex-col justify-center min-h-[85vh] bg-bg-main">
      <div className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/85 flex flex-col gap-6">
        {/* Title */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight font-heading">
            {redirectUrl !== "/" ? "Tạo Tài Khoản Để Tiếp Tục" : "Tạo Tài Khoản Mới"}
          </h1>
          <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
            {redirectUrl !== "/" 
              ? "Vui lòng tạo tài khoản để nhận vé điện tử chính chủ và tiếp tục đặt vé" 
              : "Bắt đầu trải nghiệm mua vé các sự kiện cực hot"}
          </p>
        </div>

        {/* Form fields */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Họ và tên"
            type="text"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leftIcon={<UserIcon className="w-4 h-4 text-zinc-500" />}
          />

          <Input
            label="Email nhận vé"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
          />

          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="Số điện thoại cá nhân"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            leftIcon={<Phone className="w-4 h-4 text-zinc-500" />}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          />

          <div className="flex items-start gap-2.5 text-xs font-bold select-none pt-1">
            <input
              type="checkbox"
              id="agree_terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-brand-primary bg-zinc-950 border-white/10 focus:ring-brand-primary/45 focus:ring-1 accent-brand-primary cursor-pointer flex-shrink-0"
            />
            <label htmlFor="agree_terms" className="text-zinc-450 cursor-pointer leading-tight">
              Tôi đồng ý với{" "}
              <Link to="/policies?tab=terms" target="_blank" className="text-brand-primary hover:underline">Điều khoản dịch vụ</Link>
              {" "}và{" "}
              <Link to="/policies?tab=privacy" target="_blank" className="text-brand-primary hover:underline">Chính sách bảo mật</Link>
              {" "}của Hype Ticket.
            </label>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2 py-3 font-bold"
            rightIcon={<UserPlus className="w-4.5 h-4.5" />}
          >
            Đăng ký tài khoản
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Hoặc tiếp tục với</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google Auth Button */}
        <GoogleLoginButton
          onSuccess={() => navigate(redirectUrl)}
          text="Đăng ký nhanh với Google"
        />

        {/* Link back to login */}
        <p className="text-xs text-zinc-500 font-semibold text-center select-none pt-1">
          Đã có tài khoản?{" "}
          <Link 
            to={redirectUrl !== "/" ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} 
            className="text-brand-primary hover:underline inline-flex items-center gap-0.5"
          >
            Đăng nhập ngay
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
