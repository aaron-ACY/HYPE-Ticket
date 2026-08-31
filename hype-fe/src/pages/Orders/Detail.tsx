import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  User, 
  Receipt, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Ticket, 
  Clock,
  Share2,
  Lock,
  Loader2,
  RefreshCcw,
  AlertTriangle,
  XCircle,
  Building2,
  CreditCard,
  Ban,
  CheckCircle2
} from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { getOrderById, requestRefund, cancelRefundRequest } from "../../data/orders";
import { QRCode } from "../../components/checkout/QRCode";
import { Button } from "../../components/common/Button";
import { RefundModal } from "../../components/orders/RefundModal";
import { useToast } from "../../context/ToastContext";
import { Order } from "../../types";

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  // 3D Card Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getOrderById(id);
      setOrder(found);
      if (found) {
        document.title = `Vé #${found.id} - ${found.eventTitle} | HYPETICKET`;
      }
    }
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 7;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2 font-heading uppercase">Không tìm thấy vé</h2>
        <p className="text-sm text-zinc-500 mb-6">Mã vé của bạn không khả dụng hoặc không chính xác.</p>
        <Link to="/orders">
          <Button variant="primary">Trở về trang vé của tôi</Button>
        </Link>
      </div>
    );
  }

  const handleDownload = async () => {
    const card = cardRef.current;
    if (!card || !order || isDownloading) return;

    try {
      setIsDownloading(true);
      showToast("Đang chuẩn bị xuất vé điện tử PDF...", "info");

      // Temporarily neutralize 3D transforms for razor-sharp 2D capture
      const originalTransform = card.style.transform;
      const originalTransition = card.style.transition;
      card.style.transform = "none";
      card.style.transition = "none";

      await new Promise((resolve) => setTimeout(resolve, 150));

      const imgData = await toPng(card, {
        pixelRatio: 2.5,
        backgroundColor: "#0D0D14",
        cacheBust: true,
      });

      // Restore interactive 3D transforms
      card.style.transform = originalTransform;
      card.style.transition = originalTransition;

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdfWidth = 120; // 120mm width
      const pdfHeight = (img.height * pdfWidth) / img.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`HYPETICKET-${order.id}.pdf`);

      showToast("Đã tải xuống vé PDF thành công!", "success");
    } catch (error) {
      console.error("Lỗi xuất vé PDF:", error);
      // Clean fallback using native print dialogue
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    if (order.status === "REFUNDED") {
      showToast("Mã vé này đã bị hủy do đã được hoàn tiền.", "error");
      return;
    }
    navigator.clipboard.writeText(order.id);
    setIsCopied(true);
    showToast("Đã sao chép mã vé vào clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Submit Refund Request
  const handleSubmitRefund = (refundData: {
    reason: string;
    reasonDetail?: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    quantity: number;
    refundAmount: number;
  }) => {
    const updated = requestRefund(order.id, refundData);
    if (updated) {
      setOrder(updated);
      showToast("Yêu cầu hoàn vé đã được gửi thành công! Đang chờ duyệt từ BTC.", "success");
    }
  };

  // Cancel Refund Request
  const handleCancelRefundRequest = () => {
    if (window.confirm("Bạn có chắc chắn muốn rút lại yêu cầu hoàn vé này không?")) {
      const updated = cancelRefundRequest(order.id);
      if (updated) {
        setOrder(updated);
        showToast("Đã rút lại yêu cầu hoàn vé thành công! Vé tiếp tục có hiệu lực.", "info");
      }
    }
  };

  const totalTickets = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(order.total);

  const mainTicketItem = order.items[0] || { ticketName: "STANDARD PASS", quantity: 1 };

  const isRefundPending = order.status === "REFUND_PENDING";
  const isRefunded = order.status === "REFUNDED";
  const isRejectedRefund = order.status === "REJECTED_REFUND";

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-left bg-bg-main min-h-[85vh]">
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Vé của tôi
      </Link>

      {/* Refund Pending Notice Banner */}
      {isRefundPending && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-amber-200 shadow-xl shadow-amber-950/20">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-300 uppercase tracking-wider font-tech text-sm block">
                  ⏳ YÊU CẦU HOÀN TIỀN ĐANG CHỜ PHÊ DUYỆT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 font-tech">
                  PENDING
                </span>
              </div>
              <p className="text-amber-200/90 leading-relaxed font-normal">
                Đơn yêu cầu hoàn <b>{order.refundRequest?.quantity} vé</b> (Số tiền: <b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.refundRequest?.refundAmount || order.total)}</b>) đã được gửi đến Ban Tổ Chức vào ngày <b>{order.refundRequest?.requestedAt ? new Date(order.refundRequest.requestedAt).toLocaleString("vi-VN") : "Gần đây"}</b>.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-amber-300/80 font-mono">
                <span>• Lý do: {order.refundRequest?.reason}</span>
                <span>• Nhận về: {order.refundRequest?.bankName} ({order.refundRequest?.accountNumber} - {order.refundRequest?.accountHolder})</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancelRefundRequest}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Rút Lại Yêu Cầu</span>
          </button>
        </div>
      )}

      {/* Refunded Notice Banner */}
      {isRefunded && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3.5 text-xs text-rose-200 shadow-xl shadow-rose-950/20">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
            <Ban className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-rose-300 uppercase tracking-wider font-tech text-sm block">
                🔴 ĐƠN VÉ ĐÃ ĐƯỢC HOÀN TIỀN & VÔ HIỆU HÓA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-300 font-tech">
                REFUNDED
              </span>
            </div>
            <p className="text-rose-200/90 leading-relaxed font-normal">
              Đơn vé này đã được Ban Tổ Chức phê duyệt hoàn tiền. Mã QR check-in đã được hủy bỏ và không thể sử dụng để vào cổng sự kiện.
            </p>
            {order.refundRequest && (
              <p className="text-[11px] text-rose-300/80 font-mono pt-0.5">
                • Tiền hoàn đã được chuyển về tài khoản: {order.refundRequest.bankName} - {order.refundRequest.accountNumber} ({order.refundRequest.accountHolder})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Rejected Refund Notice Banner */}
      {isRejectedRefund && (
        <div className="mb-8 p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-zinc-300 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="font-black text-white uppercase tracking-wider font-tech text-sm block">
                ⚠️ YÊU CẦU HOÀN VÉ BỊ TỪ CHỐI
              </span>
              <p className="text-zinc-400 leading-relaxed font-normal">
                Yêu cầu hoàn vé trước đó chưa được chấp thuận do: <b>{order.refundRequest?.rejectionReason || "Không đáp ứng đủ điều kiện theo chính sách sự kiện"}</b>. Vé của bạn vẫn giữ nguyên giá trị sử dụng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRefundModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Gửi Lại Yêu Cầu</span>
          </button>
        </div>
      )}

      {/* Sample Pass Informative Banner */}
      {order.isSample && !isRefundPending && !isRefunded && (
        <div className="mb-8 p-4.5 rounded-2xl bg-amber-950/30 border border-amber-500/35 flex items-start sm:items-center gap-3.5 text-xs text-amber-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 uppercase tracking-wider font-tech block">
              VÉ MẪU TRẢI NGHIỆM // DEMO BOARDING PASS
            </span>
            <p className="text-amber-200/80 leading-relaxed font-normal">
              Đây là vé mô phỏng sau khi thanh toán thành công để bạn trải nghiệm định dạng vé điện tử chuẩn quốc tế, mã QR check-in, quy trình hoàn/hủy vé và tính năng xuất file PDF của HYPETICKET.
            </p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4.5xl font-black text-white uppercase tracking-tight font-heading">
            Chi Tiết Vé Điện Tử
          </h1>
          <p className="text-sm text-zinc-500 font-semibold mt-1">
            Xuất trình mã QR tại cửa sự kiện để làm thủ tục check-in trực tiếp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nút yêu cầu hoàn/hủy vé */}
          {!isRefunded && !isRefundPending && (
            <button
              onClick={() => setIsRefundModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-sm"
              title="Yêu cầu hoàn vé / Hủy vé"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Hoàn / Hủy Vé</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            disabled={isRefunded}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{isCopied ? "Đã sao chép" : "Sao chép mã"}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading || isRefunded}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E2E8F0] text-xs font-bold text-[#050507] transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xuất PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải PDF Vé</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Realistic Festival Boarding Pass (Col span 7) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Interactive 3D Perspective Wrapper */}
          <div 
            className="w-full max-w-[560px]"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
                transformStyle: "preserve-3d",
              }}
              className={`relative rounded-2xl bg-[#0D0D14] border shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden select-none transition-colors ${
                isRefunded 
                  ? "border-rose-900/50 opacity-80" 
                  : isRefundPending 
                  ? "border-amber-500/40 shadow-amber-950/30" 
                  : "border-[#242432]"
              }`}
            >
              {/* Dynamic Refractive Glare Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
                style={{
                  opacity: isHovered ? 0.15 : 0,
                  background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
                }}
              />

              {/* 1. TICKET TOP: Event Visual Header */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-950">
                <img
                  crossOrigin="anonymous"
                  src={order.eventImage}
                  alt={order.eventTitle}
                  className={`w-full h-full object-cover brightness-[0.75] ${isRefunded ? "grayscale contrast-125" : ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-[#0D0D14]/60 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest font-tech flex items-center gap-1.5">
                      <Ticket className="w-3 h-3 text-white" />
                      HYPETICKET PASS
                    </span>
                    {order.isSample && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black font-tech tracking-wider">
                        SAMPLE
                      </span>
                    )}
                  </div>

                  {/* Status Tag */}
                  {isRefunded ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500/50 text-[9px] font-bold text-rose-300 font-tech flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      ĐÃ HỦY // VOID
                    </span>
                  ) : isRefundPending ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 text-[9px] font-bold text-amber-300 font-tech flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      CHỜ HOÀN TIỀN
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 font-tech flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      HỢP LỆ // READY
                    </span>
                  )}
                </div>

                {/* Event Title on Banner */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-10 text-left">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-tech block mb-1">
                    OFFICIAL CONCERT PASS
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-heading leading-tight line-clamp-2">
                    {order.eventTitle}
                  </h2>
                </div>
              </div>

              {/* 2. TICKET BODY: Metadata Grid */}
              <div className="p-6 sm:p-7 space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-tech flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      NGÀY SỰ KIỆN
                    </span>
                    <p className="font-extrabold text-sm sm:text-base text-white uppercase font-heading">
                      {order.eventDate}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">19:30 (Mở cửa 17:00)</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-tech flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      ĐỊA ĐIỂM
                    </span>
                    <p className="font-extrabold text-sm sm:text-base text-white uppercase font-heading line-clamp-1">
                      {order.eventLocation}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">L-Acoustics Arena</p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-tech">
                      HẠNG VÉ
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-black text-xs font-heading uppercase tracking-wide border border-white/15">
                        {mainTicketItem.ticketName}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold">× {totalTickets}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-tech flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-400" />
                      CHỦ VÉ
                    </span>
                    <p className="font-extrabold text-sm text-white uppercase font-heading truncate">
                      {order.customerName}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. PHYSICAL TICKET PERFORATION & NOTCH CUTOUTS (Seamless Inset) */}
              <div className="relative w-full my-0 flex items-center">
                <div className="w-3.5 h-6 rounded-r-full bg-[#050508] border-y border-r border-[#242432] flex-shrink-0" />
                <div className="flex-1 border-t border-dashed border-white/20 mx-2" />
                <div className="w-3.5 h-6 rounded-l-full bg-[#050508] border-y border-l border-[#242432] flex-shrink-0" />
              </div>

              {/* 4. TICKET STUB: Futuristic QR Code & Security Area */}
              <div className="p-6 sm:p-7 bg-[#09090E] flex flex-col items-center text-center space-y-4 relative">
                {/* QR Code Container */}
                <div className="relative p-3.5 bg-white rounded-2xl shadow-xl inline-block overflow-hidden">
                  <QRCode value={order.id} size={135} />
                  
                  {/* Overlay Void Stamp if Refunded */}
                  {isRefunded && (
                    <div className="absolute inset-0 bg-red-950/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center select-none">
                      <Ban className="w-8 h-8 text-rose-400 mb-1" />
                      <span className="text-xs font-black text-rose-300 uppercase tracking-widest font-tech border-y border-rose-400/50 py-0.5">
                        ĐÃ HỦY VÉ
                      </span>
                      <span className="text-[8px] text-rose-300 font-mono mt-0.5">
                        VOID / REFUNDED
                      </span>
                    </div>
                  )}
                </div>

                {/* Token ID and Verification */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-tech">
                    {isRefunded ? "MÃ VÉ ĐÃ VÔ HIỆU HÓA" : "MÃ CHECK-IN ĐIỆN TỬ"}
                  </span>
                  <div 
                    onClick={handleCopyCode}
                    className={`flex items-center justify-center gap-2 ${isRefunded ? "cursor-not-allowed opacity-50" : "cursor-pointer group"}`}
                    title={isRefunded ? "Mã vé đã bị vô hiệu hóa" : "Bấm để sao chép mã"}
                  >
                    <p className={`text-base sm:text-lg font-mono font-black tracking-widest ${isRefunded ? "line-through text-rose-400" : "text-white group-hover:text-zinc-300 transition-colors"}`}>
                      {order.id}
                    </p>
                    {!isRefunded && <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />}
                  </div>
                </div>

                {/* Simulated Barcode Aesthetic */}
                <div className="w-full pt-2 flex flex-col items-center gap-1.5 opacity-60">
                  <div className="flex items-center justify-center gap-1 h-7">
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-2.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 tracking-[0.2em]">
                    {isRefunded ? "TRANSACTION REVERSED • TICKET VOIDED" : "SECURE PROTOCOL • HYPETICKET ENCRYPTED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Transaction billing & Buyer info details (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Buyer Info */}
          <section className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-left">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2.5 font-heading">
              <User className="w-4 h-4 text-white" />
              Thông Tin Khách Hàng
            </h4>
            
            <div className="space-y-3.5 text-xs text-zinc-300 font-bold">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Họ tên:</span>
                <span className="text-white">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Số điện thoại:</span>
                <span className="text-white">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Email:</span>
                <span className="truncate max-w-[200px] text-zinc-300">{order.customerEmail}</span>
              </div>
            </div>
          </section>

          {/* Billing Info */}
          <section className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-left">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2.5 font-heading">
              <Receipt className="w-4 h-4 text-white" />
              Chi Tiết Thanh Toán
            </h4>

            <div className="space-y-3.5 text-xs text-zinc-300 font-bold">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Mã đơn hàng:</span>
                <span className="font-mono text-white">{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Trạng thái vé:</span>
                {isRefunded ? (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                    Đã hoàn tiền / Đã hủy
                  </span>
                ) : isRefundPending ? (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Đang chờ duyệt hoàn vé
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Đã thanh toán (Hợp lệ)
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Cổng thanh toán:</span>
                <span className="text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium font-heading">Ngày giao dịch:</span>
                <span className="text-white">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-sm font-black text-white font-heading">
                <span>Tổng tiền thanh toán:</span>
                <span className="text-white text-base font-black">{formattedTotal}</span>
              </div>
            </div>
          </section>

          {/* Refund policy quick section */}
          <section className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-left">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center justify-between font-heading">
              <span className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-amber-400" />
                Chính Sách Hoàn / Hủy Vé
              </span>
              <Link to="/policies#refund-policy" className="text-[11px] text-brand-primary hover:underline font-bold">
                Xem điều khoản
              </Link>
            </h4>

            <div className="space-y-3 text-xs text-zinc-400 font-medium leading-relaxed">
              <p>
                • Bạn có thể gửi yêu cầu hoàn tiền nếu sự kiện có hỗ trợ chính sách hoàn hoặc gặp sự cố bất khả kháng.
              </p>
              <p>
                • Thời gian xử lý kiểm duyệt: từ <b>24h đến 48h</b> làm việc.
              </p>

              {!isRefunded && !isRefundPending && (
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(true)}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-xs font-bold text-white hover:text-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gửi Yêu Cầu Hoàn / Hủy Vé Này</span>
                </button>
              )}
            </div>
          </section>

          {/* Safety terms display */}
          <div className="flex gap-3 p-4.5 border border-white/5 bg-white/[0.02] rounded-2xl text-xs text-zinc-400 leading-relaxed font-semibold items-center text-left shadow-md">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Mã vé điện tử đã được xác thực an toàn. Bạn có thể lưu vé về máy hoặc xuất trình trực tiếp trên điện thoại tại quầy check-in sự kiện.</span>
          </div>
        </div>
      </div>

      {/* Modal Popup Yêu Cầu Hoàn Vé */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        order={order}
        onSubmit={handleSubmitRefund}
      />
    </div>
  );
};
