import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Flame,
  Search,
  Building2,
  Clock,
  MapPin,
  PauseCircle,
  RotateCcw,
  Eye,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

interface EventItem {
  id: string;
  title: string;
  category: string;
  organizer: string;
  organizerHasBlueTick?: boolean;
  date: string;
  venue: string;
  ticketsSold: number;
  totalTickets: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isFeatured: boolean;
  submittedAt?: string;
}

export const AdminEvents: React.FC = () => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "ev-3",
      title: "Rhythm & Bass Underground Wave 2026",
      category: "HipHop & RnB",
      organizer: "SpaceSpeakers Group",
      organizerHasBlueTick: true,
      date: "12/10/2026",
      venue: "Nhà Thi Đấu Phú Thọ, TP.HCM",
      ticketsSold: 0,
      totalTickets: 3500,
      status: "PENDING",
      isFeatured: false,
      submittedAt: "10 phút trước",
    },
    {
      id: "ev-6",
      title: "Neon Wave Electronic Countdown Fest",
      category: "EDM Festival",
      organizer: "Hype Media Asia",
      organizerHasBlueTick: true,
      date: "31/12/2026",
      venue: "Sân vận động Quân khu 7",
      ticketsSold: 0,
      totalTickets: 5000,
      status: "PENDING",
      isFeatured: false,
      submittedAt: "35 phút trước",
    },
    {
      id: "ev-4",
      title: "Saigon Classical Symphony - Autumn Romance",
      category: "Classical",
      organizer: "Saigon Philharmonic Orchestra",
      organizerHasBlueTick: false,
      date: "25/10/2026",
      venue: "Nhà Hát Lớn TP.HCM",
      ticketsSold: 0,
      totalTickets: 800,
      status: "PENDING",
      isFeatured: false,
      submittedAt: "2 giờ trước",
    },
    {
      id: "ev-7",
      title: "Đêm Nhạc Sinh Viên Acoustic Youth",
      category: "Acoustic",
      organizer: "CLB Âm Nhạc Sinh Viên Trẻ",
      organizerHasBlueTick: false,
      date: "18/11/2026",
      venue: "Hội trường Đại học Bách Khoa",
      ticketsSold: 0,
      totalTickets: 400,
      status: "PENDING",
      isFeatured: false,
      submittedAt: "3 giờ trước",
    },
    {
      id: "ev-1",
      title: "HYPE FEST 2026 - Neon Beats in the Dark",
      category: "Music Festival",
      organizer: "Hype Media Asia",
      organizerHasBlueTick: true,
      date: "20/09/2026",
      venue: "Nhà Văn Hóa Thanh Niên, TP.HCM",
      ticketsSold: 1420,
      totalTickets: 2000,
      status: "APPROVED",
      isFeatured: true,
    },
    {
      id: "ev-2",
      title: "Cyber Sound Arena - Electric Symphony Live",
      category: "EDM Concert",
      organizer: "SpaceSpeakers Group",
      organizerHasBlueTick: true,
      date: "15/10/2026",
      venue: "Trung tâm Hội chợ SECC, Quận 7",
      ticketsSold: 890,
      totalTickets: 1500,
      status: "APPROVED",
      isFeatured: true,
    },
    {
      id: "ev-5",
      title: "Indie Sunset Acoustic Night Vol. 4",
      category: "Acoustic",
      organizer: "Mây Lang Thang Concerts",
      organizerHasBlueTick: true,
      date: "05/08/2026",
      venue: "The Factory Contemporary Arts Centre",
      ticketsSold: 300,
      totalTickets: 300,
      status: "APPROVED",
      isFeatured: false,
    },
  ]);

  const handleToggleStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setEvents(events.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    showToast(`Đã chuyển trạng thái sự kiện sang ${newStatus === "APPROVED" ? "Đã duyệt & Mở bán" : "Từ chối duyệt"}!`, "success");
  };

  const handleToggleFeatured = (id: string) => {
    setEvents(
      events.map((e) => {
        if (e.id === id) {
          const next = !e.isFeatured;
          showToast(next ? "Đã gắn nhãn HOT & Đẩy lên Banner Trang Chủ!" : "Đã gỡ nhãn HOT sự kiện", "success");
          return { ...e, isFeatured: next };
        }
        return e;
      })
    );
  };

  const priorityPendingCount = events.filter((e) => e.status === "PENDING" && e.organizerHasBlueTick).length;
  const totalPendingCount = events.filter((e) => e.status === "PENDING").length;

  // Filter and Sort: Blue tick pending events are prioritized first
  const filteredEvents = events
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === "PRIORITY_BLUE_TICK") {
        return e.status === "PENDING" && Boolean(e.organizerHasBlueTick);
      }
      if (filterStatus === "ALL") return true;
      return e.status === filterStatus;
    })
    .sort((a, b) => {
      // If both are PENDING, prioritize Blue Tick organizers first
      if (a.status === "PENDING" && b.status === "PENDING") {
        if (a.organizerHasBlueTick && !b.organizerHasBlueTick) return -1;
        if (!a.organizerHasBlueTick && b.organizerHasBlueTick) return 1;
      }
      return 0;
    });

  return (
    <AdminLayout
      title="Duyệt & Quản Lý Sự Kiện"
      subtitle="Kiểm duyệt nội dung, điều phối hàng đợi ưu tiên Tích Xanh và quản lý trạng thái mở bán"
    >
      <div className="space-y-6">
        {/* Priority Banner Info */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-violet-500/10 border border-cyan-500/30 flex items-start gap-3.5 text-xs">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-600 flex-shrink-0 mt-0.5 shadow-sm">
            <Zap className="w-4 h-4 text-cyan-600 fill-cyan-600" />
          </div>
          <div className="space-y-1 text-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black uppercase text-indigo-950 text-xs tracking-wide">
                Thuật Toán Phân Luồng Duyệt Ưu Tiên:
              </span>
              <span className="px-2 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold border border-cyan-200">
                Active Priority Queue
              </span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Các sự kiện được tạo bởi <strong>Ban tổ chức có Tích Xanh</strong> sẽ tự động được đẩy lên <strong>vị trí đầu tiên của hàng đợi kiểm duyệt</strong> để Admin xử lý nhanh nhất, đảm bảo lịch mở bán đúng hạn.
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, ban tổ chức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[
              { key: "ALL", label: "Tất cả", count: events.length },
              {
                key: "PRIORITY_BLUE_TICK",
                label: "⚡ Ưu Tiên Tích Xanh",
                count: priorityPendingCount,
                highlight: priorityPendingCount > 0,
                isPriorityTab: true,
              },
              { key: "PENDING", label: "Chờ duyệt", count: totalPendingCount },
              { key: "APPROVED", label: "Đã duyệt" },
              { key: "REJECTED", label: "Đã từ chối" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  filterStatus === tab.key
                    ? tab.isPriorityTab
                      ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm"
                      : "bg-indigo-600 text-white shadow-sm"
                    : tab.isPriorityTab
                    ? "text-cyan-700 hover:bg-cyan-50 font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      filterStatus === tab.key
                        ? "bg-white/20 text-white"
                        : tab.highlight
                        ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Events Table */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                  <th className="py-3.5 px-5">Tên Sự Kiện</th>
                  <th className="py-3.5 px-4">Ban Tổ Chức & Tín Nhiệm</th>
                  <th className="py-3.5 px-4">Thời Gian & Địa Điểm</th>
                  <th className="py-3.5 px-4">Vé Phát Hành</th>
                  <th className="py-3.5 px-4">Hàng Đợi Duyệt</th>
                  <th className="py-3.5 px-4">Nhãn HOT</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      Không tìm thấy sự kiện nào trong danh mục này.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        ev.status === "PENDING" && ev.organizerHasBlueTick ? "bg-cyan-50/20" : ""
                      }`}
                    >
                      {/* Event Title */}
                      <td className="py-4 px-5 font-bold text-slate-900 max-w-xs font-heading">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate">{ev.title}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{ev.category}</span>
                          {ev.submittedAt && ev.status === "PENDING" && (
                            <span className="text-[10px] text-slate-400 italic">• Nộp {ev.submittedAt}</span>
                          )}
                        </div>
                      </td>

                      {/* Organizer with Blue Tick */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[150px]">{ev.organizer}</span>
                          {ev.organizerHasBlueTick && (
                            <span title="Ban tổ chức Tích Xanh Uy Tín">
                              <BadgeCheck className="w-4 h-4 text-cyan-500 fill-cyan-500/20 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        {ev.organizerHasBlueTick && (
                          <span className="text-[10px] font-bold text-cyan-700 block mt-0.5">
                            Đối tác xác thực KYC
                          </span>
                        )}
                      </td>

                      {/* Date & Venue */}
                      <td className="py-4 px-4 text-slate-600">
                        <p className="text-slate-900 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ev.date}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">{ev.venue}</p>
                      </td>

                      {/* Tickets Sold / Total */}
                      <td className="py-4 px-4 text-slate-600">
                        <p className="text-slate-900 font-bold">
                          {ev.ticketsSold} / {ev.totalTickets}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {Math.round((ev.ticketsSold / ev.totalTickets) * 100)}% lấp đầy
                        </span>
                      </td>

                      {/* Queue & Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {ev.status === "APPROVED" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border text-emerald-700 bg-emerald-50 border-emerald-200 whitespace-nowrap">
                            Đã Duyệt
                          </span>
                        )}
                        {ev.status === "PENDING" && (
                          <div className="space-y-1">
                            {ev.organizerHasBlueTick ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black border text-cyan-800 bg-cyan-50 border-cyan-300 flex items-center gap-1 w-fit shadow-sm animate-pulse">
                                <Zap className="w-3 h-3 text-cyan-600 fill-cyan-600" />
                                ƯU TIÊN TÍCH XANH
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border text-amber-700 bg-amber-50 border-amber-200 whitespace-nowrap">
                                Chờ Duyệt Tiêu Chuẩn
                              </span>
                            )}
                          </div>
                        )}
                        {ev.status === "REJECTED" && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border text-rose-700 bg-rose-50 border-rose-200 whitespace-nowrap">
                            Từ Chối
                          </span>
                        )}
                      </td>

                      {/* Hot Tag Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(ev.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                            ev.isFeatured
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                              : "bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200"
                          }`}
                        >
                          <Flame className={`w-3 h-3 ${ev.isFeatured ? "text-yellow-200 fill-yellow-200" : ""}`} />
                          {ev.isFeatured ? "HOT SHOW" : "Thường"}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Link */}
                          <a
                            href="/events"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer"
                            title="Xem trang sự kiện"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>

                          {ev.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(ev.id, "APPROVED")}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap active:scale-95 text-white ${
                                  ev.organizerHasBlueTick
                                    ? "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{ev.organizerHasBlueTick ? "Duyệt Nhanh" : "Duyệt"}</span>
                              </button>
                              <button
                                onClick={() => handleToggleStatus(ev.id, "REJECTED")}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Từ chối</span>
                              </button>
                            </>
                          )}

                          {ev.status === "APPROVED" && (
                            <button
                              onClick={() => handleToggleStatus(ev.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-600 hover:text-amber-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                              title="Tạm dừng mở bán vé sự kiện này"
                            >
                              <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                              <span>Tạm dừng / Hạ bài</span>
                            </button>
                          )}

                          {ev.status === "REJECTED" && (
                            <button
                              onClick={() => handleToggleStatus(ev.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Mở duyệt lại</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
