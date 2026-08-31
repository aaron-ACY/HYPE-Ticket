import React, { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Save,
  ShieldCheck,
  MapPin,
  UserCheck,
  Upload,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const OrganizerSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("hype_organizer_profile_saved");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      organizationName: "Hype Live Entertainment Corp",
      shortName: "HYPE LIVE",
      taxCode: "0318921890",
      businessEmail: user?.email || "haovlogs128@gmail.com",
      phone: "0908123456",
      websiteUrl: "https://hypelive.vn",
      headquartersAddress: "Tầng 12, Tòa nhà Bitexco, 02 Hải Triều, Bến Nghé, Quận 1, TP.HCM",
      representativeName: "Huỳnh Hảo",
      representativeId: "079098001234",
      bankName: "Techcombank (Ngân hàng Kỹ Thương Việt Nam)",
      bankAccountNo: "19034882190012",
      bankAccountName: "CONG TY CP GIAI TRI HYPE LIVE",
      bankBranch: "Chi nhánh Sài Gòn",
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("hype_ticket_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/hype/api/v1/organizer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.organizationName) {
            setForm((prev: any) => ({
              ...prev,
              organizationName: data.organizationName || prev.organizationName,
              taxCode: data.taxCode || prev.taxCode,
              businessEmail: data.businessEmail || prev.businessEmail,
              phone: data.phone || prev.phone,
              websiteUrl: data.websiteUrl || prev.websiteUrl,
              description: data.description || prev.description,
            }));
          }
        }
      } catch (e) {
        console.warn("Using local settings profile:", e);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem("hype_ticket_token");
    try {
      if (token) {
        await fetch("http://localhost:8080/hype/api/v1/organizer/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            organizationName: form.organizationName,
            taxCode: form.taxCode,
            businessEmail: form.businessEmail,
            phone: form.phone,
            websiteUrl: form.websiteUrl,
            description: form.headquartersAddress,
          }),
        });
      }
    } catch (e) {
      console.warn("Save API warning:", e);
    }

    localStorage.setItem("hype_organizer_profile_saved", JSON.stringify(form));
    window.dispatchEvent(new Event("hype_organizer_status_updated"));
    window.dispatchEvent(new Event("hype_auth_refresh"));

    setIsSaving(false);
    showToast("Cập nhật thông tin hồ sơ Ban tổ chức & tài khoản quyết toán thành công!", "success");
  };

  return (
    <OrganizerLayout
      title="Cấu Hình Ban Tổ Chức"
      subtitle="Quản lý hồ sơ pháp lý, thông tin đại diện thương hiệu và tài khoản ngân hàng nhận tiền quyết toán vé"
    >
      <div className="max-w-4xl space-y-8">
        {/* 1. BRAND & KYC PROFILE BANNER */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black font-heading shadow-md shadow-indigo-100">
                HL
              </div>
              <button
                type="button"
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                title="Thay đổi logo"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 font-heading">
                  {form.organizationName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ĐÃ XÁC THỰC KYC
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium flex flex-wrap items-center gap-2">
                <span>Mã số thuế: <strong className="text-slate-700 font-mono">{form.taxCode}</strong></span>
                <span>•</span>
                <span>Tài khoản: <strong className="text-slate-700">{form.businessEmail}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. FORM CONFIGURATION */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION A: THÔNG TIN PHÁP LÝ DOANH NGHIỆP */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase font-heading flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                Hồ Sơ Pháp Lý Doanh Nghiệp
              </h3>
              <span className="text-xs text-slate-400 font-medium">* Bắt buộc cho việc đối soát hợp đồng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Tên Đơn Vị / Công Ty Tổ Chức
                </label>
                <input
                  type="text"
                  value={form.organizationName}
                  onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Mã Số Thuế (MST) / Giấy Phép KD
                </label>
                <input
                  type="text"
                  value={form.taxCode}
                  onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Hotline Ban Tổ Chức (Hỗ Trợ Khán Giả)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Email Doanh Nghiệp (Nhận Báo Cáo Quyết Toán)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={form.businessEmail}
                    onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Website / Fanpage Chính Thức
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Địa Chỉ Trụ Sở Doanh Nghiệp
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={form.headquartersAddress}
                    onChange={(e) => setForm({ ...form, headquartersAddress: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN QUYẾT TOÁN */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase font-heading flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                Tài Khoản Ngân Hàng Nhận Quyết Toán Tiền Vé
              </h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Tự động đối soát 24H-48H
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Lưu ý:</strong> Tên chủ tài khoản phải trùng khớp với tên pháp nhân đăng ký kinh doanh hoặc người đại diện pháp luật đã được thẩm định KYC.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Ngân Hàng Thụ Hưởng
                </label>
                <select
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all cursor-pointer shadow-sm"
                >
                  <option value="Techcombank (Ngân hàng Kỹ Thương Việt Nam)">Techcombank - Ngân hàng Kỹ Thương</option>
                  <option value="Vietcombank (Ngân hàng Ngoại Thương Việt Nam)">Vietcombank - Ngân hàng Ngoại Thương</option>
                  <option value="MB Bank (Ngân hàng Quân Đội)">MB Bank - Ngân hàng Quân Đội</option>
                  <option value="ACB (Ngân hàng Á Châu)">ACB - Ngân hàng Á Châu</option>
                  <option value="VPBank (Ngân hàng Việt Nam Thịnh Vượng)">VPBank - Việt Nam Thịnh Vượng</option>
                  <option value="BIDV (Ngân hàng Đầu tư và Phát triển)">BIDV - Đầu tư và Phát triển VN</option>
                  <option value="VietinBank (Ngân hàng Công Thương Việt Nam)">VietinBank - Công Thương Việt Nam</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Số Tài Khoản Ngân Hàng
                </label>
                <input
                  type="text"
                  value={form.bankAccountNo}
                  onChange={(e) => setForm({ ...form, bankAccountNo: e.target.value })}
                  placeholder="Ví dụ: 19034882190012"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Tên Chủ Tài Khoản (In hoa không dấu)
                </label>
                <input
                  type="text"
                  value={form.bankAccountName}
                  onChange={(e) => setForm({ ...form, bankAccountName: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION C: NGƯỜI ĐẠI DIỆN PHÁP LUẬT */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase font-heading flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                Người Đại Diện Theo Pháp Luật
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Họ Và Tên Người Đại Diện
                </label>
                <input
                  type="text"
                  value={form.representativeName}
                  onChange={(e) => setForm({ ...form, representativeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Số CCCD / Hộ Chiếu
                </label>
                <input
                  type="text"
                  value={form.representativeId}
                  onChange={(e) => setForm({ ...form, representativeId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black font-heading uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-indigo-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Đang Lưu..." : "Lưu Thay Đổi Hồ Sơ"}</span>
            </button>
          </div>
        </form>
      </div>
    </OrganizerLayout>
  );
};
