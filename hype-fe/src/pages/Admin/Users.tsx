import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Building2,
  Lock,
  Unlock,
  Search,
  Mail,
  Phone,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roles: string[];
  status: "ACTIVE" | "LOCKED";
  authProvider: string;
  createdAt: string;
}

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [isSyncing, setIsSyncing] = useState(false);

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      fullName: "Huỳnh Hảo",
      email: "haovlogs128@gmail.com",
      phone: "0313648961",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hao",
      roles: ["ROLE_USER", "ROLE_ADMIN"],
      status: "ACTIVE",
      authProvider: "GOOGLE",
      createdAt: "15/08/2026",
    },
  ]);

  const fetchUsers = async (showToastMsg = false) => {
    const token = localStorage.getItem("hype_ticket_token");
    if (!token) return;
    if (showToastMsg) setIsSyncing(true);

    try {
      const res = await fetch("http://localhost:8080/hype/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lockedEmailsStr = localStorage.getItem("hype_locked_user_emails") || "[]";
          let lockedList: string[] = [];
          try {
            lockedList = JSON.parse(lockedEmailsStr);
          } catch {}

          const mapped: UserItem[] = data.map((u: any) => {
            const isLocked =
              u.status === "LOCKED" ||
              u.status === "BANNED" ||
              lockedList.includes(u.email?.toLowerCase().trim());
            return {
              id: u.id,
              fullName: u.fullName || "Người dùng",
              email: u.email,
              phone: u.phone || "Chưa cập nhật",
              avatarUrl:
                u.avatarUrl ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.fullName || u.email)}`,
              roles: Array.isArray(u.roles) ? u.roles : Array.from(u.roles || []),
              status: isLocked ? "LOCKED" : "ACTIVE",
              authProvider: u.authProvider || "LOCAL",
              createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "Gần đây",
            };
          });
          setUsers(mapped);
          if (showToastMsg) showToast("Đã đồng bộ danh sách thành viên mới nhất!", "success");
        }
      }
    } catch (e) {
      console.warn("Could not fetch users from API:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleSync = () => fetchUsers();
    window.addEventListener("hype_auth_refresh", handleSync);
    window.addEventListener("focus", handleSync);

    const interval = setInterval(() => {
      fetchUsers();
    }, 4000);

    return () => {
      window.removeEventListener("hype_auth_refresh", handleSync);
      window.removeEventListener("focus", handleSync);
      clearInterval(interval);
    };
  }, []);

  const handleToggleStatus = async (id: number) => {
    const userToUpdate = users.find((u) => u.id === id);
    if (!userToUpdate) return;
    const nextStatus = userToUpdate.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const token = localStorage.getItem("hype_ticket_token");

    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/users/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        });
      }
    } catch (e) {
      console.error("Update status API error:", e);
    }

    // Đồng bộ danh sách email bị khóa vào localStorage
    const targetEmail = userToUpdate.email.toLowerCase().trim();
    const lockedEmailsStr = localStorage.getItem("hype_locked_user_emails") || "[]";
    let lockedEmails: string[] = [];
    try {
      lockedEmails = JSON.parse(lockedEmailsStr);
    } catch {}

    if (nextStatus === "LOCKED") {
      if (!lockedEmails.includes(targetEmail)) {
        lockedEmails.push(targetEmail);
      }
      // Nếu user bị khóa chính là user đang đăng nhập trên trình duyệt này -> đăng xuất ngay
      const savedUserStr = localStorage.getItem("hype_ticket_user");
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          if (savedUser?.email?.toLowerCase().trim() === targetEmail) {
            localStorage.removeItem("hype_ticket_user");
            localStorage.removeItem("hype_ticket_token");
          }
        } catch {}
      }
    } else {
      lockedEmails = lockedEmails.filter((e) => e !== targetEmail);
    }
    localStorage.setItem("hype_locked_user_emails", JSON.stringify(lockedEmails));

    setUsers(
      users.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    window.dispatchEvent(new StorageEvent("storage", { key: "hype_ticket_user" }));
    showToast(
      nextStatus === "LOCKED"
        ? `Đã khóa tài khoản "${userToUpdate.fullName}" thành công! Tài khoản này không thể đăng nhập.`
        : `Đã mở khóa tài khoản "${userToUpdate.fullName}"!`,
      "success"
    );
  };

  const handleToggleRole = async (id: number, roleCode: string) => {
    const userToUpdate = users.find((u) => u.id === id);
    if (!userToUpdate) return;
    const hasRole = userToUpdate.roles.includes(roleCode);
    const nextRoles = hasRole ? userToUpdate.roles.filter((r) => r !== roleCode) : [...userToUpdate.roles, roleCode];
    const token = localStorage.getItem("hype_ticket_token");

    try {
      if (token) {
        await fetch(`http://localhost:8080/hype/api/v1/admin/users/${id}/toggle-role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: roleCode }),
        });
      }
    } catch (e) {
      console.error(e);
    }

    setUsers(
      users.map((u) => (u.id === id ? { ...u, roles: nextRoles } : u))
    );
    window.dispatchEvent(new Event("hype_auth_refresh"));
    showToast(
      hasRole
        ? `Đã thu hồi quyền ${roleCode.replace("ROLE_", "")} của ${userToUpdate.fullName}`
        : `Đã cấp quyền ${roleCode.replace("ROLE_", "")} cho ${userToUpdate.fullName}!`,
      "success"
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === "ALL" || u.roles.includes(filterRole);
    const matchSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchRole && matchSearch;
  });

  return (
    <AdminLayout
      title="Quản Trị Người Dùng & Phân Quyền"
      subtitle="Tìm kiếm, phân quyền tài khoản và kiểm soát trạng thái hoạt động của thành viên"
    >
      <div className="space-y-6">
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo họ tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[
              { key: "ALL", label: "Tất cả" },
              { key: "ROLE_ADMIN", label: "Admin" },
              { key: "ROLE_ORGANIZER", label: "Ban tổ chức" },
              { key: "ROLE_USER", label: "Khán giả" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterRole(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterRole === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                  <th className="py-3.5 px-5">Thành Viên</th>
                  <th className="py-3.5 px-4">Liên Hệ</th>
                  <th className="py-3.5 px-4">Phương Thức Auth</th>
                  <th className="py-3.5 px-4">Quyền Hạn (Roles)</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className={`transition-colors border-b border-slate-100 ${
                      u.status === "LOCKED"
                        ? "bg-rose-50/40 hover:bg-rose-50/70"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Full Name & Avatar */}
                    <td className="py-4 px-5 font-bold text-slate-900 max-w-xs font-heading">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className={`w-9 h-9 rounded-full object-cover border flex-shrink-0 ${
                              u.status === "LOCKED" ? "border-rose-300 opacity-80 grayscale-30" : "border-slate-200"
                            }`}
                          />
                          {u.status === "LOCKED" && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                              <Lock className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold ${u.status === "LOCKED" ? "text-rose-950" : "text-slate-900"}`}>
                            {u.fullName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-normal">Tham gia: {u.createdAt}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4 text-slate-600">
                      <p className="text-slate-900 font-semibold flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {u.email}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {u.phone || "Chưa có"}
                      </p>
                    </td>

                    {/* Auth Provider */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          u.authProvider === "GOOGLE"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {u.authProvider}
                      </span>
                    </td>

                    {/* Roles */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {u.roles.includes("ROLE_ADMIN") && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                            ADMIN
                          </span>
                        )}
                        {u.roles.includes("ROLE_ORGANIZER") && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                            ORGANIZER
                          </span>
                        )}
                        {u.roles.includes("ROLE_USER") && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            USER
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Trạng Thái Tài Khoản */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {u.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border text-emerald-700 bg-emerald-50 border-emerald-200 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Hoạt Động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border text-rose-700 bg-rose-100/70 border-rose-200 shadow-2xs">
                          <Lock className="w-3 h-3 text-rose-600" />
                          <span>Đã Bị Khóa</span>
                        </span>
                      )}
                    </td>

                    {/* Cột Thao Tác (Ổ Khóa) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        {u.status === "ACTIVE" ? (
                          /* Khi CHƯA KHÓA -> Nút bấm Khóa tài khoản */
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className="group px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-rose-600 text-slate-700 hover:text-white border border-slate-200 hover:border-rose-600 shadow-2xs transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95"
                            title="Khóa tài khoản (Chặn đăng nhập toàn hệ thống)"
                          >
                            <Lock className="w-3.5 h-3.5 text-rose-500 group-hover:text-white transition-colors" />
                            <span>Khóa Tài Khoản</span>
                          </button>
                        ) : (
                          /* Khi ĐÃ KHÓA -> Nút bấm Mở Khóa */
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95"
                            title="Mở khóa tài khoản (Cho phép người dùng đăng nhập lại)"
                          >
                            <Unlock className="w-3.5 h-3.5 text-white" />
                            <span>Mở Khóa</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
