import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  RefreshCcw,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building2,
  UserCheck,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  Ticket,
  Search,
  Scale,
  Ban,
  Accessibility,
  Globe,
  Mail,
  Phone,
  Calendar,
  Layers,
  Award,
  Download,
  Printer,
  ExternalLink,
  BookOpen,
  Info,
  ChevronDown,
} from "lucide-react";

export const PoliciesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lang, setLang] = useState<"VI" | "EN">("VI");

  const sections = [
    { id: "intro", num: "00", titleVI: "Giới Thiệu Nền Tảng", titleEN: "Platform Introduction", icon: Sparkles, color: "sky" },
    { id: "terms-of-service", num: "01", titleVI: "1. Điều Khoản Sử Dụng (Terms of Service)", titleEN: "1. Terms of Service", icon: Scale, color: "indigo" },
    { id: "ticket-purchase", num: "02", titleVI: "2. Chính Sách Mua Vé (Purchase Policy)", titleEN: "2. Ticket Purchase Policy", icon: Ticket, color: "blue" },
    { id: "refund-policy", num: "03", titleVI: "3. Chính Sách Hoàn Tiền & Hủy Vé", titleEN: "3. Refund & Cancellation Policy", icon: RefreshCcw, color: "emerald" },
    { id: "event-disruption", num: "04", titleVI: "4. Hoãn, Hủy & Dời Lịch Sự Kiện", titleEN: "4. Cancellation & Postponement", icon: Clock, color: "amber" },
    { id: "event-entry", num: "05", titleVI: "5. Quy Định Vào Cổng & Quét Mã QR", titleEN: "5. Event Entry & QR Verification", icon: QrCode, color: "cyan" },
    { id: "age-admission", num: "06", titleVI: "6. Quy Định Độ Tuổi & Tham Gia", titleEN: "6. Age & Admission Policy", icon: UserCheck, color: "violet" },
    { id: "prohibited-items", num: "07", titleVI: "7. Vật Dụng & Hành Vi Bị Cấm", titleEN: "7. Prohibited Items & Conduct", icon: Ban, color: "rose" },
    { id: "transfer-resale", num: "08", titleVI: "8. Chuyển Nhượng & Bán Lại Vé", titleEN: "8. Ticket Transfer & Resale", icon: Layers, color: "purple" },
    { id: "payment-policy", num: "09", titleVI: "9. Chính Sách Thanh Toán & Bảo Mật", titleEN: "9. Payment Processing Policy", icon: CreditCard, color: "teal" },
    { id: "privacy-policy", num: "10", titleVI: "10. Chính Sách Bảo Mật Dữ Liệu", titleEN: "10. Privacy Policy", icon: Lock, color: "blue" },
    { id: "cookie-policy", num: "11", titleVI: "11. Chính Sách Sử Dụng Cookies", titleEN: "11. Cookie & Tracking Policy", icon: FileText, color: "slate" },
    { id: "organizer-policy", num: "12", titleVI: "12. Chính Sách Dành Cho Ban Tổ Chức", titleEN: "12. Event Organizer Policy", icon: Building2, color: "indigo" },
    { id: "ip-policy", num: "13", titleVI: "13. Bản Quyền & Sở Hữu Trí Tuệ", titleEN: "13. Intellectual Property Policy", icon: Award, color: "amber" },
    { id: "fraud-abuse", num: "14", titleVI: "14. Phòng Chống Gian Lận & Bot Phe Vé", titleEN: "14. Anti-Fraud & Anti-Bot Policy", icon: AlertTriangle, color: "rose" },
    { id: "accessibility", num: "15", titleVI: "15. Hỗ Trợ Khán Giả Đặc Biệt", titleEN: "15. Accessibility & Special Needs", icon: Accessibility, color: "emerald" },
    { id: "policy-updates", num: "16", titleVI: "16. Cập Nhật & Hiệu Lực Chính Sách", titleEN: "16. Policy Updates & Changes", icon: RefreshCcw, color: "zinc" },
    { id: "dispute-contact", num: "17", titleVI: "17. Liên Hệ & Giải Quyết Tranh Chấp", titleEN: "17. Contact & Dispute Resolution", icon: HelpCircle, color: "sky" },
  ];

  const sidebarRef = useRef<HTMLElement>(null);

  // Dynamic collision avoidance with footer
  useEffect(() => {
    const handleFooterCollision = () => {
      if (!sidebarRef.current) return;
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const topOffset = 108; // 76px Navbar + 32px offset = 108px

      // If the footer comes up into view and approaches the bottom of the sidebar
      if (footerRect.top < topOffset + sidebarHeight + 40) {
        const overflow = topOffset + sidebarHeight + 40 - footerRect.top;
        sidebarRef.current.style.transform = `translateY(-${overflow}px)`;
      } else {
        sidebarRef.current.style.transform = "translateY(0px)";
      }
    };

    window.addEventListener("scroll", handleFooterCollision, { passive: true });
    handleFooterCollision();
    return () => window.removeEventListener("scroll", handleFooterCollision);
  }, []);

  // Scrollspy to detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 108;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const filteredSections = sections.filter((s) =>
    (s.titleVI + s.titleEN + s.num).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090D16] text-zinc-300 font-sans antialiased text-left selection:bg-indigo-500/30 selection:text-white pt-8 pb-20 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="fixed top-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-20 left-10 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Two-Column Document Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: Table of Contents (Fixed in view, Stops automatically at Footer) */}
        {/* ========================================================================= */}
        <aside
          ref={sidebarRef}
          className="w-full lg:fixed lg:top-[108px] lg:w-[290px] xl:w-[330px] lg:h-[calc(100vh-130px)] flex flex-col space-y-3 z-30 transition-transform duration-75 ease-out"
        >
          {/* Search Box */}
          <div className="relative flex-shrink-0">
            <input
              type="text"
              placeholder="Tìm kiếm điều khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111726] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all h-8"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2" />
          </div>

          {/* Navigation List */}
          <div className="overflow-y-auto flex-1 space-y-1 pr-1.5 custom-scrollbar">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 px-3 py-1 block font-heading">
              Mục Lục Văn Bản (17 Điều Khoản)
            </span>

            {filteredSections.map((s) => {
              const isActive = activeSection === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer group ${
                    isActive
                      ? "bg-indigo-500/15 text-white border border-indigo-500/30 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent font-medium"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white/[0.06] text-zinc-400 group-hover:text-zinc-200 group-hover:bg-white/10"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="truncate flex-1">
                    {lang === "VI" ? s.titleVI : s.titleEN}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Support Hotline Widget */}
          <div className="p-3.5 rounded-2xl bg-[#111726]/80 border border-white/10 text-xs space-y-1.5 flex-shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2 text-white font-bold font-heading">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Cần Hỗ Trợ Pháp Lý?</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Bộ phận pháp chế & CSKH túc trực 24/7:
            </p>
            <div className="pt-0.5 font-mono text-[11px] text-sky-400 font-bold">
              support@hypeticket.vn
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Full Continuous Legal Document Body */}
        {/* ========================================================================= */}
        <main className="lg:ml-[320px] xl:ml-[360px] space-y-16 text-zinc-300">
            {/* SECTION 00: INTRODUCTION */}
            <section id="intro" className="space-y-6 pt-0 border-b border-white/10 pb-12">
              <div className="flex flex-wrap items-center justify-between gap-4 h-8">
                <div className="inline-flex items-center gap-2 px-3 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-400 font-bold">
                  #00 • PREAMBLE & OVERVIEW
                </div>

                {/* Clean Neutral Language & Print Toolbar */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#111726] p-0.5 rounded-xl border border-white/10 h-8">
                    <button
                      onClick={() => setLang("VI")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        lang === "VI"
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => setLang("EN")}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        lang === "EN"
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-1.5 h-8 px-2.5 rounded-xl bg-[#111726] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    title="In văn bản"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                Giới Thiệu Về Nền Tảng HYPETICKET
              </h2>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 text-sm leading-relaxed">
                <p>
                  Chào mừng bạn đến với <strong>HYPETICKET</strong> (gọi tắt là "Nền tảng", "Chúng tôi"). HYPETICKET là nền tảng công nghệ số và sàn giao dịch vé trực tuyến kết nối hàng triệu khán giả yêu nghệ thuật với các nhà tổ chức sự kiện, nhà sản xuất âm nhạc, concert, đại nhạc hội EDM, festival văn hóa và trình diễn trực tiếp tại Việt Nam và khu vực.
                </p>
                
                <div className="p-4 rounded-xl bg-sky-500/[0.04] border border-sky-500/20 text-xs text-zinc-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Quy định về Vai trò của Nền tảng:</strong>
                    HYPETICKET cung cấp giải pháp công nghệ phân phối vé, cổng quét vé điện tử QR tốc độ cao và cổng thanh toán trung gian. Trừ khi có thông báo bằng văn bản đối với sự kiện do HYPETICKET tự sản xuất, HYPETICKET hoạt động với tư cách là <strong>Đại lý công nghệ trung gian</strong> được ủy quyền bởi Ban Tổ Chức sự kiện độc lập.
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 01: TERMS OF SERVICE */}
            <section id="terms-of-service" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-xs font-mono text-indigo-400 font-bold">
                #01 • TERMS OF SERVICE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                1. Điều Khoản Sử Dụng Dịch Vụ (Terms of Service)
              </h2>

              <div className="space-y-5 text-sm leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-heading">1.1 Phạm vi áp dụng & Sự chấp thuận</h3>
                  <p className="text-zinc-400">
                    Bằng việc truy cập website, đăng ký tài khoản hoặc nhấn nút hoàn tất thanh toán bất kỳ đơn hàng nào trên HYPETICKET, bạn xác nhận đã đủ tuổi chịu trách nhiệm dân sự (từ đủ 18 tuổi hoặc có sự đồng ý của người giám hộ), đã đọc, hiểu rõ và cam kết tuân thủ toàn bộ các điều khoản này.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold text-white font-heading">1.2 Định nghĩa các thuật ngữ pháp lý</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-white block font-heading mb-1">• Platform (Nền tảng):</strong>
                      <span className="text-zinc-400">Hệ thống website, ứng dụng di động, API và hạ tầng máy chủ vận hành bởi `HYPETICKET`.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-white block font-heading mb-1">• Customer / Khách hàng:</strong>
                      <span className="text-zinc-400">Cá nhân hoặc tổ chức thực hiện việc duyệt xem, đặt chỗ, thanh toán hoặc sở hữu vé.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-white block font-heading mb-1">• Organizer / Ban Tổ Chức:</strong>
                      <span className="text-zinc-400">Đơn vị pháp nhân chịu trách nhiệm sản xuất, xin giấy phép và vận hành sự kiện.</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-white block font-heading mb-1">• Ticket & QR Code (Vé):</strong>
                      <span className="text-zinc-400">Chứng từ điện tử chứa mã định danh duy nhất cấp quyền tham dự sự kiện.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-base font-bold text-white font-heading">1.3 Bản chất của Vé (Giấy phép có thể thu hồi)</h3>
                  <p className="text-zinc-400">
                    Vé sự kiện cấu thành một <strong>Giấy phép có điều kiện và có thể bị thu hồi (Revocable License)</strong> do Ban tổ chức cấp cho người sở hữu hợp pháp. Ban tổ chức và Lực lượng an ninh tại địa điểm biểu diễn có toàn quyền từ chối cho vào cửa hoặc trục xuất bất kỳ cá nhân nào có hành vi quá khích, gây rối trật tự công cộng hoặc vi phạm nội quy an ninh mà không cần bồi hoàn tiền vé.
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-base font-bold text-white font-heading">1.4 Luật áp dụng và Thẩm quyền giải quyết tranh chấp</h3>
                  <p className="text-zinc-400">
                    Các Điều khoản này được điều chỉnh và giải thích theo quy định của pháp luật Việt Nam. Mọi tranh chấp không thể giải quyết thông qua thương lượng hòa giải sẽ được đưa ra phân xử tại Tòa án có thẩm quyền tại Thành phố Hồ Chí Minh.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 02: TICKET PURCHASE POLICY */}
            <section id="ticket-purchase" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs font-mono text-blue-400 font-bold">
                #02 • TICKET PURCHASE POLICY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                2. Chính Sách Mua Vé & Đặt Chỗ (Ticket Purchase Policy)
              </h2>

              <div className="space-y-5 text-sm leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-heading">2.1 Hạng vé & Giới hạn số lượng (Ticket Tiers & Limits)</h3>
                  <p className="text-zinc-400">
                    Mỗi sự kiện có các hạng vé khác nhau (VIP, GA, Early Bird, SVIP). Nhằm đảm bảo cơ hội mua vé công bằng cho tất cả khán giả, mỗi tài khoản/đơn hàng áp dụng giới hạn số lượng tối đa (thông thường từ 4 đến 6 vé/đơn). Hệ thống sẽ tự động hủy các đơn hàng cố tình lách quy định bằng cách dùng nhiều tài khoản cùng thông tin thanh toán.
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-base font-bold text-white font-heading">2.2 Thời điểm giao dịch hoàn tất</h3>
                  <p className="text-zinc-400">
                    Một giao dịch chỉ được xem là hợp lệ và hoàn tất khi cổng thanh toán ghi nhận chuyển tiền thành công và hệ thống HYPETICKET sinh ra **Mã Đơn Hàng (Order ID)** cùng **Mã Vé Điện Tử (Ticket ID)**.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 space-y-2">
                  <strong className="text-blue-400 block font-heading text-xs uppercase">
                    Xử lý sự cố chưa nhận được vé sau khi trừ tiền:
                  </strong>
                  <p className="text-xs text-zinc-400">
                    Nếu tài khoản ngân hàng của bạn đã bị trừ tiền nhưng không nhận được email xác nhận hoặc không thấy vé trong mục <strong>"Vé Của Tôi"</strong> sau 15 phút, vui lòng kiểm tra hộp thư rác (Spam) và gửi biên lai chuyển khoản về email <code>support@hypeticket.vn</code> để được đối soát tức thì. Không nên bấm mua lại để tránh bị trừ tiền 2 lần.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 03: REFUND & CANCELLATION */}
            <section id="refund-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400 font-bold">
                #03 • REFUND & CANCELLATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                3. Chính Sách Hoàn Tiền & Hủy Vé (Refund Policy)
              </h2>

              <div className="space-y-5 text-sm leading-relaxed">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-zinc-200">
                  <strong className="text-emerald-400 font-bold block mb-1 text-sm font-heading">
                    Quy Tắc Chung: Vé Đã Mua Miễn Đổi Hoặc Trả (All Sales Final)
                  </strong>
                  Trừ các trường hợp sự kiện bị Hủy hoặc Dời lịch do Ban tổ chức quy định dưới đây, vé sau khi mua thành công không thể hoàn trả vì lý do cá nhân (bận việc, ốm đau, đổi kế hoạch, thời tiết xấu khi sự kiện vẫn diễn ra).
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold text-white font-heading">3.1 Trường hợp Sự kiện bị HỦY HOÀN TOÀN (Event Cancelled)</h3>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Khán giả được <strong>hoàn trả 100% tiền vé gốc</strong> đã thanh toán.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Thời gian xử lý hoàn tiền: Từ <strong>3 đến 5 ngày làm việc</strong> tự động về thẻ/ví điện tử ban đầu.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 04: EVENT DISRUPTIONS */}
            <section id="event-disruption" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 font-bold">
                #04 • POSTPONEMENT & FORCE MAJEURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                4. Sự Kiện Hoãn, Dời Lịch & Bất Khả Kháng
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Khi sự kiện bị dời ngày biểu diễn, vé cũ của bạn sẽ **tự động bảo lưu giá trị** cho ngày mới. Nếu không thể tham dự ngày mới, bạn có quyền gửi yêu cầu hoàn tiền trong khung thời gian quy định (thông thường là 72 giờ kể từ thông báo). Quá thời hạn này, vé được xem là mặc định xác nhận cho lịch biểu diễn mới.
                </p>
                <p>
                  Đối với trường hợp Bất Khả Kháng (Force Majeure: thiên tai bão lũ, dịch bệnh, sắc lệnh khẩn cấp của chính quyền), việc hoàn tiền hoặc hoãn diễn sẽ thực hiện đúng theo quy định và hướng dẫn của cơ quan nhà nước có thẩm quyền.
                </p>
              </div>
            </section>

            {/* SECTION 05: EVENT ENTRY */}
            <section id="event-entry" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-xs font-mono text-cyan-400 font-bold">
                #05 • ENTRY & QR VERIFICATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                5. Quy Định Vào Cổng & Xác Thực Mã Vé QR
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Mỗi mã vé QR chỉ có giá trị quét vào cổng đúng **một lần duy nhất**. Khi mã vé đã được quét check-in thành công tại cổng, bất kỳ bản sao chép, ảnh chụp màn hình hoặc in ấn lại nào của cùng một mã đều sẽ bị máy quét từ chối ngay lập tức.
                </p>
                <p>
                  Đối với các sự kiện có phát Vòng Đeo Tay (Wristband), vòng tay phải được đeo nguyên vẹn trên cổ tay trong suốt thời gian diễn ra sự kiện. Vòng tay bị cắt, dán lại, rách hoặc chuyển nhượng cho người khác sẽ bị hủy quyền ra vào sân khấu.
                </p>
              </div>
            </section>

            {/* SECTION 06: AGE & ADMISSION */}
            <section id="age-admission" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/25 text-xs font-mono text-violet-400 font-bold">
                #06 • AGE & ADMISSION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                6. Quy Định Về Độ Tuổi & Điều Kiện Tham Gia
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Người mua vé có nghĩa vụ tự kiểm tra giới hạn độ tuổi của từng sự kiện (Ví dụ: All Ages, 16+, 18+). Khán giả không đủ tuổi quy định sẽ bị từ chối vào cổng và không được hoàn lại tiền vé. Trẻ em tham dự sự kiện (nếu được phép) bắt buộc phải có vé riêng và có người giám hộ hợp pháp đi kèm.
                </p>
              </div>
            </section>

            {/* SECTION 07: PROHIBITED ITEMS & CONDUCT */}
            <section id="prohibited-items" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/25 text-xs font-mono text-orange-400 font-bold">
                #07 • PROHIBITED ITEMS & CONDUCT
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                7. Danh Mục Vật Dụng & Hành Vi Bị Nghiêm Cấm
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-orange-500/[0.04] border border-orange-500/20 space-y-2">
                  <strong className="text-orange-400 font-bold block text-sm font-heading">
                    🚫 Vật Dụng Bị Cấm Mang Vào Sân Khấu:
                  </strong>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li>• Vũ khí, hung khí sắc nhọn, vật liệu gây cháy nổ, pháo sáng.</li>
                    <li>• Ma túy, chất kích thích, cồn và đồ uống từ bên ngoài.</li>
                    <li>• Máy ảnh chuyên nghiệp ống kính rời, flycam/drone, gậy selfie, bút laser.</li>
                    <li>• Balo, vali cỡ lớn vượt quá quy chuẩn túi xách cá nhân.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-orange-500/[0.04] border border-orange-500/20 space-y-2">
                  <strong className="text-orange-400 font-bold block text-sm font-heading">
                    🚫 Hành Vi Bị Trục Xuất Ngay Lập Tức:
                  </strong>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li>• Ẩu đả, bạo lực, quấy rối thân thể hoặc kỳ thị xúc phạm người khác.</li>
                    <li>• Trèo qua rào chắn an ninh, xâm nhập khu vực hậu trường nghệ sĩ.</li>
                    <li>• Sử dụng vé giả hoặc có hành vi phe vé gây mất trật tự cổng sự kiện.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 08: TICKET TRANSFER & RESALE */}
            <section id="transfer-resale" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-xs font-mono text-purple-400 font-bold">
                #08 • TRANSFER & RESALE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                8. Chính Sách Chuyển Nhượng & Chống Phe Vé
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Khán giả có thể chuyển nhượng vé cho bạn bè thông qua tính năng <strong>"Chuyển Nhượng Vé Chính Thức"</strong> trên website HYPETICKET. Khi hoàn tất chuyển nhượng, mã QR cũ của người bán sẽ bị vô hiệu hóa vĩnh viễn và một mã QR mới hoàn toàn sẽ được cấp cho người nhận để ngăn chặn việc lừa đảo bán 1 vé cho nhiều người.
                </p>
                <p>
                  Nghiêm cấm hành vi bán lại vé với giá đầu cơ cao hơn giá gốc (Ticket Scalping). HYPETICKET có quyền hủy vé và khóa tài khoản các đối tượng phe vé chuyên nghiệp.
                </p>
              </div>
            </section>

            {/* SECTION 09: PAYMENT POLICY */}
            <section id="payment-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/25 text-xs font-mono text-teal-400 font-bold">
                #09 • PAYMENT & GATEWAYS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                9. Chính Sách Thanh Toán & Cổng Trung Gian
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  HYPETICKET hỗ trợ các kênh thanh toán trực tuyến hợp pháp: VNPay QR, Ví điện tử MoMo, ZaloPay, Thẻ thanh toán quốc tế Visa/Mastercard/JCB. Mọi thông tin thanh toán đều được xử lý qua cổng bảo mật chuẩn quốc tế PCI-DSS Level 1, máy chủ của sàn hoàn toàn không lưu trữ số thẻ hay mã CVV của khách hàng.
                </p>
              </div>
            </section>

            {/* SECTION 10: PRIVACY POLICY */}
            <section id="privacy-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs font-mono text-blue-400 font-bold">
                #10 • PRIVACY & DATA PROTECTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                10. Chính Sách Bảo Mật Thông Tin Cá Nhân
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Chúng tôi thu thập các thông tin cơ bản (Họ tên, Email, SĐT) chỉ nhằm mục đích phát hành vé, hỗ trợ khiếu nại và gửi thông báo khẩn cấp từ Ban tổ chức. Chúng tôi tuân thủ nghiêm ngặt các quy định pháp luật về bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP) và cam kết không bán dữ liệu cho bất kỳ bên thứ ba nào.
                </p>
              </div>
            </section>

            {/* SECTION 11: COOKIE POLICY */}
            <section id="cookie-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-500/10 border border-slate-500/25 text-xs font-mono text-slate-300 font-bold">
                #11 • COOKIE POLICY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                11. Chính Sách Sử Dụng Cookies
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Hệ thống sử dụng Essential Cookies để ghi nhớ trạng thái đăng nhập và giỏ hàng vé, cùng Analytics Cookies ẩn danh giúp nâng cao trải nghiệm tốc độ tải trang. Bạn có thể xóa hoặc tắt cookies trong cài đặt trình duyệt của mình bất kỳ lúc nào.
                </p>
              </div>
            </section>

            {/* SECTION 12: ORGANIZER POLICY */}
            <section id="organizer-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-xs font-mono text-indigo-400 font-bold">
                #12 • ORGANIZER REGULATIONS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                12. Quy Định Dành Cho Ban Tổ Chức Sự Kiện
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Ban tổ chức đăng ký mở bán vé phải hoàn tất xác minh danh tính doanh nghiệp (KYC) và chịu toàn bộ trách nhiệm pháp lý về giấy phép biểu diễn, chất lượng sân khấu, an toàn cháy nổ và bản quyền âm nhạc. Doanh thu bán vé được sàn tạm giữ trong quỹ Escrow an toàn và giải ngân sau khi sự kiện diễn ra thành công (T+3).
                </p>
              </div>
            </section>

            {/* SECTION 13: INTELLECTUAL PROPERTY */}
            <section id="ip-policy" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 font-bold">
                #13 • INTELLECTUAL PROPERTY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                13. Quyền Sở Hữu Trí Tuệ & Bản Quyền Nghệ Sĩ
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Thương hiệu, giao diện, phần mềm và mã nguồn thuộc bản quyền của `HYPETICKET`. Poster nghệ sĩ, logo sự kiện và hình ảnh thuộc quyền sở hữu của Ban tổ chức hoặc nghệ sĩ tương ứng. HYPETICKET được cấp quyền hiển thị phục vụ công tác bán vé và truyền thông sự kiện.
                </p>
              </div>
            </section>

            {/* SECTION 14: FRAUD & ABUSE */}
            <section id="fraud-abuse" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-xs font-mono text-red-400 font-bold">
                #14 • ANTI-FRAUD & ANTI-BOT
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                14. Phòng Chống Gian Lận, Thẻ Đánh Cắp & Bot Đầu Cơ
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/20 text-xs text-zinc-300 leading-relaxed">
                  HYPETICKET áp dụng hệ thống quét hành vi bằng AI để phát hiện và ngăn chặn các giao dịch sử dụng thẻ đánh cắp, bot gom vé tự động hoặc gian lận hoàn tiền. Mọi hành vi vi phạm sẽ bị khóa tài khoản vĩnh viễn, hủy vé và bàn giao thông tin cho cơ quan điều tra an ninh mạng.
                </div>
              </div>
            </section>

            {/* SECTION 15: ACCESSIBILITY */}
            <section id="accessibility" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400 font-bold">
                #15 • ACCESSIBILITY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                15. Hỗ Trợ Khán Giả Có Nhu Cầu Đặc Biệt (Xe Lăn & Trợ Giúp)
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  Chúng tôi luôn khuyến khích các Ban tổ chức bố trí lối đi riêng và khu vực khán đài thuận tiện cho người sử dụng xe lăn. Vui lòng liên hệ với đội ngũ CSKH trước ngày diễn 5 ngày để được hỗ trợ đăng ký vị trí tiếp cận thuận tiện nhất.
                </p>
              </div>
            </section>

            {/* SECTION 16: POLICY UPDATES */}
            <section id="policy-updates" className="space-y-6 pt-2 border-b border-white/10 pb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-500/10 border border-zinc-500/25 text-xs font-mono text-zinc-300 font-bold">
                #16 • UPDATES & EFFECTIVE DATE
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                16. Cập Nhật & Hiệu Lực Của Chính Sách
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                <p>
                  HYPETICKET có quyền sửa đổi, bổ sung các điều khoản này bất kỳ lúc nào để phù hợp với sự phát triển của công nghệ và quy định pháp luật. Bản cập nhật sẽ được công bố công khai trên trang web và có hiệu lực kể từ thời điểm đăng tải.
                </p>
              </div>
            </section>

            {/* SECTION 17: CONTACT & DISPUTE RESOLUTION */}
            <section id="dispute-contact" className="space-y-6 pt-2 pb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-400 font-bold">
                #17 • CONTACT & DISPUTE RESOLUTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                17. Kênh Tiếp Nhận Khiếu Nại & Giải Quyết Tranh Chấp
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <strong className="text-white block font-heading text-sm">Trung Tâm Chăm Sóc Khách Hàng:</strong>
                  <p className="text-zinc-400">• Email hỗ trợ: <strong>support@hypeticket.vn</strong></p>
                  <p className="text-zinc-400">• Hotline khẩn cấp: <strong>1900 6868</strong> (08:00 - 22:00)</p>
                  <p className="text-zinc-400">• Trụ sở chính: Tòa nhà HYPETICKET Tower, TP. Hồ Chí Minh</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <strong className="text-white block font-heading text-sm">Quy Trình Xử Lý Khiếu Nại:</strong>
                  <p className="text-zinc-400">
                    Khiếu nại được tiếp nhận và xử lý trong vòng <strong>24 đến 48 giờ làm việc</strong>. Chúng tôi cam kết đối soát minh bạch để bảo vệ tối đa quyền lợi chính đáng của khán giả và đơn vị tổ chức.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
    </div>
  );
};
