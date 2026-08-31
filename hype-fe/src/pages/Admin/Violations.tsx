import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Lock,
  Unlock,
  Ban,
  PauseCircle,
  CheckCircle2,
  XCircle,
  Eye,
  FileWarning,
  UserX,
  MailWarning,
  Search,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

interface ViolationItem {
  id: string;
  type: "BOT_SCALPER" | "EVENT_DISPUTE" | "FAKE_TICKET" | "COPYRIGHT";
  typeLabel: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  target: string;
  targetType: "USER" | "ORGANIZER" | "EVENT";
  evidence: string;
  time: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
}

export const AdminViolations: React.FC = () => {
  const { showToast } = useToast();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [violations, setViolations] = useState<ViolationItem[]>([
    {
      id: "VIO-101",
      type: "BOT_SCALPER",
      typeLabel: "Bot Phe Vé / Đầu Cơ",
      severity: "HIGH",
      title: "Phát hiện tài khoản mua 15 vé VIP HYPE FEST trong 4 giây",
      target: "bot.scalper99@gmail.com (IP: 113.161.42.10)",
      targetType: "USER",
      evidence: "15 giao dịch thành công liên tiếp cách nhau 250ms, nghi vấn dùng script tự động",
      time: "10 phút trước",
      status: "PENDING",
    },
    {
      id: "VIO-102",
      type: "EVENT_DISPUTE",
      typeLabel: "Khiếu Nại Hoàn Tiền",
      severity: "HIGH",
      title: "Sự kiện dời lịch diễn nhưng không kích hoạt hoàn vé cho khán giả",
      target: "Cyber Sound Arena (SpaceSpeakers Group)",
      targetType: "ORGANIZER",
      evidence: "18 khán giả gửi email khiếu nại không được hỗ trợ đổi ngày hoặc hoàn tiền",
      time: "1 giờ trước",
      status: "PENDING",
    },
    {
      id: "VIO-103",
      type: "FAKE_TICKET",
      typeLabel: "Trùng Mã QR Tại Cổng",
      severity: "MEDIUM",
      title: "3 lượt check-in cùng 1 mã QR tại sự kiện Indie Chill Fest",
      target: "Mã vé: HYP-TKT-8841 (Khách: Trần Văn T)",
      targetType: "USER",
      evidence: "Mã QR bị sao chép và bán lại trên mạng xã hội cho nhiều người khác nhau",
      time: "3 giờ trước",
      status: "PENDING",
    },
    {
      id: "VIO-104",
      type: "COPYRIGHT",
      typeLabel: "Bản Quyền Hình Ảnh",
      severity: "LOW",
      title: "Banner sự kiện sử dụng hình ảnh nghệ sĩ chưa có thỏa thuận",
      target: "Saigon Classical Romance (Saigon Philharmonic)",
      targetType: "EVENT",
      evidence: "Tác giả nhiếp ảnh gửi email khiếu nại yêu cầu tháo gỡ ảnh bìa poster",
      time: "1 ngày trước",
      status: "RESOLVED",
    },
  ]);

  const handleAction = (id: string, actionName: string, newStatus: "RESOLVED" | "DISMISSED" | "PENDING") => {
    setViolations(violations.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    showToast(`Đã thực hiện thao tác: ${actionName}`, "success");
  };

  const filteredViolations = violations.filter((v) => {
    const matchType = filterType === "ALL" || v.type === filterType;
    const matchSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const pendingCount = violations.filter((v) => v.status === "PENDING").length;

  return (
    <AdminLayout
      title="Quản Lý Vi Phạm & An Toàn Sàn"
      subtitle="Giám sát gian lận vé, xử lý khiếu nại của khán giả và kiểm soát rủi ro pháp lý toàn hệ thống"
    >
      <div className="space-y-8">
        {/* 4 Risk KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Cảnh Báo Chờ Xử Lý
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {pendingCount} vụ việc
              </p>
              <p className="text-xs text-rose-600 font-semibold mt-1">Cần Admin can thiệp ngay</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Chỉ Số Rủi Ro Sàn
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                0.04%
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Trạng thái an toàn chuẩn PCI-DSS</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tài Khoản Gắn Cờ Bot
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserX className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                12 tài khoản
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Đã chặn IP tự động</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Khiếu Nại Đã Giải Quyết
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                98.6%
              </p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Hài lòng sau đối soát</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm cảnh báo, email, sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[
              { key: "ALL", label: "Tất cả" },
              { key: "BOT_SCALPER", label: "Bot phe vé" },
              { key: "EVENT_DISPUTE", label: "Khiếu nại hoàn tiền" },
              { key: "FAKE_TICKET", label: "Vé trùng / Giả" },
              { key: "COPYRIGHT", label: "Bản quyền" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Violations List Cards */}
        <div className="space-y-4">
          {filteredViolations.map((v) => (
            <div
              key={v.id}
              className={`p-6 rounded-2xl bg-white border transition-all shadow-sm ${
                v.status === "PENDING"
                  ? v.severity === "HIGH"
                    ? "border-rose-300 bg-rose-50/20"
                    : "border-amber-200"
                  : "border-slate-200 opacity-75"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        v.severity === "HIGH"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : v.severity === "MEDIUM"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {v.typeLabel}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">{v.id}</span>
                    <span className="text-xs text-slate-400">• {v.time}</span>

                    {v.status === "RESOLVED" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đã xử lý xong
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading">{v.title}</h4>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600 font-semibold">
                      <strong className="text-slate-900">Đối tượng:</strong> {v.target}
                    </p>
                    <p className="text-slate-500">
                      <strong className="text-slate-900">Bằng chứng:</strong> {v.evidence}
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  {v.status === "PENDING" ? (
                    <>
                      {v.type === "BOT_SCALPER" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(v.id, "Hủy 15 vé VIP & Khóa tài khoản bot vĩnh viễn", "RESOLVED")
                            }
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Ban className="w-4 h-4" />
                            Hủy vé & Khóa tài khoản
                          </button>
                          <button
                            onClick={() => handleAction(v.id, "Tạm giữ đơn hàng để xác minh SĐT", "RESOLVED")}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                          >
                            Tạm giữ đơn
                          </button>
                        </>
                      )}

                      {v.type === "EVENT_DISPUTE" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(
                                v.id,
                                "Đóng băng thanh toán doanh thu của SpaceSpeakers Group & Yêu cầu hoàn tiền",
                                "RESOLVED"
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <PauseCircle className="w-4 h-4" />
                            Đóng băng thanh toán (Freeze Payout)
                          </button>
                          <button
                            onClick={() => handleAction(v.id, "Gửi email cảnh cáo yêu cầu BTC giải trình", "RESOLVED")}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                          >
                            Gửi cảnh cáo BTC
                          </button>
                        </>
                      )}

                      {v.type === "FAKE_TICKET" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(
                                v.id,
                                "Đã vô hiệu hóa mã vé giả HYP-TKT-8841 trên toàn bộ máy quét",
                                "RESOLVED"
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Lock className="w-4 h-4" />
                            Vô hiệu hóa mã vé giả
                          </button>
                        </>
                      )}

                      {v.type === "COPYRIGHT" && (
                        <button
                          onClick={() =>
                            handleAction(v.id, "Yêu cầu BTC thay đổi banner và bồi thường", "RESOLVED")
                          }
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                        >
                          Xử lý khiếu nại
                        </button>
                      )}

                      <button
                        onClick={() => handleAction(v.id, "Đã bỏ qua cảnh báo", "DISMISSED")}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Bỏ qua cảnh báo này"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAction(v.id, "Đã mở lại cảnh báo để xem xét lại", "PENDING")}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      Mở lại xem xét
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
