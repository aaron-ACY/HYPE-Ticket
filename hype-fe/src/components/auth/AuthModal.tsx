import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Phone, LogIn, Sparkles } from "lucide-react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = "login",
}) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or tab changes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegPassword("");
    setErrors({});
    setIsLoading(false);
  }, [isOpen, activeTab]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email không được để trống";
    if (!password.trim()) newErrors.password = "Mật khẩu không được để trống";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      setIsLoading(false);
      showToast("Đăng nhập thành công!", "success");
      onClose();
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!regName.trim()) newErrors.name = "Họ tên không được để trống";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(regEmail.trim())) {
      newErrors.email = "Email không đúng định dạng";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!regPhone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(regPhone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    if (!regPassword.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (regPassword.length < 6) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    }

    if (!agreeTerms) {
      showToast("Vui lòng đồng ý với điều khoản dịch vụ", "warning");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(regName.trim(), regEmail.trim(), regPhone.trim(), regPassword);
      setIsLoading(false);
      showToast("Đăng ký tài khoản thành công!", "success");
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.message || "Đăng ký thất bại";
      showToast(errMsg, "error");
      setErrors({ email: errMsg });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={activeTab === "login" ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Simple Tab Toggles */}
        <div className="flex border-b border-white/5 pb-2 gap-2 select-none">
          <button
            onClick={() => setActiveTab("login")}
            className={`pb-2.5 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all font-heading cursor-pointer ${
              activeTab === "login"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-2.5 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all font-heading cursor-pointer ${
              activeTab === "register"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-zinc-550 hover:text-zinc-300"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {activeTab === "login" ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email đăng nhập"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-zinc-550" />}
            />
            
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4 text-zinc-550" />}
            />

            <div className="flex items-center justify-between text-xs font-semibold select-none pt-1">
              <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary bg-bg-main border-white/10 focus:ring-brand-primary/45 focus:ring-1 accent-brand-primary cursor-pointer"
                />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-brand-primary hover:underline font-bold">Quên mật khẩu?</a>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2 py-3.5 font-bold uppercase tracking-wider text-xs font-heading"
              rightIcon={<LogIn className="w-4 h-4" />}
            >
              Đăng nhập
            </Button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              error={errors.name}
              leftIcon={<UserIcon className="w-4 h-4 text-zinc-550" />}
            />

            <Input
              label="Email nhận vé"
              type="email"
              placeholder="example@gmail.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-zinc-550" />}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="Số điện thoại liên hệ"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4 text-zinc-550" />}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4 text-zinc-550" />}
            />

            <div className="pt-1 select-none">
              <label className="flex items-start gap-2.5 text-xs text-zinc-450 cursor-pointer font-semibold leading-relaxed">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary bg-bg-main border-white/10 focus:ring-brand-primary/45 focus:ring-1 accent-brand-primary cursor-pointer mt-0.5"
                />
                <span>
                  Tôi đồng ý với các{" "}
                  <Link
                    to="/policies"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-brand-primary hover:text-white underline underline-offset-2 font-bold transition-colors"
                  >
                    điều khoản bảo mật và chính sách
                  </Link>{" "}
                  bán vé sự kiện.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2 py-3.5 font-bold uppercase tracking-wider text-xs font-heading"
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Đăng ký tài khoản
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-heading">Hoặc tiếp tục với</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google Auth Button */}
        <GoogleLoginButton
          onSuccess={onClose}
          text={activeTab === "login" ? "Đăng nhập với Google" : "Đăng ký với Google"}
        />
      </div>
    </Modal>
  );
};
