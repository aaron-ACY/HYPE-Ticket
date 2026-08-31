import React, { useState, useEffect } from "react";
import {
  Building2,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  BadgeCheck,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Lock,
  Unlock,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

interface OrganizerItem {
  id: number;
  userId?: number;
  organizationName: string;
  taxCode: string;
  businessEmail: string;
  phone: string;
  websiteUrl?: string;
  description?: string;
  isVerified: boolean;
  hasBlueTick: boolean;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  rejectionReason?: string;
  totalEvents?: number;
  totalRevenue?: string;
  createdAt?: string;
}

export const AdminOrganizers: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Reject modal state
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const [organizers, setOrganizers] = useState<OrganizerItem[]>([
    {
      id: 100,
      organizationName: "Hype Live Entertainment Corp",
      taxCode: "0318921890",
      businessEmail: "haovlogs128@gmail.com",
      phone: "0908123456",
      websiteUrl: "https://hypelive.vn",
      description: "Đơn vị sản xuất và tổ chức chuỗi sự kiện âm nhạc & festival giải trí HYPE FEST",
      isVerified: true,
      hasBlueTick: true,
      status: "APPROVED",
      totalEvents: 5,
      totalRevenue: "850,000,000 đ",
      createdAt: "15/08/2026",
    },
    {
      id: 1,
      organizationName: "SpaceSpeakers Group Joint Stock Company",
      taxCode: "0316489615",
      businessEmail: "booking@spacespeakers.vn",
      phone: "0901234567",
      websiteUrl: "https://spacespeakers.vn",
      isVerified: true,
      hasBlueTick: true,
      status: "APPROVED",
      totalEvents: 4,
      totalRevenue: "652,500,000 đ",
    },
    {
      id: 2,
      organizationName: "Hype Media Asia Co., Ltd",
      taxCode: "0108923411",
      businessEmail: "partners@hypemedia.asia",
      phone: "0912345678",
      websiteUrl: "https://hypemedia.asia",
      isVerified: true,
      hasBlueTick: true,
      status: "APPROVED",
      totalEvents: 6,
      totalRevenue: "1,240,000,000 đ",
    },
    {
      id: 3,
      organizationName: "Saigon Philharmonic Orchestra",
      taxCode: "0309876543",
      businessEmail: "info@saigonsymphony.org",
      phone: "0987654321",
      websiteUrl: "https://saigonsymphony.org",
      isVerified: false,
      hasBlueTick: false,
      status: "PENDING",
      totalEvents: 1,
      totalRevenue: "0 đ",
    },
    {
      id: 4,
      organizationName: "Mây Lang Thang Acoustic Concerts",
      taxCode: "5801234567",
      businessEmail: "maylangthang@gmail.com",
      phone: "0934567890",
      websiteUrl: "https://facebook.com/maylangthang",
      isVerified: true,
      hasBlueTick: true,
      status: "APPROVED",
      totalEvents: 3,
      totalRevenue: "215,000,000 đ",
    },
    {
      id: 5,
      organizationName: "CLB Âm Nhạc Sinh Viên Trẻ",
      taxCode: "",
      businessEmail: "clb.amnhac.youth@gmail.com",
      phone: "0967891234",
      isVerified: false,
      hasBlueTick: false,
      status: "PENDING",
      totalEvents: 0,
      totalRevenue: "0 đ",
    },
  ]);

  // Fetch organizers from API
  const fetchOrganizers = async () => {
    const token = localStorage.getItem("hype_ticket_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/hype/api/v1/admin/organizers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: OrganizerItem[] = data.map((item: any, idx: number) => ({
            id: item.id,
            userId: item.userId,
            organizationName: item.organizationName,
            taxCode: item.taxCode || "",
            businessEmail: item.businessEmail,
            phone: item.phone,
            websiteUrl: item.websiteUrl,
            description: item.description,
            isVerified: Boolean(item.isVerified),
            hasBlueTick: Boolean(item.hasBlueTick),
            status: item.status || "APPROVED",
            rejectionReason: item.rejectionReason,
            totalEvents: item.totalEvents ?? (idx + 1) * 2,
            totalRevenue: item.totalRevenue ?? "150,000,000 đ",
            createdAt: item.createdAt,
          }));

          // Đảm bảo Hype Live Entertainment Corp luôn có mặt nếu chưa có trong DB
          const hasHypeLive = mapped.some(
            (o) => o.businessEmail === "haovlogs128@gmail.com" || o.organizationName.includes("Hype Live")
          );

          if (!hasHypeLive) {
            const savedProfileStr = localStorage.getItem("hype_organizer_profile_saved");
            const savedData = savedProfileStr ? JSON.parse(savedProfileStr) : null;

            mapped.unshift({
              id: 100,
              organizationName: savedData?.organizationName || "Hype Live Entertainment Corp",
              taxCode: savedData?.taxCode || "0318921890",
              businessEmail: savedData?.businessEmail || "haovlogs128@gmail.com",
              phone: savedData?.phone || "0908123456",
              websiteUrl: savedData?.websiteUrl || "https://hypelive.vn",
              description: "Đơn vị sản xuất và tổ chức chuỗi sự kiện âm nhạc & festival giải trí HYPE FEST",
              isVerified: true,
              hasBlueTick: true,
              status: "APPROVED",
              totalEvents: 5,
              totalRevenue: "850,000,000 đ",
              createdAt: "15/08/2026",
            });
          }

          setOrganizers(mapped);
        }
      }
    } catch (e) {
      console.warn("Using local mock organizers data:", e);
    }
  };

  useEffect(() => {
    fetchOrganizers();

    const handleSync = () => fetchOrganizers();
    window.addEventListener("hype_organizer_status_updated", handleSync);
    window.addEventListener("hype_auth_refresh", handleSync);
    window.addEventListener("focus", handleSync);

    const interval = setInterval(() => {
      fetchOrganizers();
    }, 4000);

    return () => {
      window.removeEventListener("hype_organizer_status_updated", handleSync);
      window.removeEventListener("hype_auth_refresh", handleSync);
      window.removeEventListener("focus", handleSync);
      clearInterval(interval);
    };
  }, []);

  // Handle Approve
  const handleApprove = async (id: number, orgName: string) => {
    const token = localStorage.getItem("hype_ticket_token");
    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/organizers/${id}/approve`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error(e);
    }

    setOrganizers(
      organizers.map((org) =>
        org.id === id ? { ...org, status: "APPROVED", isVerified: true, rejectionReason: undefined } : org
      )
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    window.dispatchEvent(new Event("hype_organizer_status_updated"));
    showToast(`Đã phê duyệt hồ sơ Ban tổ chức "${orgName}" và cấp quyền thành công!`, "success");
  };

  // Handle Suspend (Khóa quyền BTC)
  const handleSuspend = async (id: number, orgName: string) => {
    const token = localStorage.getItem("hype_ticket_token");
    const reason = "Tạm khóa quyền quản trị Ban tổ chức do vi phạm quy chế hoặc cần xác minh lại.";

    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/organizers/${id}/suspend`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        });
      }
    } catch (e) {
      console.error(e);
    }

    setOrganizers(
      organizers.map((org) =>
        org.id === id ? { ...org, status: "SUSPENDED", isVerified: false, hasBlueTick: false, rejectionReason: reason } : org
      )
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    window.dispatchEvent(new Event("hype_organizer_status_updated"));
    showToast(`Đã khóa quyền Ban tổ chức của "${orgName}". Tài khoản này không thể truy cập Kênh Đối Tác!`, "error");
  };

  // Handle Unsuspend (Mở khóa quyền BTC)
  const handleUnsuspend = async (id: number, orgName: string) => {
    const token = localStorage.getItem("hype_ticket_token");
    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/organizers/${id}/unsuspend`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error(e);
    }

    setOrganizers(
      organizers.map((org) =>
        org.id === id ? { ...org, status: "APPROVED", isVerified: true, rejectionReason: undefined } : org
      )
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    window.dispatchEvent(new Event("hype_organizer_status_updated"));
    showToast(`Đã mở khóa quyền Ban tổ chức cho "${orgName}" thành công!`, "success");
  };

  // Handle Reject
  const handleRejectSubmit = async () => {
    if (!rejectingId) return;
    const token = localStorage.getItem("hype_ticket_token");
    const reason = rejectReason.trim() || "Hồ sơ chưa đáp ứng tiêu chuẩn kiểm duyệt doanh nghiệp.";

    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/organizers/${rejectingId}/reject`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        });
      }
    } catch (e) {
      console.error(e);
    }

    setOrganizers(
      organizers.map((org) =>
        org.id === rejectingId
          ? { ...org, status: "REJECTED", isVerified: false, hasBlueTick: false, rejectionReason: reason }
          : org
      )
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    window.dispatchEvent(new Event("hype_organizer_status_updated"));
    showToast(`Đã từ chối hồ sơ Ban tổ chức #${rejectingId}`, "info");
    setRejectingId(null);
    setRejectReason("");
  };

  // Handle Toggle Blue Tick
  const handleToggleBlueTick = async (id: number, orgName: string) => {
    const token = localStorage.getItem("hype_ticket_token");
    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/organizers/${id}/toggle-blue-tick`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error(e);
    }

    setOrganizers(
      organizers.map((org) => {
        if (org.id === id) {
          const next = !org.hasBlueTick;
          showToast(
            next
              ? `Đã cấp TÍCH XANH ƯU TIÊN cho đối tác "${orgName}"!`
              : `Đã thu hồi Tích Xanh của "${orgName}"`,
            "success"
          );
          return { ...org, hasBlueTick: next, isVerified: next || org.isVerified };
        }
        return org;
      })
    );
  };

  const pendingCount = organizers.filter((o) => o.status === "PENDING").length;
  const suspendedCount = organizers.filter((o) => o.status === "SUSPENDED").length;

  const filteredOrganizers = organizers.filter((org) => {
    const matchSearch =
      org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.taxCode.includes(searchQuery) ||
      org.businessEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (activeTab === "PENDING") return org.status === "PENDING";
    if (activeTab === "APPROVED") return org.status === "APPROVED";
    if (activeTab === "SUSPENDED") return org.status === "SUSPENDED";
    if (activeTab === "REJECTED") return org.status === "REJECTED";
    if (activeTab === "BLUE_TICK") return org.hasBlueTick;

    return true;
  });

  return (
    <AdminLayout
      title="Kiểm Duyệt & Quản Lý Ban Tổ Chức"
      subtitle="Thẩm định hồ sơ doanh nghiệp, phê duyệt, tạm khóa quyền đối tác và phân bổ Tích Xanh ưu tiên duyệt sự kiện"
    >
      <div className="space-y-6">
        {/* Top Controls: Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên tổ chức, MST, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[
              { key: "ALL", label: "Tất cả", count: organizers.length },
              { key: "PENDING", label: "Chờ Duyệt KYC (48H)", count: pendingCount, highlight: pendingCount > 0 },
              { key: "APPROVED", label: "Đang Hoạt Động" },
              { key: "SUSPENDED", label: "Đang Bị Khóa Quyền", count: suspendedCount, highlight: suspendedCount > 0 },
              { key: "BLUE_TICK", label: "Tích Xanh Uy Tín" },
              { key: "REJECTED", label: "Đã Từ Chối" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : tab.highlight
                        ? "bg-amber-100 text-amber-800"
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

        {/* Priority Notice Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-indigo-900 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold font-heading">Quy Chế Quản Lý Ban Tổ Chức:</span>
            <p className="text-indigo-800 font-medium leading-relaxed">
              Khi bấm <strong>"Khóa Quyền BTC"</strong>, tài khoản đó sẽ bị vô hiệu hóa phân hệ quản trị đối tác, nhưng tài khoản người dùng vẫn có thể đăng nhập để mua vé khán giả bình thường (khác với Khóa tài khoản).
            </p>
          </div>
        </div>

        {/* Organizers Table */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                  <th className="py-3.5 px-5">Tên Đơn Vị / Doanh Nghiệp</th>
                  <th className="py-3.5 px-4">Mã Số Thuế</th>
                  <th className="py-3.5 px-4">Thông Tin Liên Hệ</th>
                  <th className="py-3.5 px-4">Trạng Thái Quyền BTC</th>
                  <th className="py-3.5 px-4">Huy Hiệu Tích Xanh</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                {filteredOrganizers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                      Không tìm thấy Ban tổ chức nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredOrganizers.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Organization Name & Website */}
                      <td className="py-4 px-5 font-bold text-slate-900 max-w-xs font-heading">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate">{org.organizationName}</p>
                          {org.hasBlueTick && (
                            <span title="Đối tác uy tín - Ưu tiên duyệt vé">
                              <BadgeCheck className="w-4 h-4 text-cyan-500 fill-cyan-500/20 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        {org.websiteUrl && (
                          <a
                            href={org.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            Website / Fanpage
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        {org.description && (
                          <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                            {org.description}
                          </p>
                        )}
                      </td>

                      {/* Tax Code */}
                      <td className="py-4 px-4 text-slate-700">
                        {org.taxCode ? (
                          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                            {org.taxCode}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Chưa khai báo</span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 text-slate-600">
                        <p className="text-slate-900 font-semibold flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {org.businessEmail}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {org.phone}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {org.status === "APPROVED" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Đang Hoạt Động
                          </span>
                        )}
                        {org.status === "PENDING" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-amber-800 bg-amber-50 border-amber-300 flex items-center gap-1 w-fit animate-pulse">
                            <Clock className="w-3 h-3" />
                            Chờ Duyệt KYC (48H)
                          </span>
                        )}
                        {org.status === "SUSPENDED" && (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-rose-700 bg-rose-50 border-rose-200 flex items-center gap-1 w-fit">
                              <Lock className="w-3 h-3" />
                              Khóa Quyền BTC
                            </span>
                            {org.rejectionReason && (
                              <p className="text-[10px] text-rose-500 max-w-[150px] truncate" title={org.rejectionReason}>
                                {org.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                        {org.status === "REJECTED" && (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-slate-600 bg-slate-100 border-slate-200 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              Đã Từ Chối
                            </span>
                            {org.rejectionReason && (
                              <p className="text-[10px] text-slate-500 max-w-[150px] truncate" title={org.rejectionReason}>
                                Lý do: {org.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Blue Tick Badge Toggle (Tiêu chí 5 sự kiện) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <button
                            onClick={() => handleToggleBlueTick(org.id, org.organizationName)}
                            disabled={org.status !== "APPROVED"}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              org.status !== "APPROVED"
                                ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                                : org.hasBlueTick
                                ? "bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200"
                            }`}
                            title={
                              org.status !== "APPROVED"
                                ? "Cần duyệt hồ sơ trước khi cấp tích xanh"
                                : org.hasBlueTick
                                ? "Bấm để thu hồi tích xanh"
                                : `Đã tổ chức ${org.totalEvents || 0}/5 sự kiện. Bấm để cấp tích xanh uy tín`
                            }
                          >
                            <BadgeCheck className={`w-3.5 h-3.5 ${org.hasBlueTick ? "text-cyan-500 fill-cyan-500/20" : "text-slate-400"}`} />
                            {org.hasBlueTick ? "Đã cấp Tích Xanh" : "Chưa cấp"}
                          </button>
                          <span className={`text-[10px] block font-semibold ${(org.totalEvents ?? 0) >= 5 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                            {(org.totalEvents ?? 0) >= 5 ? `✓ Đủ ĐK (${org.totalEvents} show)` : `Chưa đủ (${org.totalEvents ?? 0}/5 show)`}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Case 1: Chờ Duyệt (PENDING) */}
                          {org.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(org.id, org.organizationName)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Phê Duyệt</span>
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingId(org.id);
                                  setRejectReason("");
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Từ Chối</span>
                              </button>
                            </>
                          )}

                          {/* Case 2: Đang Hoạt Động (APPROVED) -> Nút Khóa Quyền BTC */}
                          {org.status === "APPROVED" && (
                            <button
                              onClick={() => handleSuspend(org.id, org.organizationName)}
                              className="group px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-rose-600 text-slate-700 hover:text-white border border-slate-200 hover:border-rose-600 shadow-2xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95"
                              title="Tạm khóa quyền Ban tổ chức (User vẫn đăng nhập được bình thường)"
                            >
                              <Lock className="w-3.5 h-3.5 text-rose-500 group-hover:text-white transition-colors" />
                              <span>Khóa Quyền BTC</span>
                            </button>
                          )}

                          {/* Case 3: Đang Bị Khóa (SUSPENDED) -> Nút Mở Khóa Quyền BTC */}
                          {org.status === "SUSPENDED" && (
                            <button
                              onClick={() => handleUnsuspend(org.id, org.organizationName)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95"
                              title="Mở khóa lại quyền Ban tổ chức"
                            >
                              <Unlock className="w-3.5 h-3.5 text-white" />
                              <span>Mở Khóa BTC</span>
                            </button>
                          )}

                          {/* Case 4: Đã Từ Chối (REJECTED) -> Nút Phê Duyệt Lại */}
                          {org.status === "REJECTED" && (
                            <button
                              onClick={() => handleApprove(org.id, org.organizationName)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Xem xét lại và phê duyệt cấp quyền BTC"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Duyệt Lại</span>
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

        {/* Reject Reason Modal */}
        {rejectingId !== null && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase font-heading">
                    Từ Chối Hồ Sơ Ban Tổ Chức
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Nhập lý do để phản hồi lại cho đơn vị đăng ký
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase font-heading">
                  Lý do từ chối:
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Giấy phép kinh doanh không khớp, mã số thuế không hợp lệ..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingId(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Xác Nhận Từ Chối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
