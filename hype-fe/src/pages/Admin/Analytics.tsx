import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  MapPin,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Sparkles,
  Award,
  Wallet,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";

export const AdminAnalytics: React.FC = () => {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "Q3" | "YTD">("30D");

  // Dynamic statistics based on timeRange
  const statsByRange = {
    "7D": {
      gmv: "385,000,000 đ",
      revenue: "38,500,000 đ",
      orders: "1,240 đơn",
      aov: "310,480 đ",
      growth: "+18.2%",
      refundRate: "0.8%",
    },
    "30D": {
      gmv: "1,450,000,000 đ",
      revenue: "145,000,000 đ",
      orders: "4,820 đơn",
      aov: "300,820 đ",
      growth: "+24.8%",
      refundRate: "1.2%",
    },
    "Q3": {
      gmv: "3,850,000,000 đ",
      revenue: "385,000,000 đ",
      orders: "12,900 đơn",
      aov: "298,400 đ",
      growth: "+45.6%",
      refundRate: "1.4%",
    },
    "YTD": {
      gmv: "9,200,000,000 đ",
      revenue: "920,000,000 đ",
      orders: "31,400 đơn",
      aov: "292,900 đ",
      growth: "+68.4%",
      refundRate: "1.1%",
    },
  };

  const currentStats = statsByRange[timeRange];

  // Payment Gateways Breakdown
  const paymentGateways = [
    {
      name: "VNPay QR & Ngân hàng nội địa",
      share: 48,
      amount: "696,000,000 đ",
      transactions: 2314,
      fee: "1.1%",
      color: "bg-blue-600",
    },
    {
      name: "Ví Điện Tử MoMo",
      share: 32,
      amount: "464,000,000 đ",
      transactions: 1542,
      fee: "1.5%",
      color: "bg-pink-600",
    },
    {
      name: "Thẻ Quốc Tế (Visa / Mastercard)",
      share: 15,
      amount: "217,500,000 đ",
      transactions: 723,
      fee: "2.2%",
      color: "bg-indigo-600",
    },
    {
      name: "ZaloPay & Ví Khác",
      share: 5,
      amount: "72,500,000 đ",
      transactions: 241,
      fee: "1.3%",
      color: "bg-emerald-600",
    },
  ];

  // Geographic Sales Distribution
  const geoSales = [
    { city: "TP. Hồ Chí Minh", percent: 62, revenue: "899,000,000 đ", events: 8 },
    { city: "Hà Nội", percent: 26, revenue: "377,000,000 đ", events: 4 },
    { city: "Đà Nẵng", percent: 8, revenue: "116,000,000 đ", events: 2 },
    { city: "Địa điểm khác", percent: 4, revenue: "58,000,000 đ", events: 1 },
  ];

  // Top Performing Events Leaderboard
  const topEvents = [
    {
      rank: 1,
      name: "HYPE FEST 2026 - Neon Beats in the Dark",
      organizer: "Hype Media Asia",
      revenue: "540,000,000 đ",
      ticketsSold: 1420,
      fillRate: "71%",
    },
    {
      rank: 2,
      name: "Cyber Sound Arena - Electric Symphony Live",
      organizer: "SpaceSpeakers Group",
      revenue: "400,500,000 đ",
      ticketsSold: 890,
      fillRate: "59%",
    },
    {
      rank: 3,
      name: "Indie Sunset Acoustic Night Vol. 4",
      organizer: "Mây Lang Thang Concerts",
      revenue: "150,000,000 đ",
      ticketsSold: 300,
      fillRate: "100%",
    },
    {
      rank: 4,
      name: "Saigon Classical Romance Concert",
      organizer: "Saigon Philharmonic Orchestra",
      revenue: "120,000,000 đ",
      ticketsSold: 450,
      fillRate: "56%",
    },
  ];

  return (
    <AdminLayout
      title="Thống Kê Doanh Số Chuyên Sâu"
      subtitle="Báo cáo phân tích doanh thu GMV, cổng thanh toán, khu vực địa lý và hiệu suất sự kiện"
    >
      <div className="space-y-8">
        {/* Filter Bar & Export Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Khoảng thời gian phân tích
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[
                { key: "7D", label: "7 ngày qua" },
                { key: "30D", label: "30 ngày qua" },
                { key: "Q3", label: "Quý 3/2026" },
                { key: "YTD", label: "Năm 2026 (YTD)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTimeRange(tab.key as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === tab.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("Đang xuất file Excel dữ liệu tài chính...", "info")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Báo Cáo Excel</span>
            </button>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Doanh Số GMV
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {currentStats.gmv}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {currentStats.growth} cùng kỳ
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Phí Dịch Vụ Sàn (10%)
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {currentStats.revenue}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Lợi nhuận ròng sàn nhận</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tổng Lượt Đặt Vé
              </span>
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {currentStats.orders}
              </p>
              <p className="text-xs text-violet-600 font-semibold mt-1">
                Giá trị TB (AOV): {currentStats.aov}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Tỷ Lệ Hoàn Vé (Refund)
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <RefreshCcw className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading whitespace-nowrap">
                {currentStats.refundRate}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Mức an toàn cực cao (&lt; 2%)</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Payment Gateways Breakdown & Geo Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Gateways Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Cơ Cấu Cổng Thanh Toán Trực Tuyến
              </h3>
              <span className="text-xs text-slate-500 font-medium">Tỷ lệ thị phần</span>
            </div>

            <div className="space-y-4">
              {paymentGateways.map((gw, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{gw.name}</span>
                    <span className="font-semibold text-slate-600">
                      {gw.amount} <strong className="text-indigo-600">({gw.share}%)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${gw.color} h-full rounded-full`} style={{ width: `${gw.share}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{gw.transactions} giao dịch thành công</span>
                    <span>Phí cổng: {gw.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Sales Distribution */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                Phân Bổ Doanh Số Theo Khu Vực
              </h3>
              <span className="text-xs text-slate-500 font-medium">Địa lý tổ chức</span>
            </div>

            <div className="space-y-4">
              {geoSales.map((geo, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">{geo.city}</span>
                    <span className="text-emerald-600">{geo.revenue}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${geo.percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{geo.events} sự kiện quy mô lớn</span>
                    <span>{geo.percent}% tổng doanh số</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Events Leaderboard Table */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Bảng Xếp Hạng Top Sự Kiện Doanh Thu Kỷ Lục
            </h3>
            <span className="text-xs text-slate-400 font-medium">Toàn hệ thống</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider font-heading bg-slate-50/70">
                  <th className="py-3 px-4">Hạng</th>
                  <th className="py-3 px-4">Tên Sự Kiện</th>
                  <th className="py-3 px-4">Ban Tổ Chức</th>
                  <th className="py-3 px-4">Số Vé Bán Ra</th>
                  <th className="py-3 px-4">Tỷ Lệ Lấp Đầy</th>
                  <th className="py-3 px-4 text-right">Tổng Doanh Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-xs text-slate-700">
                {topEvents.map((ev) => (
                  <tr key={ev.rank} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          ev.rank === 1
                            ? "bg-amber-100 text-amber-800"
                            : ev.rank === 2
                            ? "bg-slate-200 text-slate-800"
                            : ev.rank === 3
                            ? "bg-amber-700/15 text-amber-900"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{ev.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs font-heading">
                      {ev.name}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-700 font-semibold">{ev.organizer}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold whitespace-nowrap">
                      {ev.ticketsSold} vé
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ev.fillRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {ev.revenue}
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
