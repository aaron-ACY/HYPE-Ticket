import React, { useState } from "react";
import {
  Ticket,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Mail,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  Download,
  Eye,
  RefreshCcw,
  Send,
  AlertCircle,
  X,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

interface TicketItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventName: string;
  ticketTier: string;
  seatInfo: string;
  gate: string;
  price: string;
  paymentGateway: "VNPAY" | "MOMO" | "VISA" | "ZALOPAY";
  purchaseDate: string;
  checkInStatus: "CHECKED_IN" | "UNUSED" | "REFUNDED";
  checkInTime?: string;
}

export const AdminTickets: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<string>("ALL");
  const [activeTicketModal, setActiveTicketModal] = useState<TicketItem | null>(null);

  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: "HYP-TKT-9921",
      orderId: "ORD-8821",
      customerName: "Nguyễn Hoàng Nam",
      customerEmail: "nam.nguyen@gmail.com",
      customerPhone: "0901234567",
      eventName: "HYPE FEST 2026 - Neon Beats in the Dark",
      ticketTier: "VIP Super Fan",
      seatInfo: "Khu A - Hàng 02 - Ghế 15",
      gate: "Cổng VIP Gate 1",
      price: "1,500,000 đ",
      paymentGateway: "VNPAY",
      purchaseDate: "15/08/2026 14:30",
      checkInStatus: "CHECKED_IN",
      checkInTime: "20/09/2026 18:45",
    },
    {
      id: "HYP-TKT-9922",
      orderId: "ORD-8822",
      customerName: "Trần Bảo Ngọc",
      customerEmail: "baongoc.tran@gmail.com",
      customerPhone: "0912345678",
      eventName: "Cyber Sound Arena - Electric Symphony Live",
      ticketTier: "GA General Standing",
      seatInfo: "Khu B Standing",
      gate: "Cổng Chính Gate A",
      price: "450,000 đ",
      paymentGateway: "MOMO",
      purchaseDate: "18/08/2026 09:15",
      checkInStatus: "UNUSED",
    },
    {
      id: "HYP-TKT-9923",
      orderId: "ORD-8823",
      customerName: "Lê Minh Trí",
      customerEmail: "minhtri.le@gmail.com",
      customerPhone: "0987654321",
      eventName: "HYPE FEST 2026 - Neon Beats in the Dark",
      ticketTier: "Standard Early Bird",
      seatInfo: "Khu C - Tự do",
      gate: "Cổng Phụ Gate B",
      price: "350,000 đ",
      paymentGateway: "VISA",
      purchaseDate: "20/08/2026 21:00",
      checkInStatus: "UNUSED",
    },
    {
      id: "HYP-TKT-9924",
      orderId: "ORD-8824",
      customerName: "Phạm Thảo Vy",
      customerEmail: "thaovy.pham@gmail.com",
      customerPhone: "0934567890",
      eventName: "Indie Sunset Acoustic Night Vol. 4",
      ticketTier: "Acoustic VIP Sofa",
      seatInfo: "Bàn VIP 04",
      gate: "Cổng Vào Hồ Tây",
      price: "500,000 đ",
      paymentGateway: "ZALOPAY",
      purchaseDate: "10/08/2026 16:20",
      checkInStatus: "CHECKED_IN",
      checkInTime: "05/08/2026 19:10",
    },
    {
      id: "HYP-TKT-9925",
      orderId: "ORD-8825",
      customerName: "Đặng Quang Huy",
      customerEmail: "quanghuy.dang@gmail.com",
      customerPhone: "0977889900",
      eventName: "Saigon Classical Symphony - Autumn Romance",
      ticketTier: "Standard Seat",
      seatInfo: "Hàng D - Ghế 08",
      gate: "Cửa 2 Nhà Hát",
      price: "300,000 đ",
      paymentGateway: "VNPAY",
      purchaseDate: "12/08/2026 11:45",
      checkInStatus: "REFUNDED",
    },
  ]);

  // Handlers
  const handleManualCheckIn = (ticketId: string) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          showToast(`Đã Check-in thủ công vé ${ticketId} thành công!`, "success");
          return {
            ...t,
            checkInStatus: "CHECKED_IN",
            checkInTime: new Date().toLocaleTimeString("vi-VN") + " hôm nay",
          };
        }
        return t;
      })
    );
    if (activeTicketModal?.id === ticketId) {
      setActiveTicketModal((prev) =>
        prev
          ? {
              ...prev,
              checkInStatus: "CHECKED_IN",
              checkInTime: new Date().toLocaleTimeString("vi-VN") + " hôm nay",
            }
          : null
      );
    }
  };

  const handleRefund = (ticketId: string) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          showToast(`Đã hoàn tiền và hủy hiệu lực vé ${ticketId}!`, "info");
          return {
            ...t,
            checkInStatus: "REFUNDED",
          };
        }
        return t;
      })
    );
    if (activeTicketModal?.id === ticketId) {
      setActiveTicketModal((prev) => (prev ? { ...prev, checkInStatus: "REFUNDED" } : null));
    }
  };

  const handleResendEmail = (ticket: TicketItem) => {
    showToast(`Đã gửi lại vé điện tử & mã QR tới ${ticket.customerEmail}!`, "success");
  };

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchStatus = filterStatus === "ALL" || t.checkInStatus === filterStatus;
    const matchEvent = selectedEvent === "ALL" || t.eventName === selectedEvent;
    const matchSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerPhone.includes(searchQuery);

    return matchStatus && matchEvent && matchSearch;
  });

  const totalTicketsCount = 5820;
  const checkedInCount = tickets.filter((t) => t.checkInStatus === "CHECKED_IN").length;
  const unusedCount = tickets.filter((t) => t.checkInStatus === "UNUSED").length;

  return (
    <AdminLayout
      title="Quản Lý Vé & Đơn Đặt Vé"
      subtitle="Theo dõi toàn bộ vé phát hành, mã QR soát vé, trạng thái check-in và đối soát giao dịch"
    >
      <div className="space-y-8">
        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng Vé Đã Bán
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Ticket className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                5,820 vé
              </p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Doanh số: 1.45 tỷ đ</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Đã Check-in Tại Cổng
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                4,820 vé
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Tỷ lệ có mặt: 82.8%</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Vé Chưa Check-in
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                980 vé
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Sẵn sàng cổng quét</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Vé Đã Hoàn / Hủy
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <RefreshCcw className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                20 vé
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Tổng tiền: 6.2M đ</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm theo Mã vé, Mã đơn, Tên khách, Email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-50 border border-slate-200 rounded-xl">
            {[
              { key: "ALL", label: "Tất cả" },
              { key: "CHECKED_IN", label: "Đã Check-in" },
              { key: "UNUSED", label: "Chưa sử dụng" },
              { key: "REFUNDED", label: "Đã hoàn vé" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === tab.key
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast("Đang xuất danh sách vé ra file Excel...", "info")}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>

        {/* Tickets Table */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                  <th className="py-3.5 px-5">Mã Vé & Đơn</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Sự Kiện & Loại Vé</th>
                  <th className="py-3.5 px-4">Giá & Cổng TT</th>
                  <th className="py-3.5 px-4">Trạng Thái Check-in</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket & Order Code */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 font-mono text-xs">{t.id}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{t.orderId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{t.customerName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {t.customerEmail}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {t.customerPhone}
                      </p>
                    </td>

                    {/* Event & Tier */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate font-heading">{t.eventName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {t.ticketTier}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">{t.seatInfo}</span>
                      </div>
                    </td>

                    {/* Price & Gateway */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-extrabold text-slate-900">{t.price}</p>
                      <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">
                        {t.paymentGateway}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {t.checkInStatus === "CHECKED_IN" && (
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã Check-in
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{t.checkInTime}</span>
                        </div>
                      )}
                      {t.checkInStatus === "UNUSED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Chưa sử dụng
                        </span>
                      )}
                      {t.checkInStatus === "REFUNDED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                          <RefreshCcw className="w-3 h-3" />
                          Đã hoàn tiền
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View e-Ticket Modal */}
                        <button
                          onClick={() => setActiveTicketModal(t)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                          title="Xem vé điện tử & QR"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>

                        {/* Manual Check-in if unused */}
                        {t.checkInStatus === "UNUSED" && (
                          <button
                            onClick={() => handleManualCheckIn(t.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                            title="Quét Check-in thủ công tại cổng"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Check-in</span>
                          </button>
                        )}

                        {/* Resend Email */}
                        <button
                          onClick={() => handleResendEmail(t)}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                          title="Gửi lại mã vé qua Email khách"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E-Ticket Inspection Modal */}
        {activeTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
              <button
                onClick={() => setActiveTicketModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Vé Điện Tử Hợp Lệ
                </span>
                <h3 className="text-xl font-black text-slate-900 font-heading mt-2">
                  {activeTicketModal.eventName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Mã vé: {activeTicketModal.id}</p>
              </div>

              {/* QR Code Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  {/* Visual QR Code SVG placeholder */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                    <rect x="10" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                    <rect x="16" y="16" width="18" height="18" fill="#FFFFFF" />
                    <rect x="20" y="20" width="10" height="10" fill="#0F172A" />

                    <rect x="60" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                    <rect x="66" y="16" width="18" height="18" fill="#FFFFFF" />
                    <rect x="70" y="20" width="10" height="10" fill="#0F172A" />

                    <rect x="10" y="60" width="30" height="30" rx="4" fill="#0F172A" />
                    <rect x="16" y="66" width="18" height="18" fill="#FFFFFF" />
                    <rect x="20" y="70" width="10" height="10" fill="#0F172A" />

                    <rect x="50" y="50" width="12" height="12" fill="#4F46E5" />
                    <rect x="65" y="65" width="10" height="10" fill="#0F172A" />
                    <rect x="80" y="55" width="10" height="10" fill="#0F172A" />
                    <rect x="55" y="75" width="15" height="10" fill="#0F172A" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {activeTicketModal.id}
                </span>
                <span className="text-[11px] text-slate-400">
                  Quét mã QR tại cổng sự kiện bằng máy quét HYPE CHECK-IN
                </span>
              </div>

              {/* Ticket Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hạng Vé</span>
                  <span className="font-bold text-slate-900">{activeTicketModal.ticketTier}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cổng & Vị Trí</span>
                  <span className="font-bold text-slate-900">{activeTicketModal.gate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Khán Giả</span>
                  <span className="font-bold text-slate-900">{activeTicketModal.customerName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Trạng Thái</span>
                  <span className="font-bold text-emerald-600">
                    {activeTicketModal.checkInStatus === "CHECKED_IN"
                      ? "Đã Check-in"
                      : activeTicketModal.checkInStatus === "UNUSED"
                      ? "Chưa sử dụng"
                      : "Đã hoàn tiền"}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2">
                {activeTicketModal.checkInStatus === "UNUSED" && (
                  <button
                    onClick={() => handleManualCheckIn(activeTicketModal.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check-in Thủ Công</span>
                  </button>
                )}

                {activeTicketModal.checkInStatus !== "REFUNDED" && (
                  <button
                    onClick={() => handleRefund(activeTicketModal.id)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span>Hoàn Tiền & Hủy Vé</span>
                  </button>
                )}

                <button
                  onClick={() => handleResendEmail(activeTicketModal)}
                  className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  title="Gửi lại Email"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
