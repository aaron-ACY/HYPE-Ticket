import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Ticket,
  TrendingUp,
  QrCode,
  Plus,
  Users,
  Eye,
  ArrowUpRight,
  Building2,
  Clock,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats] = useState({
    totalRevenue: 652500000,
    ticketsSold: 2610,
    activeEvents: 2,
    completedEvents: 1,
    checkedInCount: 300,
    totalCheckInExpected: 300,
  });

  const [organizerEvents] = useState([
    {
      id: "ev-1",
      title: "HYPE FEST 2026 - Neon Beats in the Dark",
      date: "20/09/2026",
      location: "Nhà Văn Hóa Thanh Niên, TP.HCM",
      ticketsSold: 1420,
      totalTickets: 2000,
      revenue: "355,000,000 đ",
      status: "Đang mở bán",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "ev-2",
      title: "Cyber Sound Arena - Electric Symphony Live",
      date: "15/10/2026",
      location: "Trung tâm Hội chợ SECC, Quận 7",
      ticketsSold: 890,
      totalTickets: 1500,
      revenue: "222,500,000 đ",
      status: "Đang mở bán",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "ev-3",
      title: "Indie Sunset Acoustic Night Vol. 4",
      date: "05/08/2026",
      location: "The Factory Contemporary Arts Centre",
      ticketsSold: 300,
      totalTickets: 300,
      revenue: "75,000,000 đ",
      status: "Đã kết thúc",
      statusColor: "text-slate-600 bg-slate-100 border-slate-200",
    },
  ]);

  return (
    <OrganizerLayout
      title="Tổng Quan Kênh Tổ Chức"
      subtitle="Báo cáo tài chính, lượng vé bán ra và tiến trình hoạt động của các show diễn"
    >
      <div className="space-y-8">
        {/* Stats 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng Doanh Thu
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 font-heading">
                {stats.totalRevenue.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.5% so với tháng trước
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Vé Đã Bán Ra
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 font-heading">
                {stats.ticketsSold.toLocaleString("vi-VN")} vé
              </p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Tỷ lệ lấp đầy: <strong className="text-slate-900 font-bold">68.7%</strong>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Sự Kiện Đang Chạy
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 font-heading">{stats.activeEvents} Show</p>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                {stats.completedEvents} Show đã hoàn thành
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Check-in Tại Cổng
              </span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                <QrCode className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 font-heading">
                {stats.checkedInCount} / {stats.totalCheckInExpected}
              </p>
              <p className="text-[11px] text-cyan-600 font-semibold mt-1">Sẵn sàng cổng quét mã QR</p>
            </div>
          </div>
        </div>

        {/* Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <h4 className="text-base font-extrabold text-slate-900 font-heading uppercase">Cổng Quét Vé Check-in</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Mở camera quét mã QR của vé khán giả trực tiếp tại cổng sự kiện để đối soát.
              </p>
            </div>
            <Link to="/organizer/tickets">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 font-heading uppercase text-xs tracking-wider flex-shrink-0"
              >
                Mở máy quét
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-extrabold text-slate-900 font-heading uppercase">Doanh Thu & Rút Tiền</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Xem thống kê chi tiết các khoản thanh toán vé và tạo yêu cầu quyết toán về tài khoản.
              </p>
            </div>
            <Link to="/organizer/revenue">
              <Button
                variant="primary"
                size="sm"
                className="font-heading uppercase text-xs tracking-wider flex-shrink-0 font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Ví doanh thu
              </Button>
            </Link>
          </div>
        </div>

        {/* Events Table / List */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight font-heading flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Danh Sách Sự Kiện Của Bạn
            </h3>
            <Link
              to="/organizer/events"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors font-heading uppercase tracking-wider"
            >
              Quản lý toàn bộ ({organizerEvents.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                  <th className="pb-3 px-3">Tên Sự Kiện</th>
                  <th className="pb-3 px-3">Thời Gian & Địa Điểm</th>
                  <th className="pb-3 px-3">Đã Bán</th>
                  <th className="pb-3 px-3">Doanh Thu</th>
                  <th className="pb-3 px-3">Trạng Thái</th>
                  <th className="pb-3 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-700">
                {organizerEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-3 text-slate-900 font-extrabold max-w-xs font-heading">
                      {ev.title}
                    </td>
                    <td className="py-4 px-3 text-slate-500">
                      <p className="text-slate-800 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ev.date}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">{ev.location}</p>
                    </td>
                    <td className="py-4 px-3">
                      <p className="text-slate-900 font-bold">
                        {ev.ticketsSold} / {ev.totalTickets}
                      </p>
                      <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${(ev.ticketsSold / ev.totalTickets) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-900 font-bold font-mono">{ev.revenue}</td>
                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ev.statusColor}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link to="/organizer/events" className="text-indigo-600 hover:text-indigo-800 transition-colors text-xs font-bold font-heading uppercase tracking-wider">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};
