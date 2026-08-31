import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    }
    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      setIsLoading(false);
      showToast("Đăng nhập thành công!", "success");
      navigate(redirectUrl);
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.message || "Đăng nhập thất bại";
      showToast(errMsg, "error");
      if (errMsg.includes("Mật khẩu")) {
        setErrors({ password: errMsg });
      } else {
        setErrors({ email: errMsg });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left flex flex-col justify-center min-h-[75vh] bg-bg-main">
      <div className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/85 flex flex-col gap-6">
        {/* Title */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight font-heading">
            {redirectUrl !== "/" ? "Đăng Nhập Để Tiếp Tục" : "Chào Mừng Quay Lại"}
          </h1>
          <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
            {redirectUrl !== "/" 
              ? "Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục đặt vé sự kiện" 
              : "Đăng nhập tài khoản Hype Ticket để tiếp tục trải nghiệm"}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email đăng nhập"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4 text-zinc-500" />}
          />

          <div className="flex items-center justify-between text-xs font-bold select-none pt-1">
            <label className="flex items-center gap-2 text-zinc-450 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary bg-zinc-950 border-white/10 focus:ring-brand-primary/45 focus:ring-1 accent-brand-primary cursor-pointer"
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="text-brand-primary hover:underline">Quên mật khẩu?</a>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2 py-3 font-bold"
            rightIcon={<LogIn className="w-4.5 h-4.5" />}
          >
            Đăng nhập
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Hoặc tiếp tục với</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google Auth Button */}
        <GoogleLoginButton
          onSuccess={() => navigate(redirectUrl)}
          text="Tiếp tục với Google"
        />

        {/* Link back to Register */}
        <p className="text-xs text-zinc-500 font-semibold text-center select-none pt-1">
          Chưa có tài khoản?{" "}
          <Link 
            to={redirectUrl !== "/" ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} 
            className="text-brand-primary hover:underline inline-flex items-center gap-0.5"
          >
            Đăng ký ngay
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
