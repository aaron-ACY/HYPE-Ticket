import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowDownToLine,
  History,
} from "lucide-react";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";

export const OrganizerRevenue: React.FC = () => {
  const { showToast } = useToast();

  const [balance] = useState({
    available: 485000000,
    pendingSettlement: 167500000,
    totalPaidOut: 1250000000,
    platformFeeRate: "10%",
  });

  const [payoutHistory] = useState([
    {
      id: "PAY-2026-081",
      event: "Indie Sunset Acoustic Night Vol. 4",
      amount: "67,500,000 đ",
      date: "10/08/2026",
      bank: "Techcombank •••• 8899",
      status: "COMPLETED",
    },
    {
      id: "PAY-2026-072",
      event: "Summer Vibes Beach Music Fest 2026",
      amount: "450,000,000 đ",
      date: "25/07/2026",
      bank: "Techcombank •••• 8899",
      status: "COMPLETED",
    },
    {
      id: "PAY-2026-061",
      event: "SpaceSpeakers Club Tour Vol. 1",
      amount: "732,500,000 đ",
      date: "02/06/2026",
      bank: "Techcombank •••• 8899",
      status: "COMPLETED",
    },
  ]);

  const handleRequestPayout = () => {
    showToast("Yêu cầu rút tiền 485,000,000 đ đã được gửi tới Ban tài chính Hype Ticket!", "success");
  };

  return (
    <OrganizerLayout
      title="Doanh Thu & Đối Soát Tài Chính"
      subtitle="Theo dõi dòng tiền bán vé, số dư khả dụng và tạo lệnh rút tiền quyết toán về tài khoản doanh nghiệp"
    >
      <div className="space-y-8">
        {/* 3 Main Wallet & Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-heading">
                Số Dư Khả Dụng Để Rút
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 font-mono">
                {balance.available.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Đã khấu trừ phí sàn {balance.platformFeeRate}
              </p>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={handleRequestPayout}
              className="font-heading uppercase text-xs tracking-wider font-extrabold py-3 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              leftIcon={<ArrowDownToLine className="w-4 h-4" />}
            >
              Yêu Cầu Rút Tiền Về Ngân Hàng
            </Button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-heading">
                Đang Đối Soát (Chưa Kết Thúc Show)
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 font-mono">
                {balance.pendingSettlement.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Sẽ mở khóa sau khi sự kiện hoàn tất 24h
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng Tiền Đã Quyết Toán
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 font-mono">
                {balance.totalPaidOut.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100% đối soát minh bạch
              </p>
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 uppercase font-heading flex items-center gap-2.5">
              <History className="w-5 h-5 text-indigo-600" />
              Lịch Sử Quyết Toán & Chuyển Khoản
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Đang xuất sao kê đối soát tài chính...", "info")}
              className="text-xs font-heading uppercase tracking-wider font-bold border-slate-300 text-slate-700 hover:bg-slate-50"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Xuất Sao Kê PDF
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                  <th className="pb-3 px-3">Mã Quyết Toán</th>
                  <th className="pb-3 px-3">Show Diễn Đối Soát</th>
                  <th className="pb-3 px-3">Số Tiền</th>
                  <th className="pb-3 px-3">Tài Khoản Nhận</th>
                  <th className="pb-3 px-3">Ngày Chuyển</th>
                  <th className="pb-3 px-3 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-700">
                {payoutHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-3 text-slate-900 font-mono font-bold">{item.id}</td>
                    <td className="py-4 px-3 text-slate-900 font-heading">{item.event}</td>
                    <td className="py-4 px-3 text-emerald-600 font-mono font-bold text-sm">{item.amount}</td>
                    <td className="py-4 px-3 text-slate-500">{item.bank}</td>
                    <td className="py-4 px-3 text-slate-500">{item.date}</td>
                    <td className="py-4 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã Chuyển Tiền
                      </span>
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
