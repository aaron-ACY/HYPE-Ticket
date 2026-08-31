import React from "react";
import { Ticket, Calendar, MapPin, Receipt, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";

interface SummaryItem {
  ticketName: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  items: SummaryItem[];
  feePerTicket?: number;
  onActionClick: () => void;
  actionText: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  eventTitle,
  eventDate,
  eventLocation,
  items,
  feePerTicket = 10000,
  onActionClick,
  actionText,
  isLoading = false,
  disabled = false,
}) => {
  const activeItems = items.filter((item) => item.quantity > 0);
  const totalQuantity = activeItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = activeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const fee = totalQuantity * feePerTicket;
  const total = subtotal + fee;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 text-left flex flex-col gap-5 sticky top-24 shadow-2xl shadow-black/85">
      {/* Event Details Header */}
      <div className="space-y-3 pb-4 border-b border-white/5">
        <h3 className="font-extrabold text-lg text-white leading-tight uppercase">{eventTitle}</h3>
        <div className="space-y-1.5 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>{eventLocation}</span>
          </div>
        </div>
      </div>

      {/* Selected Tickets Breakdowns */}
      <div className="space-y-3.5">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Ticket className="w-3.5 h-3.5 text-zinc-500" />
          Vé đã chọn ({totalQuantity})
        </h4>
        
        {activeItems.length === 0 ? (
          <p className="text-sm text-zinc-500 italic py-2">Chưa chọn hạng vé nào.</p>
        ) : (
          <div className="space-y-2.5">
            {activeItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm font-semibold">
                <div className="space-y-0.5">
                  <p className="font-bold text-white leading-none">{item.ticketName}</p>
                  <p className="text-xs text-zinc-500 font-bold">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-extrabold text-zinc-300">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Math summary */}
      <div className="border-t border-white/5 pt-4 space-y-2.5 text-sm font-semibold">
        <div className="flex justify-between text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-zinc-500" />
            Tạm tính
          </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-zinc-400">
          <span>Phí dịch vụ</span>
          <span>{formatCurrency(fee)}</span>
        </div>

        <div className="flex justify-between text-white font-extrabold text-base pt-2.5 border-t border-white/5">
          <span>Tổng cộng</span>
          <span className="text-brand-price">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="gradient"
        size="lg"
        fullWidth
        disabled={disabled || totalQuantity === 0}
        isLoading={isLoading}
        onClick={onActionClick}
        className="mt-3 py-3 font-bold"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {actionText}
      </Button>
    </div>
  );
};
