import React, { useState, useEffect, useRef } from "react";
import {
  Ticket,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ScanLine,
  Calendar,
  Clock,
  MapPin,
  Camera,
  CameraOff,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import jsQR from "jsqr";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";

interface EventShow {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  totalTickets: number;
  checkedInCount: number;
  status: "HAPPENING_TODAY" | "UPCOMING" | "ENDED";
  tiers: {
    name: string;
    price: string;
    sold: number;
    total: number;
    checkedIn: number;
  }[];
}

interface CheckInRecord {
  id: string;
  code: string;
  holderName: string;
  phone: string;
  tier: string;
  seat: string;
  checkInTime: string;
  method: "QR_SCAN" | "MANUAL_CODE";
  status: "VALID" | "ALREADY_USED" | "INVALID_EVENT";
}

export const OrganizerTickets: React.FC = () => {
  const { showToast } = useToast();

  const [eventsList] = useState<EventShow[]>([
    {
      id: "ev-1",
      title: "HYPE FEST 2026 - Neon Beats in the Dark",
      date: "20/09/2026",
      time: "19:00 - 23:30",
      venue: "Nhà Văn Hóa Thanh Niên, Quận 1, TP.HCM",
      totalTickets: 2000,
      checkedInCount: 1420,
      status: "HAPPENING_TODAY",
      tiers: [
        { name: "Early Bird Zone", price: "250,000 đ", sold: 500, total: 500, checkedIn: 480 },
        { name: "General Admission (GA)", price: "450,000 đ", sold: 1300, total: 1300, checkedIn: 810 },
        { name: "VIP Lounge Pass", price: "1,200,000 đ", sold: 200, total: 200, checkedIn: 130 },
      ],
    },
    {
      id: "ev-2",
      title: "Cyber Sound Arena - Electric Symphony Live",
      date: "15/10/2026",
      time: "18:00 - 22:00",
      venue: "Trung tâm Hội chợ SECC, Quận 7, TP.HCM",
      totalTickets: 1500,
      checkedInCount: 0,
      status: "UPCOMING",
      tiers: [
        { name: "Standard GA", price: "500,000 đ", sold: 890, total: 1200, checkedIn: 0 },
        { name: "VVIP Front Row", price: "1,800,000 đ", sold: 300, total: 300, checkedIn: 0 },
      ],
    },
    {
      id: "ev-3",
      title: "Indie Sunset Acoustic Night Vol. 4",
      date: "05/08/2026",
      time: "20:00 - 22:30",
      venue: "The Factory Contemporary Arts Centre",
      totalTickets: 300,
      checkedInCount: 300,
      status: "ENDED",
      tiers: [
        { name: "All Access Pass", price: "250,000 đ", sold: 300, total: 300, checkedIn: 300 },
      ],
    },
  ]);

  const [selectedEventId, setSelectedEventId] = useState<string>("ev-1");
  const currentEvent = eventsList.find((e) => e.id === selectedEventId) || eventsList[0];

  // Camera & Stream State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showManualFallback, setShowManualFallback] = useState<boolean>(false);
  const [ticketCodeInput, setTicketCodeInput] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isScanningRef = useRef<boolean>(true);
  const lastScannedCodeRef = useRef<string>("");
  const lastScannedTimeRef = useRef<number>(0);

  const [lastResult, setLastResult] = useState<CheckInRecord | null>({
    id: "CK-INIT",
    code: "HYPE-VIP-9921",
    holderName: "Nguyễn Hoàng Nam",
    phone: "0908***890",
    tier: "VIP Lounge Pass",
    seat: "VIP-A12",
    checkInTime: "19:45:10",
    method: "QR_SCAN",
    status: "VALID",
  });

  const [recentFeed, setRecentFeed] = useState<CheckInRecord[]>([
    {
      id: "CK-01",
      code: "HYPE-VIP-9921",
      holderName: "Nguyễn Hoàng Nam",
      phone: "0908***890",
      tier: "VIP Lounge Pass",
      seat: "VIP-A12",
      checkInTime: "19:45:10",
      method: "QR_SCAN",
      status: "VALID",
    },
    {
      id: "CK-02",
      code: "HYPE-GA-4402",
      holderName: "Trần Minh Thư",
      phone: "0912***456",
      tier: "General Admission (GA)",
      seat: "Zone-B",
      checkInTime: "19:44:22",
      method: "QR_SCAN",
      status: "VALID",
    },
    {
      id: "CK-03",
      code: "HYPE-EB-0199",
      holderName: "Lê Quốc Bảo",
      phone: "0988***112",
      tier: "Early Bird Zone",
      seat: "Zone-A",
      checkInTime: "19:42:05",
      method: "MANUAL_CODE",
      status: "VALID",
    },
  ]);

  // Khởi chạy camera thực tế từ thiết bị (Laptop / Điện thoại)
  useEffect(() => {
    let animationFrameId: number;

    const startCamera = async () => {
      if (!isCameraActive) return;
      setCameraError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Ưu tiên camera sau trên điện thoại
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Bắt đầu vòng lặp giải mã mã QR từ hình ảnh camera thực tế
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const scanLoop = () => {
          if (
            isScanningRef.current &&
            videoRef.current &&
            videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
            ctx
          ) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (qrCode && qrCode.data) {
              const now = Date.now();
              // Chống quét trùng liên tục trong 3 giây
              if (
                qrCode.data !== lastScannedCodeRef.current ||
                now - lastScannedTimeRef.current > 3000
              ) {
                lastScannedCodeRef.current = qrCode.data;
                lastScannedTimeRef.current = now;
                processCheckIn(qrCode.data.trim().toUpperCase(), "QR_SCAN");
              }
            }
          }

          if (isCameraActive) {
            animationFrameId = requestAnimationFrame(scanLoop);
          }
        };

        animationFrameId = requestAnimationFrame(scanLoop);
      } catch (err: any) {
        console.warn("Không thể truy cập camera thực:", err);
        setCameraError(
          err.name === "NotAllowedError"
            ? "Trình duyệt chưa được cấp quyền truy cập Camera. Vui lòng bật quyền Camera."
            : "Không tìm thấy thiết bị Camera khả dụng trên máy."
        );
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  const processCheckIn = (code: string, method: "QR_SCAN" | "MANUAL_CODE") => {
    const timeStr = new Date().toLocaleTimeString("vi-VN");

    if (code.includes("USED") || code === "HYPE-VIP-8891") {
      const result: CheckInRecord = {
        id: `CK-${Date.now()}`,
        code,
        holderName: "Nguyễn Hoàng Nam",
        phone: "0908***890",
        tier: "VIP Lounge Pass",
        seat: "VIP-A12",
        checkInTime: timeStr,
        method,
        status: "ALREADY_USED",
      };
      setLastResult(result);
      showToast(`⚠️ CẢNH BÁO: Vé [${code}] ĐÃ ĐƯỢC CHECK-IN TRƯỚC ĐÓ!`, "error");
      return;
    }

    if (code.includes("WRONG") || code.length < 5) {
      const result: CheckInRecord = {
        id: `CK-${Date.now()}`,
        code,
        holderName: "Không xác định",
        phone: "---",
        tier: "---",
        seat: "---",
        checkInTime: timeStr,
        method,
        status: "INVALID_EVENT",
      };
      setLastResult(result);
      showToast(`❌ Mã vé [${code}] không hợp lệ hoặc không thuộc show này!`, "error");
      return;
    }

    const tiers = currentEvent.tiers;
    const tierName = tiers[Math.floor(Math.random() * tiers.length)].name;
    const sampleNames = ["Phạm Nhật Minh", "Võ Thị Quỳnh Anh", "Đặng Tuấn Kiệt", "Bùi Mai Phương"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    const result: CheckInRecord = {
      id: `CK-${Date.now()}`,
      code,
      holderName: randomName,
      phone: "09" + Math.floor(10000000 + Math.random() * 90000000),
      tier: tierName,
      seat: tierName.includes("VIP") ? "Ghế VIP-A08" : "Khán đài GA",
      checkInTime: timeStr,
      method,
      status: "VALID",
    };

    setLastResult(result);
    setRecentFeed((prev) => [result, ...prev.slice(0, 9)]);
    showToast(`✓ CHECK-IN THÀNH CÔNG: [${code}] - ${result.tier}`, "success");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCodeInput.trim()) {
      showToast("Vui lòng nhập mã vé", "error");
      return;
    }
    processCheckIn(ticketCodeInput.trim().toUpperCase(), "MANUAL_CODE");
    setTicketCodeInput("");
  };

  const fillRate = ((currentEvent.checkedInCount / currentEvent.totalTickets) * 100).toFixed(0);

  return (
    <OrganizerLayout
      title="Cổng Soát Vé & Quét Mã QR"
      subtitle="Quản lý các hạng vé, kiểm tra đối soát và quét mã QR vé của khán giả tại cổng sự kiện"
    >
      <div className="space-y-6">
        {/* 1. KHỐI CHỌN SỰ KIỆN SOÁT VÉ */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block font-heading">
                  Sự Kiện Soát Vé Tại Cổng:
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                  {currentEvent.title}
                </h3>
              </div>
            </div>

            <div className="w-full sm:w-80">
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Chuyển đổi show diễn:
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setLastResult(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {eventsList.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-3 mt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentEvent.date} ({currentEvent.time})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentEvent.venue}
            </span>
            <span className="ml-auto text-indigo-600 font-bold font-mono">
              Đã vào cổng: {currentEvent.checkedInCount} / {currentEvent.totalTickets} ({fillRate}%)
            </span>
          </div>
        </div>

        {/* 2. KHỐI SOÁT VÉ VÀ THỐNG KÊ (2 CỘT) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI (2 COLS): MÁY QUÉT QR & NHẬP MÃ THỦ CÔNG & KẾT QUẢ */}
          <div className="lg:col-span-2 space-y-6">
            {/* THẺ CAMERA QUÉT MÃ QR TRỰC TIẾP */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
              {/* Header của thẻ */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide">
                    Camera Quét Mã QR Trực Tiếp
                  </h3>
                </div>

                <div>
                  <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border shadow-sm ${
                      isCameraActive
                        ? "bg-slate-50 text-slate-700 border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                        : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isCameraActive ? (
                      <>
                        <CameraOff className="w-4 h-4 text-rose-500" />
                        <span>Tắt Camera</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-white" />
                        <span>Bật Camera</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KHUNG QUÉT MÃ QR DỌC CÂN ĐỐI VỚI VIDEO CAMERA THỰC TẾ */}
              {isCameraActive ? (
                <div className="space-y-4">
                  {/* Camera Viewport Box (Video stream thật từ Laptop/Phone) */}
                  <div className="relative w-full max-w-sm mx-auto h-72 sm:h-80 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 flex flex-col items-center justify-center overflow-hidden shadow-2xl p-4">
                    {/* Real Video Element */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Lớp phủ tối nhẹ để làm nổi bật khung căn chỉnh */}
                    <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                    {/* Tia laser quét Cyan mượt mà */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-bounce z-10 pointer-events-none" />

                    {/* Khung căn chỉnh QR Holographic */}
                    <div className="w-44 sm:w-48 h-48 sm:h-52 relative flex flex-col items-center justify-center border border-cyan-400/50 rounded-2xl bg-cyan-500/[0.04] z-10 pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-cyan-400 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-cyan-400 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-cyan-400 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-cyan-400 rounded-br-lg" />

                      {cameraError ? (
                        <div className="p-3 text-center">
                          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                          <p className="text-[10px] text-amber-200 font-bold leading-tight">
                            {cameraError}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <QrCode className="w-12 h-12 text-cyan-400/40 animate-pulse mx-auto" />
                          <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-wider block mt-2 px-1">
                            ĐẶT MÃ QR VÀO KHUNG
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 inset-x-2 text-center z-10 bg-black/40 backdrop-blur-xs py-1 rounded-lg">
                      <p className="text-[10px] text-slate-300 font-medium">
                        {cameraError
                          ? "Sử dụng các nút bên dưới để quét thử nghiệm"
                          : "Đang tự động nhận diện & giải mã mã QR từ camera..."}
                      </p>
                    </div>
                  </div>

                  {/* Thanh nút công cụ kiểm thử nhanh nằm gọn gàng bên dưới, không đè lên khung quét */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 font-heading">
                      Thử nghiệm nhanh:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => processCheckIn(`HYPE-VIP-${Math.floor(1000 + Math.random() * 9000)}`, "QR_SCAN")}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1 font-heading"
                      >
                        <ScanLine className="w-3 h-3" />
                        Quét Vé Mẫu (Hợp Lệ)
                      </button>
                      <button
                        onClick={() => processCheckIn("HYPE-VIP-8891-USED", "QR_SCAN")}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 font-heading"
                      >
                        Thử Vé Đã Dùng
                      </button>
                      <button
                        onClick={() => processCheckIn("WRONG-SHOW-999", "QR_SCAN")}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 font-heading"
                      >
                        Thử Sai Show
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-56 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Camera className="w-9 h-9 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">Camera quét QR đang tạm tắt</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCameraActive(true)}
                    className="bg-indigo-600 text-white font-bold"
                  >
                    Bật Lại Camera
                  </Button>
                </div>
              )}

              {/* COLLAPSIBLE: NHẬP MÃ VÉ THỦ CÔNG KHI QR BỊ MỜ */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManualFallback(!showManualFallback)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-indigo-600" />
                  <span>Mã QR bị mờ hoặc không đọc được? Nhập mã vé thủ công</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showManualFallback ? "rotate-180" : ""}`} />
                </button>

                {showManualFallback && (
                  <form onSubmit={handleManualSubmit} className="mt-3 flex flex-col sm:flex-row gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nhập mã vé in trên vé (VD: HYPE-VIP-9921)"
                        value={ticketCodeInput}
                        onChange={(e) => setTicketCodeInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 shadow-sm"
                    >
                      Xác Nhận Check-in
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* KẾT QUẢ CHECK-IN THỜI GIAN THỰC */}
            {lastResult && (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  lastResult.status === "VALID"
                    ? "bg-emerald-50 border-emerald-300"
                    : lastResult.status === "ALREADY_USED"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-rose-50 border-rose-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${
                        lastResult.status === "VALID"
                          ? "bg-emerald-600"
                          : lastResult.status === "ALREADY_USED"
                          ? "bg-amber-600"
                          : "bg-rose-600"
                      }`}
                    >
                      {lastResult.status === "VALID" ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : lastResult.status === "ALREADY_USED" ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            lastResult.status === "VALID"
                              ? "bg-emerald-100 text-emerald-800"
                              : lastResult.status === "ALREADY_USED"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {lastResult.status === "VALID"
                            ? "✓ VÉ HỢP LỆ - MỜI VÀO CỔNG"
                            : lastResult.status === "ALREADY_USED"
                            ? "⚠️ VÉ ĐÃ SỬ DỤNG TRƯỚC ĐÓ"
                            : "❌ VÉ KHÔNG HỢP LỆ / SAI SHOW"}
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          [{lastResult.code}]
                        </span>
                      </div>

                      {lastResult.status === "VALID" && (
                        <p className="text-xs text-slate-800 font-semibold">
                          Khán giả: <strong className="text-slate-900">{lastResult.holderName}</strong> • Hạng vé:{" "}
                          <strong className="text-indigo-600">{lastResult.tier}</strong> • Vị trí:{" "}
                          <strong className="text-slate-900">{lastResult.seat}</strong>
                        </p>
                      )}

                      {lastResult.status === "ALREADY_USED" && (
                        <p className="text-xs text-amber-900 font-semibold">
                          Vé này đã được quét vào cổng lúc <strong>19:30</strong> trước đó.
                        </p>
                      )}

                      {lastResult.status === "INVALID_EVENT" && (
                        <p className="text-xs text-rose-900 font-semibold">
                          Mã vé không tồn tại hoặc thuộc sự kiện khác.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-600 block">
                      {lastResult.checkInTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {lastResult.method === "QR_SCAN" ? "Camera QR" : "Nhập Mã Tay"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE FEED: LỊCH SỬ CHECK-IN CỔNG GẦN NHẤT */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Lịch Sử Check-in Cổng Gần Nhất (Live Feed):
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Tự động cập nhật</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {recentFeed.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-mono">{item.code}</strong>
                          <span className="text-slate-500 font-semibold">({item.tier})</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {item.holderName} • {item.seat}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-600 font-bold">{item.checkInTime}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {item.method === "QR_SCAN" ? "Camera QR" : "Mã tay"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (1 COL): TIẾN ĐỘ VÀO CỔNG THEO HẠNG VÉ */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-sm h-fit">
            <h3 className="text-base font-black text-slate-900 uppercase font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
              <Ticket className="w-4 h-4 text-indigo-600" />
              Tiến Độ Vào Cổng Theo Hạng Vé
            </h3>

            <div className="space-y-4">
              {currentEvent.tiers.map((tier, idx) => {
                const tierRate = ((tier.checkedIn / tier.sold) * 100).toFixed(0);

                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900 font-heading">{tier.name}</strong>
                      <span className="text-xs text-indigo-600 font-mono font-bold">{tier.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Vé đã bán: <strong className="text-slate-900">{tier.sold} vé</strong>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Đã vào: {tier.checkedIn} ({tierRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${tierRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};
