import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Calendar, MapPin, Receipt, ArrowRight, Home } from "lucide-react";
import { getOrderById } from "../../data/orders";
import { QRCode } from "../../components/checkout/QRCode";
import { Button } from "../../components/common/Button";
import { Order } from "../../types";

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2 font-heading uppercase">Đơn hàng không tồn tại</h2>
        <p className="text-sm text-zinc-500 mb-6">Không tìm thấy mã đơn hàng hợp lệ.</p>
        <Link to="/">
          <Button variant="primary">Trở về trang chủ</Button>
        </Link>
      </div>
    );
  }

  const totalTickets = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(order.total);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center bg-bg-main min-h-[80vh] flex flex-col justify-center">
      {/* 1. Success Message Card Header */}
      <div className="flex flex-col items-center gap-4.5 mb-10">
        <div className="w-16 h-16 bg-emerald-950/20 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-450 shadow-2xl animate-in zoom-in duration-300">
          <CheckCircle className="w-9 h-9" />
        </div>
        
        <div className="space-y-1.5">
          <h1 className="text-2.5xl sm:text-3.5xl font-black text-white uppercase tracking-tight font-heading">
            Đặt Vé Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-semibold leading-relaxed">
            Vé điện tử của bạn đã được khởi tạo và gửi về email:{" "}
            <span className="text-brand-primary font-bold underline select-all">{order.customerEmail}</span>
          </p>
        </div>
      </div>

      {/* 2. QR Code checkin ticket container (editorial ticket styling) */}
      <div className="bg-bg-surface border border-white/5 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center text-left mb-8 shadow-2xl shadow-black relative overflow-hidden">
        {/* Decortive ticket cuts */}
        <div className="absolute w-8 h-8 rounded-full bg-bg-main -left-4 top-[50%] border-r border-white/5 hidden sm:block" />
        <div className="absolute w-8 h-8 rounded-full bg-bg-main -right-4 top-[50%] border-l border-white/5 hidden sm:block" />

        {/* QR column */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 z-10">
          <div className="p-3.5 bg-white rounded-2xl shadow-inner">
            <QRCode value={order.id} size={130} />
          </div>
          <div className="text-center mt-1">
            <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest leading-none">
              Mã vé check-in
            </span>
            <p className="text-xs font-mono font-bold text-[#00F0FF] mt-1 select-all">
              {order.id}
            </p>
          </div>
        </div>

        {/* Ticket Details summary */}
        <div className="flex-1 flex flex-col gap-4 border-t border-white/5 md:border-0 pt-6 md:pt-0 z-10">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest font-heading">
              Sự kiện tham dự
            </span>
            <h3 className="font-extrabold text-lg text-white leading-tight uppercase font-heading">
              {order.eventTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-zinc-400 border-t border-b border-white/5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>{order.eventDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span className="truncate">{order.eventLocation}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold">
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 leading-none font-heading">
                Hạng vé ({totalTickets} vé)
              </p>
              <div className="text-xs font-extrabold text-zinc-300 mt-1 font-heading font-semibold">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {idx > 0 && ", "}
                    {item.ticketName} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 leading-none font-heading">
                Tổng cộng
              </p>
              <p className="font-black text-base text-brand-price tracking-tight font-heading mt-0.5">
                {formattedTotal}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Guidelines alert */}
      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-zinc-400 leading-relaxed text-left mb-10 flex gap-4 font-semibold shadow-md">
        <Receipt className="w-5 h-5 text-brand-primary flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-white font-bold font-heading uppercase text-[10px] tracking-wider">Hướng dẫn soát vé check-in:</p>
          <p className="mt-0.5">
            Lưu mã QR này về điện thoại của bạn hoặc truy cập vào Email để lấy vé. Xuất trình mã QR tại cửa soát vé sự kiện để đổi lấy vòng tay vào cổng. Không chia sẻ mã QR này cho bất kỳ ai.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4.5">
        <Link to="/">
          <Button variant="outline" leftIcon={<Home className="w-4 h-4" />} className="border-white/10 bg-bg-surface hover:bg-white/5 font-heading uppercase text-xs tracking-wider font-bold">
            Về trang chủ
          </Button>
        </Link>
        <Link to="/orders">
          <Button variant="gradient" className="font-heading uppercase text-xs tracking-wider font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Xem vé của tôi
          </Button>
        </Link>
      </div>
    </div>
  );
};
