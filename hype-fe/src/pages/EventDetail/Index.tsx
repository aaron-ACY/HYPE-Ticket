import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft, Info, HelpCircle, Share2, Check, ShieldAlert } from "lucide-react";
import { events } from "../../data/events";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(events.find((e) => e.slug === slug));
  const [activeTab, setActiveTab] = useState<"about" | "schedule" | "terms" | "faq">("about");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const found = events.find((e) => e.slug === slug);
    setEvent(found);
    if (found) {
      document.title = `${found.title} | HYPETICKET`;
    }
  }, [slug]);

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2 font-heading uppercase">Sự kiện không tồn tại</h2>
        <p className="text-sm text-zinc-500 mb-6">Liên kết bạn theo dõi có thể đã hỏng hoặc sự kiện đã bị xóa.</p>
        <Link to="/events">
          <Button variant="primary">Khám phá các sự kiện khác</Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = event.status === "sold-out";
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(event.priceFrom);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast("Đã sao chép liên kết sự kiện!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCheckoutRedirect = () => {
    if (isSoldOut) return;

    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục đặt vé!", "info");
      navigate(`/login?redirect=${encodeURIComponent(`/checkout?event=${event.id}`)}`);
      return;
    }

    navigate(`/checkout?event=${event.id}`);
  };

  const tabs = [
    { id: "about", label: "Giới thiệu", icon: <Info className="w-4 h-4" /> },
    { id: "schedule", label: "Lịch trình", icon: <Clock className="w-4 h-4" /> },
    { id: "terms", label: "Quy định", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "faq", label: "Câu hỏi (FAQ)", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="relative pb-24 text-left bg-bg-main">
      {/* 1. Cinematic Ambient Background Header */}
      <div className="absolute top-0 inset-x-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover filter blur-3xl opacity-20 brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-main" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 z-10">
        {/* Return Button */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-550 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Sự kiện
        </Link>

        {/* 2. Banner and Core Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Cover image column */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/5 shadow-2xl aspect-[16/10] sm:aspect-video lg:aspect-[4/3] bg-zinc-950">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Core Info details column */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6">
            {/* Category / Status Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="primary">{event.category.replace("-", " ")}</Badge>
              {isSoldOut ? (
                <Badge variant="error">Hết vé</Badge>
              ) : (
                <Badge variant="success">Đang mở bán</Badge>
              )}
            </div>

            {/* Event Title */}
            <h1 className="text-3xl sm:text-4.5xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight font-heading">
              {event.title}
            </h1>

            {/* Event Quick Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-white/5 py-6 text-sm font-semibold text-zinc-300">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 text-brand-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-heading mb-1">Thời gian</p>
                  <p className="font-heading uppercase text-sm font-bold text-white">{event.date}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 text-brand-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-heading mb-1">Địa điểm</p>
                  <p className="font-heading uppercase text-sm font-bold text-white line-clamp-1">{event.venueName}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-zinc-400 font-heading">Vé chỉ từ</span>
                <span className="text-xl sm:text-2xl font-black text-brand-price tracking-tight font-heading">{formattedPrice}</span>
              </div>

              {/* Big CTA */}
              <Button
                variant={isSoldOut ? "secondary" : "gradient"}
                size="lg"
                onClick={handleCheckoutRedirect}
                disabled={isSoldOut}
                className="px-10 py-4 font-heading uppercase text-xs tracking-wider font-bold"
              >
                {isSoldOut ? "Đã bán hết vé" : "Mua vé ngay"}
              </Button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-3.5 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
                title="Chia sẻ sự kiện"
              >
                {isCopied ? <Check className="w-5 h-5 text-emerald-450" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Detailed Tabs and Ticket Box Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 items-start">
          {/* Main content tabs (Col span 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Custom Tab Toggles */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3.5 px-5 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex-shrink-0 font-heading cursor-pointer ${
                      isActive
                        ? "border-white text-white"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content panel */}
            <div className="bg-bg-surface border border-white/5 p-6 sm:p-10 rounded-3xl min-h-[300px] shadow-2xl">
              {activeTab === "about" && (
                <div className="space-y-8 text-zinc-350">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading">Mô tả sự kiện</h3>
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium text-zinc-350">{event.description}</p>
                  </div>
                  
                  {event.highlights && (
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Điểm nhấn nổi bật</h4>
                      <ul className="list-disc list-inside space-y-3 text-sm sm:text-base pl-1 text-zinc-400 font-semibold">
                        {event.highlights.map((hl, idx) => (
                          <li key={idx} className="leading-relaxed">{hl}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading">Lịch trình chương trình</h3>
                  {event.schedule ? (
                    <div className="relative border-l border-white/5 pl-6 space-y-6 py-2 ml-3">
                      {event.schedule.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Chronological dot */}
                          <div className="absolute w-3.5 h-3.5 rounded-full bg-brand-primary border-2 border-bg-surface -left-[33px] top-1.5" />
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-mono font-bold text-brand-primary">{item.time}</span>
                            <span className="text-sm sm:text-base font-bold text-zinc-200 font-heading">{item.activity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-550 italic">Lịch trình chi tiết đang được cập nhật.</p>
                  )}
                </div>
              )}

              {activeTab === "terms" && (
                <div className="space-y-8 text-zinc-300 text-sm sm:text-base">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading">Chính sách & Quy định tham dự</h3>
                  
                  <div className="space-y-6 leading-relaxed text-zinc-400 font-semibold">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-3 text-zinc-450 text-xs">
                      <ShieldAlert className="w-5 h-5 text-brand-primary flex-shrink-0" />
                      <span>
                        Vui lòng đọc kỹ các quy định sau đây. Việc mua vé đồng nghĩa với việc bạn đồng ý tuân thủ tất cả điều khoản của Ban tổ chức.
                      </span>
                    </div>

                    <ul className="list-decimal list-inside space-y-4 pl-1 text-zinc-400">
                      <li><strong>Đổi trả vé:</strong> Vé đã mua KHÔNG được đổi trả hoặc hoàn tiền trong mọi trường hợp, trừ khi sự kiện bị hủy bỏ hoàn toàn từ phía BTC.</li>
                      <li><strong>Kiểm soát an ninh:</strong> Khán giả vui lòng không mang chất cấm, vũ khí, vật liệu nổ, chai thủy tinh hoặc vật sắc nhọn vào địa điểm.</li>
                      <li><strong>QR Check-in:</strong> Mỗi mã vé QR chỉ có giá trị quét check-in một lần duy nhất. BTC không chịu trách nhiệm trong trường hợp mã QR bị lộ do sơ suất của khách hàng.</li>
                      <li><strong>Độ tuổi quy định:</strong> Tuân thủ độ tuổi quy định tối thiểu của sự kiện. Trẻ em cần có người lớn đi kèm (áp dụng cho từng hạng vé riêng).</li>
                      <li><strong>Thiết bị ghi hình:</strong> Các sự kiện hòa nhạc lớn có thể cấm sử dụng máy quay phim, chụp hình chuyên nghiệp. Thiết bị cá nhân di động được cho phép.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading">Câu hỏi thường gặp</h3>
                  {event.faqs && event.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {event.faqs.map((faq, idx) => (
                        <div key={idx} className="border border-white/5 rounded-2xl p-5 bg-bg-surface-elevated/50 text-left">
                          <p className="font-bold text-sm sm:text-base text-white mb-2 flex gap-2 font-heading">
                            <span className="text-brand-primary">Q:</span>
                            {faq.q}
                          </p>
                          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-5 flex gap-2 font-medium">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-550 italic">Danh sách câu hỏi đang được cập nhật.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Side purchase box (Col span 4 - Desktop only) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-bg-surface border border-white/5 rounded-3xl p-6.5 text-left space-y-6 shadow-2xl">
              <div>
                <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mb-1 font-heading">Sự kiện</p>
                <h4 className="font-extrabold text-lg text-white tracking-tight uppercase line-clamp-2 font-heading leading-tight">{event.title}</h4>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-400 border-t border-b border-white/5 py-5 font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Hạng vé rẻ nhất từ:</span>
                  <span className="text-sm sm:text-base text-brand-price font-bold font-heading">{formattedPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Trạng thái:</span>
                  <span className={isSoldOut ? "text-rose-500" : "text-emerald-400 font-bold uppercase tracking-wider text-[10px]"}>
                    {isSoldOut ? "Hết vé" : "Đang mở bán"}
                  </span>
                </div>
              </div>

              <Button
                variant={isSoldOut ? "secondary" : "gradient"}
                size="lg"
                fullWidth
                disabled={isSoldOut}
                onClick={handleCheckoutRedirect}
                className="font-heading uppercase text-xs tracking-wider font-bold py-3.5"
              >
                {isSoldOut ? "Đã hết vé" : "Đặt vé ngay"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sticky Bottom Action Bar for Mobile/Tablet */}
      <div className="fixed bottom-0 inset-x-0 z-35 lg:hidden bg-bg-secondary/95 backdrop-blur-md border-t border-white/5 px-6 py-4.5 flex items-center justify-between gap-4 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-baseline gap-1 text-left">
          <span className="text-xs font-bold text-zinc-400 font-heading">Vé từ</span>
          <span className="text-lg font-black text-brand-price tracking-tight font-heading">{formattedPrice}</span>
        </div>
        <Button
          variant={isSoldOut ? "secondary" : "gradient"}
          size="md"
          disabled={isSoldOut}
          onClick={handleCheckoutRedirect}
          className="px-6 font-bold font-heading uppercase text-xs tracking-wider py-3"
        >
          {isSoldOut ? "Hết vé" : "Đặt vé ngay"}
        </Button>
      </div>
    </div>
  );
};
