import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, ArrowRight, CheckCircle, Trash2, Sparkles, Pin } from "lucide-react";
import { Order } from "../../types";
import { Button } from "../common/Button";

interface OrderCardProps {
  order: Order;
  onDelete?: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onDelete }) => {
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(order.total);

  return (
    <div className={`bg-bg-surface border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-white/15 hover:shadow-2xl hover:shadow-black/70 transition-all text-left ${
      order.isSample ? "border-amber-500/25 bg-[#0D0D14]" : "border-white/5"
    }`}>
      {/* Left Column: Event details */}
      <div className="flex gap-4 items-start md:items-center flex-1">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5 relative">
          <img
            src={order.eventImage}
            alt={order.eventTitle}
            className="w-full h-full object-cover"
          />
          {order.isSample && (
            <div className="absolute top-1 left-1 bg-amber-500 text-[#050507] text-[8px] font-black font-tech px-1.5 py-0.5 rounded shadow">
              SAMPLE
            </div>
          )}
        </div>
        
        <div className="space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            {order.isSample ? (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1.5 w-fit select-none font-tech shadow-sm">
                <Pin className="w-3 h-3 text-amber-400 fill-amber-400 rotate-45" />
                VÉ MẪU GHIM ĐẦU TRANG (DEMO)
              </span>
            ) : order.status === "REFUND_PENDING" ? (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1 w-fit select-none font-tech">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Chờ duyệt hoàn tiền
              </span>
            ) : order.status === "REFUNDED" ? (
              <span className="text-[10px] font-bold text-rose-300 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1 w-fit select-none font-tech">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Đã hoàn tiền (Đã hủy)
              </span>
            ) : order.status === "REJECTED_REFUND" ? (
              <span className="text-[10px] font-bold text-orange-300 bg-orange-950/30 px-2 py-0.5 rounded border border-orange-500/40 flex items-center gap-1 w-fit select-none font-tech">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Từ chối hoàn tiền
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900 flex items-center gap-1 w-fit select-none">
                <CheckCircle className="w-3.5 h-3.5" />
                Đã thanh toán
              </span>
            )}
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider font-bold">
              Mã: {order.id}
            </span>
          </div>
          <h4 className="font-extrabold text-base text-white tracking-wide truncate uppercase">
            {order.eventTitle}
          </h4>
          
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {order.eventDate}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span className="truncate">{order.eventLocation}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Column: Ticket types breakdown */}
      <div className="md:px-6 py-3 md:py-0 border-t border-b border-white/5 md:border-0 flex flex-col md:text-right gap-1 min-w-[140px]">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex md:justify-end items-center gap-1.5 leading-none">
          <Ticket className="w-3.5 h-3.5 text-zinc-500" />
          Hạng vé
        </p>
        <div className="text-xs font-bold text-zinc-300">
          {order.items.map((item, idx) => (
            <p key={idx}>
              {item.ticketName} <span className="text-zinc-500 font-medium">× {item.quantity}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Right Column: Total Paid & Action */}
      <div className="flex items-center justify-between md:justify-end gap-6 min-w-[180px]">
        <div className="md:text-right">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Tổng tiền</p>
          <p className="text-base font-black text-brand-price tracking-tight">{formattedTotal}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {!order.isSample && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(order.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/25 hover:border-rose-600 text-rose-400 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer h-9 shadow-sm"
              title="Xóa vé"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa vé</span>
            </button>
          )}

          <Link to={`/orders/${order.id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#E2E8F0] text-[#050507] text-xs font-bold transition-all duration-200 cursor-pointer h-9 shadow-md"
            >
              <span>Xem vé</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
