import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Globe,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BadgeCheck,
  RefreshCw,
  Radio,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

interface ProfileStatusData {
  id?: number;
  organizationName?: string;
  taxCode?: string;
  businessEmail?: string;
  phone?: string;
  websiteUrl?: string;
  description?: string;
  isVerified?: boolean;
  hasBlueTick?: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  createdAt?: string;
}

export const BecomeOrganizer: React.FC = () => {
  const { user, isAuthenticated, isOrganizer, registerOrganizer, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [applicationStatus, setApplicationStatus] = useState<ProfileStatusData | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReapplying, setIsReapplying] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [businessEmail, setBusinessEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      if (!businessEmail) setBusinessEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Fetch current submission status from API
  const fetchStatus = useCallback(async (showManualToast = false) => {
    const token = localStorage.getItem("hype_ticket_token");
    if (!token || !isAuthenticated) {
      setIsCheckingStatus(false);
      return;
    }

    if (showManualToast) setIsSyncing(true);

    try {
      // Chỉ gọi API trạng thái đơn đăng ký Organizer
      const res = await fetch("http://localhost:8080/hype/api/v1/organizer/my-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          setApplicationStatus(data);
          if (data.organizationName) setOrganizationName(data.organizationName);
          if (data.taxCode) setTaxCode(data.taxCode);
          if (data.businessEmail) setBusinessEmail(data.businessEmail);
          if (data.phone) setPhone(data.phone);
          if (data.websiteUrl) setWebsiteUrl(data.websiteUrl);
          if (data.description) setDescription(data.description);

          // Nếu đơn đã được duyệt hoặc cấp role, đồng bộ lại auth context một lần duy nhất
          if ((data.status === "APPROVED" || data.isVerified) && !isOrganizer) {
            refreshUser();
          }

          if (showManualToast) {
            showToast("Đã đồng bộ trạng thái mới nhất từ hệ thống!", "success");
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch organizer status:", e);
    } finally {
      setIsCheckingStatus(false);
      setIsSyncing(false);
    }
  }, [isAuthenticated, isOrganizer, refreshUser, showToast]);

  // Initial fetch on mount & event listeners (không tạo vòng lặp)
  useEffect(() => {
    fetchStatus();

    // 1. Lắng nghe custom events phát ra từ Admin
    const handleLiveUpdate = () => {
      fetchStatus();
    };

    // 2. Lắng nghe khi người dùng chuyển lại tab (Window Focus)
    const handleFocus = () => {
      fetchStatus();
    };

    window.addEventListener("hype_organizer_status_updated", handleLiveUpdate);
    window.addEventListener("hype_auth_refresh", handleLiveUpdate);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("hype_organizer_status_updated", handleLiveUpdate);
      window.removeEventListener("hype_auth_refresh", handleLiveUpdate);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStatus]);

  // 3. Realtime Auto-polling: Tự động kiểm tra mỗi 4 giây CHỈ KHI trạng thái đang là PENDING
  useEffect(() => {
    if (!isAuthenticated || isOrganizer || applicationStatus?.status !== "PENDING") return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isOrganizer, applicationStatus?.status, fetchStatus]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!organizationName.trim()) {
      newErrors.organizationName = "Tên ban tổ chức / doanh nghiệp không được để trống";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (businessEmail.trim() && !emailRegex.test(businessEmail.trim())) {
      newErrors.businessEmail = "Email không đúng định dạng";
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (cleanPhone && !phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "Bạn cần đồng ý với điều khoản dành cho Ban tổ chức";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập tài khoản trước khi đăng ký", "error");
      navigate("/login");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerOrganizer({
        organizationName: organizationName.trim(),
        taxCode: taxCode.trim() || undefined,
        businessEmail: businessEmail.trim() || user?.email,
        phone: phone.trim().replace(/\s/g, "") || user?.phone,
        websiteUrl: websiteUrl.trim() || undefined,
        description: description.trim() || undefined,
      });

      // Cập nhật ngay trạng thái local để hiển thị màn hình chờ duyệt tức thì
      setApplicationStatus({
        organizationName: organizationName.trim(),
        taxCode: taxCode.trim(),
        businessEmail: businessEmail.trim() || user?.email,
        phone: phone.trim().replace(/\s/g, "") || user?.phone,
        websiteUrl: websiteUrl.trim(),
        description: description.trim(),
        status: "PENDING",
        isVerified: false,
        hasBlueTick: false,
      });

      showToast("Đã gửi hồ sơ đăng ký thành công! Ban quản trị sẽ thẩm định trong 48h làm việc.", "success");
      setIsReapplying(false);
      await fetchStatus();
    } catch (err: any) {
      console.error("Register Organizer Error:", err);
      showToast(err.message || "Đăng ký Ban tổ chức thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = (applicationStatus?.status === "PENDING" || (applicationStatus && !isOrganizer && applicationStatus.status !== "REJECTED")) && !isOrganizer && !isReapplying;
  const isRejected = applicationStatus?.status === "REJECTED" && !isOrganizer && !isReapplying;

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4 sm:px-6 lg:px-12 text-left">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950/60 via-[#101018] to-[#FF176B]/15 border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-xs font-black uppercase tracking-wider font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              Hype Ticket for Organizers
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-heading leading-tight">
              Đưa Sự Kiện Của Bạn <br />
              <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-[#00F0FF] bg-clip-text text-transparent">
                Cháy Vé Toàn Quốc
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-semibold leading-relaxed">
              Trở thành đối tác tổ chức sự kiện chính thức trên Hype Ticket. Tiếp cận hàng triệu khán giả trẻ, quản lý bán vé tự động và quét mã QR check-in chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-bg-surface border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white font-heading uppercase tracking-wide">Mở Bán Siêu Tốc</h4>
            <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
              Thẩm định KYC trong 48H. Cấu hình nhiều hạng vé (Early Bird, Standard, VIP) và mở bán chuyên nghiệp.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-surface border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <BadgeCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-base font-extrabold text-white font-heading uppercase tracking-wide">Tích Xanh Uy Tín</h4>
            <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
              Tổ chức thành công từ 5 sự kiện để gửi yêu cầu cấp Tích Xanh và hưởng đặc quyền ưu tiên duyệt vé trước.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-surface border border-white/5 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white font-heading uppercase tracking-wide">Báo Cáo Doanh Thu 24/7</h4>
            <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
              Thống kê lượng vé bán ra, dòng tiền realtime và đối soát thanh toán minh bạch, nhanh chóng.
            </p>
          </div>
        </div>

        {/* State 1: Already Organizer (APPROVED) */}
        {isOrganizer ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0F1D17] via-[#0A1410] to-[#070D0B] border border-emerald-500/40 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black font-heading tracking-wider uppercase shadow-sm">
                <BadgeCheck className="w-4 h-4 text-cyan-400" />
                {applicationStatus?.hasBlueTick ? "ĐỐI TÁC TÍCH XANH XÁC THỰC" : "BAN TỔ CHỨC CHÍNH THỨC"}
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight drop-shadow-md">
                Hồ Sơ Của Bạn Đã Được Phê Duyệt!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-semibold leading-relaxed">
                Chúc mừng bạn! Tài khoản đã được kích hoạt đầy đủ quyền hạn để đăng tải sự kiện, phân phối vé và sử dụng công cụ QR check-in tại cổng.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/organizer/dashboard">
                <Button variant="gradient" className="font-heading uppercase tracking-wider text-xs font-black px-10 py-4 shadow-xl shadow-pink-500/25 active:scale-95 transition-all">
                  Vào Kênh Quản Trị Người Tổ Chức
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        ) : isPending ? (
          /* State 2: PENDING APPROVAL (Cyber Luxury Palette with Live Polling) */
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#14121F] via-[#0E0D17] to-[#090910] border border-amber-400/40 shadow-[0_0_60px_rgba(245,158,11,0.12)] ring-1 ring-white/10 space-y-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Icon, Status Pill & Live indicator */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-white/10 pb-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent border border-amber-400/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-4 ring-amber-500/10">
                <Clock className="w-10 h-10 animate-spin-slow" />
              </div>
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black uppercase font-heading tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <Clock className="w-3.5 h-3.5" />
                    ĐANG CHỜ ADMIN XÉT DUYỆT (48H)
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight drop-shadow-md">
                  Hồ Sơ Của Bạn Đang Được Thẩm Định
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-2xl">
                  Cảm ơn bạn đã nộp hồ sơ. Ban quản trị Hype Ticket đang tiến hành kiểm tra thông tin pháp lý & mã số thuế của tổ chức <strong className="text-white font-bold font-heading">"{applicationStatus?.organizationName}"</strong>. Kết quả sẽ được phản hồi trong vòng <strong className="text-amber-300 font-bold">48 giờ làm việc</strong>.
                </p>
              </div>
            </div>

            {/* Timeline Progress with High-Contrast Cyber Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
              <div className="p-5 rounded-2xl bg-[#0B1510]/80 border border-emerald-500/40 space-y-2 shadow-[0_0_15px_rgba(16,185,129,0.06)]">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase font-heading tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Gửi Đơn Đăng Ký
                </div>
                <p className="text-[11px] text-zinc-300 font-medium">Hồ sơ đã được tiếp nhận an toàn trên hệ thống</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C160E] to-[#120F0B] border border-amber-400/60 space-y-2 shadow-[0_0_25px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/20">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase font-heading tracking-wide">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                  2. Thẩm Định KYC & MST (48H)
                </div>
                <p className="text-[11px] text-amber-200/90 font-semibold">Admin đối soát thông tin tổ chức trong 48H</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#101018]/60 border border-white/10 space-y-2 opacity-75">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase font-heading tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  3. Kích Hoạt Ban Tổ Chức
                </div>
                <p className="text-[11px] text-zinc-400 font-medium">Mở quyền tạo sự kiện và phân phối vé</p>
              </div>
            </div>

            {/* Info Summary Box */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4 relative z-10 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider font-heading flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Thông Tin Hồ Sơ Đã Nộp:
                </h4>
                <button
                  onClick={() => fetchStatus(true)}
                  disabled={isSyncing}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold transition-all cursor-pointer"
                  title="Kiểm tra trạng thái phê duyệt ngay"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
                  {isSyncing ? "Đang đồng bộ..." : "Kiểm tra ngay"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-0.5 font-medium">Tên đơn vị / Doanh nghiệp:</span>
                  <strong className="text-white text-sm font-heading">{applicationStatus?.organizationName}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5 font-medium">Mã số thuế / GPKD:</span>
                  <strong className="text-amber-300 font-mono text-sm">{applicationStatus?.taxCode || "Không cung cấp"}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5 font-medium">Email liên hệ sự kiện:</span>
                  <strong className="text-white font-mono">{applicationStatus?.businessEmail}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5 font-medium">Hotline đại diện:</span>
                  <strong className="text-white font-mono">{applicationStatus?.phone}</strong>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 relative z-10">
              <p className="text-xs text-zinc-400 font-medium">
                Cần bổ sung hoặc cập nhật thông tin gấp? Vui lòng liên hệ hotline: <strong className="text-white font-bold">1900 8888</strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReapplying(true)}
                className="font-heading uppercase text-xs tracking-wider border-white/20 hover:border-white text-white hover:bg-white/10"
              >
                Chỉnh sửa đơn đã gửi
              </Button>
            </div>
          </div>
        ) : isRejected ? (
          /* State 3: REJECTED */
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1C0D11] via-[#140A0D] to-[#0A0507] border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-18 h-18 rounded-3xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 flex-shrink-0 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
                <AlertTriangle className="w-9 h-9" />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black font-heading tracking-wider uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  HỒ SƠ CHƯA ĐƯỢC PHÊ DUYỆT
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight">
                  Yêu Cầu Đăng Ký Cần Được Cập Nhật Lại
                </h3>
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-semibold leading-relaxed">
                  <strong className="block text-rose-300 font-bold mb-1 font-heading">Lý do từ chối từ Ban quản trị:</strong>
                  {applicationStatus?.rejectionReason || "Thông tin tổ chức hoặc mã số thuế chưa khớp với dữ liệu đăng ký kinh doanh."}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-300 font-medium">
                Bạn có thể điều chỉnh lại thông tin và gửi lại đơn để Ban quản trị xem xét lại ngay.
              </p>
              <Button
                variant="gradient"
                onClick={() => setIsReapplying(true)}
                className="font-heading uppercase text-xs tracking-wider font-extrabold px-6 py-3"
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Cập Nhật & Nộp Lại Hồ Sơ
              </Button>
            </div>
          </div>
        ) : (
          /* State 4: Registration Form */
          <div className="p-6 sm:p-10 rounded-3xl bg-bg-surface border border-white/10 shadow-2xl space-y-8">
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-heading flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-brand-primary" />
                    Hồ Sơ Đăng Ký Ban Tổ Chức
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-semibold mt-1">
                    Điền thông tin doanh nghiệp hoặc tổ chức để được kiểm duyệt và cấp Tích Xanh ưu tiên
                  </p>
                </div>
                {isReapplying && (
                  <button
                    onClick={() => setIsReapplying(false)}
                    className="text-xs text-zinc-400 hover:text-white underline font-semibold"
                  >
                    Quay lại
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div className="md:col-span-2">
                  <Input
                    label="Tên Ban Tổ Chức / Tên Doanh Nghiệp *"
                    placeholder="Ví dụ: Công ty TNHH Giải Trí Hype Media / SpaceSpeakers"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    leftIcon={<Building2 className="w-4 h-4 text-zinc-500" />}
                    error={errors.organizationName}
                  />
                </div>

                {/* Tax Code */}
                <div>
                  <Input
                    label="Mã Số Thuế / Số GPKD (Để được cấp Tích Xanh)"
                    placeholder="Nhập mã số thuế doanh nghiệp (nếu có)"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    leftIcon={<FileText className="w-4 h-4 text-zinc-500" />}
                  />
                </div>

                {/* Business Email */}
                <div>
                  <Input
                    label="Email Liên Hệ Sự Kiện"
                    placeholder="event@company.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
                    error={errors.businessEmail}
                  />
                </div>

                {/* Hotline */}
                <div>
                  <Input
                    label="Hotline / Số Điện Thoại Đại Diện *"
                    placeholder="Ví dụ: 0901234567 (10 số)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4 text-zinc-500" />}
                    error={errors.phone}
                  />
                </div>

                {/* Website / Fanpage */}
                <div>
                  <Input
                    label="Website / Fanpage Chính Thức"
                    placeholder="https://facebook.com/yourbrand"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    leftIcon={<Globe className="w-4 h-4 text-zinc-500" />}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider font-heading">
                    Giới Thiệu Ngắn Về Tổ Chức
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả các thể loại sự kiện bạn thường tổ chức (Music Festival, Hội thảo, EDM, Triển lãm...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-2xl bg-bg-void/80 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none font-semibold"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-bg-void text-brand-primary focus:ring-brand-primary accent-brand-primary"
                  />
                  <span className="text-xs text-zinc-400 font-semibold leading-relaxed">
                    Tôi cam kết cung cấp thông tin chính xác và tuân thủ các quy định kiểm duyệt sự kiện & chính sách bảo mật vé của Hype Ticket.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Hồ sơ được thẩm định trong 48H làm việc. Đạt mốc 5 sự kiện thành công để yêu cầu cấp Tích Xanh
                </p>

                <Button
                  type="submit"
                  variant="gradient"
                  isLoading={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 font-heading uppercase text-xs tracking-wider font-extrabold shadow-lg shadow-pink-500/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isReapplying ? "Gửi Lại Đơn Đăng Ký" : "Nộp Hồ Sơ Xét Duyệt"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
