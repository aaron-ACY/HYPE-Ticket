import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Plus,
  Search,
  Eye,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: string;
  status: "ACTIVE" | "PENDING" | "DRAFT" | "ENDED";
  isFeatured?: boolean;
}

export const OrganizerEvents: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [events] = useState<EventItem[]>([
    {
      id: "ev-1",
      title: "HYPE FEST 2026 - Neon Beats in the Dark",
      category: "Music Festival / EDM",
      date: "20/09/2026",
      time: "19:00 - 23:30",
      venue: "Nhà Văn Hóa Thanh Niên, Quận 1, TP.HCM",
      ticketsSold: 1420,
      totalTickets: 2000,
      revenue: "355,000,000 đ",
      status: "ACTIVE",
      isFeatured: true,
    },
    {
      id: "ev-2",
      title: "Cyber Sound Arena - Electric Symphony Live",
      category: "EDM Festival",
      date: "15/10/2026",
      time: "18:00 - 22:00",
      venue: "Trung tâm Hội chợ SECC, Quận 7, TP.HCM",
      ticketsSold: 890,
      totalTickets: 1500,
      revenue: "222,500,000 đ",
      status: "ACTIVE",
      isFeatured: false,
    },
    {
      id: "ev-3",
      title: "Indie Sunset Acoustic Night Vol. 4",
      category: "Acoustic / Live Show",
      date: "05/08/2026",
      time: "20:00 - 22:30",
      venue: "The Factory Contemporary Arts Centre, TP.Thủ Đức",
      ticketsSold: 300,
      totalTickets: 300,
      revenue: "75,000,000 đ",
      status: "ENDED",
      isFeatured: false,
    },
    {
      id: "ev-4",
      title: "Fan Meeting & Fansign: Vũ Cát Tường 2026",
      category: "Fan Meeting",
      date: "05/11/2026",
      time: "15:00 - 18:00",
      venue: "Nhà Hát Bến Thành, Quận 1, TP.HCM",
      ticketsSold: 0,
      totalTickets: 600,
      revenue: "0 đ",
      status: "PENDING",
      isFeatured: false,
    },
  ]);

  const filteredEvents = events.filter((ev) => {
    const matchTab =
      activeTab === "ALL" ||
      (activeTab === "ACTIVE" && ev.status === "ACTIVE") ||
      (activeTab === "PENDING" && ev.status === "PENDING") ||
      (activeTab === "ENDED" && ev.status === "ENDED");

    const matchSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTab && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đang Mở Bán
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5 w-fit">
            <Clock className="w-3 h-3" />
            Chờ Admin Duyệt (48H)
          </span>
        );
      case "ENDED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Đã Kết Thúc
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <OrganizerLayout
      title="Quản Lý Sự Kiện"
      subtitle="Tạo mới, chỉnh sửa thông tin show diễn và theo dõi tiến độ phê duyệt từ ban quản trị"
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: "ALL", label: `Tất Cả (${events.length})` },
              { key: "ACTIVE", label: `Đang Mở Bán (${events.filter((e) => e.status === "ACTIVE").length})` },
              { key: "PENDING", label: `Chờ Duyệt (${events.filter((e) => e.status === "PENDING").length})` },
              { key: "ENDED", label: `Đã Kết Thúc (${events.filter((e) => e.status === "ENDED").length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => {
            const fillRate = ((ev.ticketsSold / ev.totalTickets) * 100).toFixed(0);

            return (
              <div
                key={ev.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 font-heading">
                      {ev.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {ev.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">{getStatusBadge(ev.status)}</div>
                </div>

                {/* Event Location & Date */}
                <div className="space-y-2 text-xs text-slate-500 font-medium border-y border-slate-100 py-3.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>
                      {ev.date} • {ev.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 font-heading">
                      Lượng vé đã bán: <strong className="text-slate-900">{ev.ticketsSold} / {ev.totalTickets}</strong>
                    </span>
                    <span className="text-indigo-600 font-mono font-bold">{fillRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>

                {/* Footer Revenue & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-heading uppercase font-bold">
                      Doanh thu ghi nhận
                    </span>
                    <span className="text-lg font-black text-slate-900 font-mono">{ev.revenue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/events`}>
                      <button
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                        title="Xem trang công khai"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => showToast(`Đang mở bảng chỉnh sửa sự kiện "${ev.title}"...`, "info")}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all font-heading uppercase tracking-wider cursor-pointer"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </OrganizerLayout>
  );
};
