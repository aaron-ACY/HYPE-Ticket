import React from "react";
import { Minus, Plus, Ticket } from "lucide-react";
import { TicketType } from "../../types";
import { Badge } from "../common/Badge";

interface TicketCardProps {
  ticket: TicketType;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxLimit?: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  quantity,
  onQuantityChange,
  maxLimit = 5,
}) => {
  const isSoldOut = ticket.capacity - ticket.sold <= 0;
  const remaining = ticket.capacity - ticket.sold;

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(ticket.price);

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxLimit && quantity < remaining) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div
      className={`border rounded-2xl p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        isSoldOut
          ? "border-white/5 bg-bg-surface/30 opacity-60"
          : quantity > 0
          ? "border-white/50 bg-[#14141E] shadow-[0_0_30px_rgba(255,255,255,0.06)]"
          : "border-white/5 bg-bg-surface/90 hover:border-white/15"
      }`}
    >
      {/* Left Column: Ticket Info */}
      <div className="flex-1 flex gap-4 items-start">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isSoldOut
              ? "bg-white/5 text-zinc-500"
              : quantity > 0
              ? "bg-white/10 border border-white/20 text-white"
              : "bg-white/5 border border-white/5 text-zinc-400"
          }`}
        >
          <Ticket className="w-5 h-5" />
        </div>
        
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-base text-white tracking-wide">{ticket.name}</h4>
            {isSoldOut ? (
              <Badge variant="error" size="sm">Hết vé</Badge>
            ) : remaining <= 10 ? (
              <Badge variant="warning" size="sm">Sắp hết ({remaining} vé)</Badge>
            ) : (
              <Badge variant="secondary" size="sm">Còn {remaining} vé</Badge>
            )}
          </div>
          {ticket.description && (
            <p className="text-xs text-zinc-455 leading-relaxed max-w-md font-semibold">
              {ticket.description}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Pricing & Quantity */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Giá vé</p>
          <p className="text-lg font-black text-brand-price tracking-tight">{formattedPrice}</p>
        </div>

        {/* Quantity Controls */}
        {isSoldOut ? (
          <span className="text-xs font-bold text-rose-400 tracking-wider uppercase border border-rose-950 bg-rose-950/20 px-3 py-1.5 rounded-lg select-none">
            Hết vé
          </span>
        ) : (
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-white/5 rounded-xl p-1 shadow-inner">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center text-sm font-bold text-white select-none">
              {quantity}
            </span>
            
            <button
              onClick={handleIncrease}
              disabled={quantity >= maxLimit || quantity >= remaining}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
