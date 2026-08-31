import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  ShoppingBag,
  Download,
  ArrowRight,
  RefreshCw,
  Radio,
  BadgeCheck,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString("vi-VN"));

  const [stats, setStats] = useState({
    totalGmv: 1450000000,
    platformRevenue: 145000000,
    totalTicketsSold: 5820,
    totalUsers: 1240,
    totalOrganizers: 18,
    pendingEventsCount: 3,
    activeEventsCount: 15,
  });

  const [pendingOrganizersCount, setPendingOrganizersCount] = useState<number>(0);
  const [pendingOrganizers, setPendingOrganizers] = useState<any[]>([]);

  const [pendingEvents, setPendingEvents] = useState([
    {
      id: "ev-p1",
      title: "Rhythm & Bass Underground Wave 2026",
      organizer: "SpaceSpeakers Group",
      organizerHasBlueTick: true,
      date: "12/10/2026",
      venue: "Nhà Thi Đấu Phú Thọ, TP.HCM",
      ticketsCount: 3500,
      priceRange: "250K - 1.2M",
    },
    {
      id: "ev-p2",
      title: "Saigon Classical Symphony - Autumn Romance",
      organizer: "Saigon Philharmonic Orchestra",
      organizerHasBlueTick: false,
      date: "25/10/2026",
      venue: "Nhà Hát Lớn TP.HCM",
      ticketsCount: 800,
      priceRange: "300K - 2.5M",
    },
    {
      id: "ev-p3",
      title: "Indie Chill Fest - Acoustic by the Lake",
      organizer: "Mây Lang Thang Concerts",
      organizerHasBlueTick: false,
      date: "08/11/2026",
      venue: "Hồ Tây, Hà Nội",
      ticketsCount: 1200,
      priceRange: "180K - 500K",
    },
  ]);

  // Fetch real-time dashboard data from API
  const fetchDashboardData = useCallback(async (showToastMsg = false) => {
    const token = localStorage.getItem("hype_ticket_token");
    if (!token) return;

    if (showToastMsg) setIsSyncing(true);

    try {
      // 1. Fetch live system stats
      const resStats = await fetch("http://localhost:8080/hype/api/v1/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resStats.ok) {
        const statsData = await resStats.json();
        if (statsData) {
          setStats((prev) => ({
            ...prev,
            totalGmv: statsData.totalGmv || prev.totalGmv,
            platformRevenue: statsData.platformRevenue || prev.platformRevenue,
            totalTicketsSold: statsData.totalTicketsSold || prev.totalTicketsSold,
            totalUsers: statsData.totalUsers || prev.totalUsers,
            totalOrganizers: statsData.totalOrganizers || prev.totalOrganizers,
            pendingEventsCount: statsData.pendingEventsCount || prev.pendingEventsCount,
            activeEventsCount: statsData.activeEventsCount || prev.activeEventsCount,
          }));
        }
      }

      // 2. Fetch organizers to detect pending KYC applications
      const resOrg = await fetch("http://localhost:8080/hype/api/v1/admin/organizers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resOrg.ok) {
        const orgData = await resOrg.json();
        if (Array.isArray(orgData)) {
          const pending = orgData.filter((o: any) => o.status === "PENDING");
          setPendingOrganizersCount(pending.length);
          setPendingOrganizers(pending);
        }
      }

      setLastSyncTime(new Date().toLocaleTimeString("vi-VN"));
      if (showToastMsg) {
        showToast("Đã đồng bộ dữ liệu điều hành mới nhất!", "success");
      }
    } catch (e) {
      console.warn("Could not fetch admin dashboard stats:", e);
    } finally {
      setIsSyncing(false);
    }
  }, [showToast]);

  // Setup Real-time live polling & event listeners
  useEffect(() => {
    fetchDashboardData();

    const handleLiveSync = () => fetchDashboardData();
    window.addEventListener("hype_organizer_status_updated", handleLiveSync);
    window.addEventListener("hype_auth_refresh", handleLiveSync);
    window.addEventListener("focus", handleLiveSync);

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 4000);

    return () => {
      window.removeEventListener("hype_organizer_status_updated", handleLiveSync);
      window.removeEventListener("hype_auth_refresh", handleLiveSync);
      window.removeEventListener("focus", handleLiveSync);
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  // Recent Orders Feed
  const recentOrders = [
    {
      id: "ORD-9821",
      customer: "Nguyễn Hoàng Nam",
      event: "HYPE FEST 2026",
      tickets: "2x VIP Zone",
      amount: "1,500,000 đ",
      time: "2 phút trước",
      status: "Thành công",
    },
    {
      id: "ORD-9820",
      customer: "Trần Bảo Ngọc",
      event: "Cyber Sound Arena",
      tickets: "1x General",
      amount: "450,000 đ",
      time: "15 phút trước",
      status: "Thành công",
    },
    {
      id: "ORD-9819",
      customer: "Lê Minh Trí",
      event: "HYPE FEST 2026",
      tickets: "4x Standard",
      amount: "1,400,000 đ",
      time: "42 phút trước",
      status: "Thành công",
    },
    {
      id: "ORD-9818",
      customer: "Phạm Thảo Vy",
      event: "Indie Sunset Acoustic Night",
      tickets: "2x Early Bird",
      amount: "500,000 đ",
      time: "1 giờ trước",
      status: "Thành công",
    },
  ];

  // Monthly Revenue Chart Data
  const monthlyData = [
    { month: "T3", gmv: "420M", height: "45%", highlight: false },
    { month: "T4", gmv: "680M", height: "60%", highlight: false },
    { month: "T5", gmv: "890M", height: "72%", highlight: false },
    { month: "T6", gmv: "1.12B", height: "85%", highlight: false },
    { month: "T7", gmv: "1.28B", height: "90%", highlight: false },
    { month: "T8 (Hiện tại)", gmv: "1.45B", height: "100%", highlight: true },
  ];

  const handleApprove = (id: string, name: string) => {
    setPendingEvents(pendingEvents.filter((e) => e.id !== id));
    showToast(`Đã phê duyệt sự kiện "${name}" thành công!`, "success");
  };

  const handleReject = (id: string, name: string) => {
    setPendingEvents(pendingEvents.filter((e) => e.id !== id));
    showToast(`Đã từ chối sự kiện "${name}"`, "error");
  };

  return (
    <AdminLayout
      title="Tổng Quan Điều Hành"
      subtitle="Báo cáo số liệu GMV, doanh thu phí sàn và hoạt động kiểm duyệt toàn hệ thống"
    >
      <div className="space-y-6">
        {/* Page Top Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Bảng Số Liệu Tài Chính & Vận Hành Sàn
              </h2>
              {/* Realtime Live Pulse Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Realtime (4s)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đồng bộ dữ liệu thời gian thực lần cuối lúc <strong className="text-slate-700 font-mono">{lastSyncTime}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Đang đồng bộ..." : "Làm mới"}</span>
            </button>
            <button
              onClick={() => showToast("Đang xuất file báo cáo tổng hợp PDF...", "info")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo</span>
            </button>
            <Link to="/admin/events">
              <button className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer">
                <span>Duyệt sự kiện ({pendingEvents.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Real-time Alert Banner for Pending KYC Organizers (if any) */}
        {pendingOrganizersCount > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <span>Có {pendingOrganizersCount} hồ sơ Ban tổ chức mới đang chờ duyệt KYC!</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                    Mới nhận
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Đơn vị gần nhất: <strong className="text-slate-900 font-semibold">{pendingOrganizers[0]?.organizationName}</strong> ({pendingOrganizers[0]?.businessEmail})
                </p>
              </div>
            </div>

            <Link to="/admin/organizers">
              <button className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 font-heading transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <span>Duyệt KYC Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}

        {/* 4 Financial & Scale Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: GMV */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng GMV Toàn Sàn
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {stats.totalGmv.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% so với tháng trước
              </p>
            </div>
          </div>

          {/* Card 2: Platform Revenue */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Doanh Thu Phí Sàn (10%)
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {stats.platformRevenue.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Phí trích từ vé bán thành công</p>
            </div>
          </div>

          {/* Card 3: Tickets Sold */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng Vé Đã Bán
              </span>
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                <Ticket className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {stats.totalTicketsSold.toLocaleString("vi-VN")} vé
              </p>
              <p className="text-xs text-violet-600 font-semibold mt-1">Đạt 82% chỉ tiêu tháng 8</p>
            </div>
          </div>

          {/* Card 4: Users & Partners */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Người Dùng & Đối Tác
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {stats.totalUsers.toLocaleString("vi-VN")} <span className="text-sm font-normal text-slate-500">khách</span>
              </p>
              <p className="text-xs text-sky-600 font-semibold mt-1">{stats.totalOrganizers} Ban tổ chức đối tác</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Revenue Chart & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Growth Bar Visualizer */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Tăng Trưởng Doanh Thu Toàn Sàn (6 Tháng Gần Nhất)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Đơn vị: Tỷ VNĐ (GMV ghi nhận qua cổng thanh toán)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +45.2% Q3
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-6 pb-2 grid grid-cols-6 gap-3 items-end h-48 border-b border-slate-100">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    {item.gmv}
                  </span>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-95 ${
                        item.highlight
                          ? "bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/20"
                          : "bg-slate-300 hover:bg-slate-400"
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      item.highlight ? "text-indigo-600 font-bold" : "text-slate-500"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Tháng hiện tại (1.45 tỷ đ)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                Các tháng trước
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <PieChart className="w-4 h-4 text-brand-primary" />
                Cơ Cấu Doanh Số Thể Loại
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Phân bổ tỷ trọng doanh số vé</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Music Festival</span>
                  <span className="font-bold text-slate-900">55% (797.5M)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "55%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>EDM & Rave Concert</span>
                  <span className="font-bold text-slate-900">25% (362.5M)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full" style={{ width: "25%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Acoustic & Indie Live</span>
                  <span className="font-bold text-slate-900">12% (174.0M)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Classical & Theater</span>
                  <span className="font-bold text-slate-900">8% (116.0M)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "8%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Pending Events Moderation Queue + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Moderation Queue (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Hàng Đợi Duyệt Sự Kiện Mới
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {pendingEvents.length} chờ duyệt
                </span>
              </div>

              <Link
                to="/admin/events"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                Xem tất cả sự kiện →
              </Link>
            </div>

            {pendingEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                🎉 Không có sự kiện nào đang chờ phê duyệt!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                      <th className="py-2.5 px-3 rounded-l-lg">Sự Kiện</th>
                      <th className="py-2.5 px-3">Ban Tổ Chức</th>
                      <th className="py-2.5 px-3">Thời Gian</th>
                      <th className="py-2.5 px-3">Số Vé</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Phê Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                    {pendingEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 max-w-[200px] truncate font-heading">
                          {ev.title}
                        </td>
                        <td className="py-3 px-3 text-indigo-700 font-semibold max-w-[140px] truncate">
                          {ev.organizer}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {ev.date}
                        </td>
                        <td className="py-3 px-3 text-slate-900 font-bold whitespace-nowrap">
                          {ev.ticketsCount} vé
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(ev.id, ev.title)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(ev.id, ev.title)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" />
                              Từ chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Orders Feed (1 col) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Giao Dịch Vé Mới Nhất
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Realtime</span>
            </div>

            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{ord.customer}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {ord.event} • <span className="text-indigo-600 font-semibold">{ord.tickets}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-emerald-600">{ord.amount}</p>
                    <span className="text-[10px] text-slate-400">{ord.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
