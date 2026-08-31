import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, ArrowLeft, ShieldAlert } from "lucide-react";
import { getOrders, deleteOrder } from "../../data/orders";
import { OrderCard } from "../../components/user/OrderCard";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Order } from "../../types";

import { PhoneUpdateBanner } from "../../components/common/PhoneUpdateBanner";

export const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setOrdersList(getOrders(user.email, { name: user.name, phone: user.phone }));
    } else {
      setOrdersList([]);
    }
  }, [isAuthenticated, user?.email, user?.name, user?.phone]);

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    if (user?.email) {
      setOrdersList(getOrders(user.email, { name: user.name, phone: user.phone }));
    }
    showToast("Đã xóa vé thành công!", "success");
  };

  // Safe Guard Route
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center gap-6 bg-bg-main min-h-[70vh] justify-center">
        <div className="w-14 h-14 bg-brand-primary/15 border border-brand-primary/30 rounded-full flex items-center justify-center text-brand-primary shadow-lg shadow-pink-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white leading-none font-heading uppercase tracking-wide">Chưa Đăng Nhập</h2>
        <p className="text-sm text-zinc-550 max-w-xs leading-relaxed font-semibold">
          Vui lòng đăng nhập tài khoản để xem danh sách vé sự kiện của bạn.
        </p>
        <Link to="/login" className="w-full">
          <Button variant="gradient" fullWidth className="font-heading uppercase text-xs tracking-wider font-bold py-3">Đăng nhập ngay</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 text-left min-h-[75vh] bg-bg-main">
      {/* Return link */}
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-550 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Hồ sơ cá nhân
      </Link>

      <div className="pb-6 border-b border-white/5 mb-10">
        <h1 className="text-3xl sm:text-4.5xl font-black text-white uppercase tracking-tight font-heading">Vé Của Tôi</h1>
        <p className="text-sm text-zinc-500 font-semibold mt-1">Danh sách các vé sự kiện bạn đã mua thành công</p>
      </div>

      <PhoneUpdateBanner className="mb-8" />

      {ordersList.length === 0 ? (
        <div className="py-8">
          <EmptyState
            title="Bạn chưa đặt vé nào"
            description="Lịch sử mua vé của bạn đang trống. Hãy tìm các show diễn cực chất và đặt vé ngay hôm nay!"
            icon={<Ticket className="w-8 h-8 text-zinc-500" />}
            actionText="Khám phá sự kiện ngay"
            onActionClick={() => window.location.href = "/events"}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {ordersList.map((order) => (
            <OrderCard key={order.id} order={order} onDelete={handleDeleteOrder} />
          ))}
        </div>
      )}
    </div>
  );
};
