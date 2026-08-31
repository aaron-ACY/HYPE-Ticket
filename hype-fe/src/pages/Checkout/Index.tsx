import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Mail, Phone, ShieldCheck, Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { events } from "../../data/events";
import { saveOrder } from "../../data/orders";
import { TicketCard } from "../../components/checkout/TicketCard";
import { OrderSummary } from "../../components/checkout/OrderSummary";
import { PaymentMethod } from "../../components/checkout/PaymentMethod";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { GoogleLoginButton } from "../../components/auth/GoogleLoginButton";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Order } from "../../types";

export const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const eventId = searchParams.get("event");
  const event = events.find((e) => e.id === eventId);

  // States
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("MoMo");
  const [isProcessing, setIsProcessing] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // If no event found, redirect to explore events page
  useEffect(() => {
    if (!eventId || !event) {
      showToast("Vui lòng chọn sự kiện để bắt đầu đặt vé", "warning");
      navigate("/events");
    }
  }, [eventId, event, navigate, showToast]);

  // Safeguard: Bắt buộc đăng nhập để mua vé
  if (!isAuthenticated && event) {
    const checkoutRedirectUrl = `/checkout?event=${event.id}`;
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 bg-bg-main min-h-[75vh] justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-brand-primary/35 rounded-3xl flex items-center justify-center text-brand-primary shadow-2xl shadow-pink-500/20">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-[10px] font-bold text-brand-primary uppercase tracking-widest font-tech">
            XÁC THỰC TÀI KHOẢN MUA VÉ
          </span>
          <h2 className="text-2xl font-black text-white font-heading uppercase tracking-tight">
            Yêu Cầu Đăng Nhập
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-semibold mx-auto">
            Để đảm bảo xuất vé điện tử chính chủ, bảo vệ giao dịch và hỗ trợ tra cứu/hoàn vé tự động, quý khách vui lòng đăng nhập hoặc tạo tài khoản trước khi tiếp tục đặt vé.
          </p>
        </div>

        {/* Selected Event Card Preview */}
        <div className="w-full p-4 rounded-2xl bg-bg-surface border border-white/5 flex items-center gap-3.5 text-left">
          <img src={event.image} alt={event.title} className="w-14 h-14 rounded-xl object-cover" />
          <div className="overflow-hidden">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Sự kiện đã chọn</span>
            <h4 className="text-xs font-bold text-white uppercase truncate font-heading">{event.title}</h4>
            <span className="text-[11px] text-brand-price font-bold">{event.date} • {event.location}</span>
          </div>
        </div>

        <div className="w-full space-y-3 pt-2">
          <Link to={`/login?redirect=${encodeURIComponent(checkoutRedirectUrl)}`} className="w-full block">
            <Button variant="gradient" fullWidth size="lg" className="font-heading uppercase text-xs tracking-wider font-bold py-3.5" rightIcon={<LogIn className="w-4 h-4" />}>
              Đăng nhập tài khoản
            </Button>
          </Link>

          <Link to={`/register?redirect=${encodeURIComponent(checkoutRedirectUrl)}`} className="w-full block">
            <Button variant="secondary" fullWidth size="lg" className="font-heading uppercase text-xs tracking-wider font-bold py-3.5" rightIcon={<UserPlus className="w-4 h-4" />}>
              Tạo tài khoản mới
            </Button>
          </Link>
        </div>

        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors pt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại chi tiết sự kiện</span>
        </Link>
      </div>
    );
  }

  if (!event) return null;

  const handleQuantityChange = (ticketName: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketName]: qty,
    }));
  };

  const getSummaryItems = () => {
    return event.ticketTypes.map((t) => ({
      ticketName: t.name,
      price: t.price,
      quantity: quantities[t.name] || 0,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Họ tên không được để trống";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(phone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    const selectedItems = getSummaryItems().filter((item) => item.quantity > 0);
    if (selectedItems.length === 0) {
      showToast("Vui lòng chọn ít nhất 01 vé để tiếp tục", "error");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate Transaction Processing
    setTimeout(() => {
      const selectedItems = getSummaryItems()
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          ticketName: item.ticketName,
          price: item.price,
          quantity: item.quantity,
        }));

      const feePerTicket = 10000;
      const totalTickets = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
      const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const fee = totalTickets * feePerTicket;
      const total = subtotal + fee;

      const randomOrderId = `HT-${Math.floor(100000 + Math.random() * 900000)}-${paymentMethod.split(" ")[0].toUpperCase()}`;

      const newOrder: Order = {
        id: randomOrderId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventImage: event.image,
        items: selectedItems,
        subtotal,
        fee,
        total,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      // Persistence
      saveOrder(newOrder);

      // Gửi email xác nhận đặt vé về Backend
      const firstItem = selectedItems[0];
      fetch("http://localhost:8080/hype/api/v1/users/send-ticket-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toEmail: newOrder.customerEmail,
          userName: newOrder.customerName,
          eventName: newOrder.eventTitle,
          ticketCode: newOrder.id,
          price: newOrder.total.toLocaleString("vi-VN") + " đ",
          ticketType: firstItem ? firstItem.ticketName : "STANDARD",
          eventDate: newOrder.eventDate,
          eventLocation: newOrder.eventLocation,
          quantity: totalTickets
        })
      }).catch(err => console.error("Lỗi gửi email xác nhận:", err));

      setIsProcessing(false);
      showToast("Đặt vé thành công!", "success");
      navigate(`/checkout/success?orderId=${newOrder.id}`);
    }, 2200);
  };

  const hasSelectedTickets = getSummaryItems().some((i) => i.quantity > 0);

  return (
    <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 text-left min-h-[85vh] bg-bg-main">
      {/* 1. Transaction Processing Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-bg-main/95 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-[#D946EF] animate-spin" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-heading">Đang xử lý giao dịch</h2>
          <p className="text-sm text-zinc-400">Vui lòng không đóng trình duyệt hoặc tải lại trang...</p>
        </div>
      )}

      {/* Return button */}
      <Link
        to={`/events/${event.slug}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-550 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại trang chi tiết sự kiện
      </Link>

      {/* Redesigned minimal Page Header */}
      <div className="pb-8 border-b border-white/5 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4.5xl font-black text-white uppercase tracking-tight font-heading">Đặt Vé & Thanh Toán</h1>
          <p className="text-sm text-zinc-500 font-semibold leading-relaxed mt-1">Hoàn thiện thông tin mua vé sự kiện trực tuyến</p>
        </div>
        
        {/* Step Indicator Row */}
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider font-heading select-none">
          <span className="text-white font-bold">01 Vé</span>
          <span className="text-zinc-700">───</span>
          <span className={hasSelectedTickets ? "text-white font-bold" : "text-zinc-500"}>02 Thông tin</span>
          <span className="text-zinc-700">───</span>
          <span className={hasSelectedTickets && name ? "text-white font-bold" : "text-zinc-500"}>03 Thanh toán</span>
          <span className="text-zinc-700">───</span>
          <span className="text-zinc-600">04 Hoàn tất</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Ticket types, Buyer details & Payment selects */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Step 1: Select tickets */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2.5">
              <span className="w-6.5 h-6.5 rounded-lg bg-white text-[#050507] flex items-center justify-center font-extrabold text-xs font-heading">1</span>
              <h3 className="font-extrabold text-base text-white tracking-wider uppercase font-heading">Chọn hạng vé</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {event.ticketTypes.map((ticket, index) => (
                <TicketCard
                  key={index}
                  ticket={ticket}
                  quantity={quantities[ticket.name] || 0}
                  onQuantityChange={(qty) => handleQuantityChange(ticket.name, qty)}
                />
              ))}
            </div>
          </section>

          {/* Step 2: Customer Information */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2.5">
              <span className="w-6.5 h-6.5 rounded-lg bg-white text-[#050507] flex items-center justify-center font-extrabold text-xs font-heading">2</span>
              <h3 className="font-extrabold text-base text-white tracking-wider uppercase font-heading">Thông tin người mua</h3>
            </div>

            <div className="p-6 border border-white/5 bg-bg-surface rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5 shadow-2xl">
              <Input
                label="Họ tên người nhận"
                type="text"
                placeholder="Nhập họ và tên đầy đủ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftIcon={<UserIcon className="w-4 h-4 text-zinc-500" />}
              />
              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="Nhập số điện thoại liên hệ"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                leftIcon={<Phone className="w-4 h-4 text-zinc-500" />}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Email nhận vé"
                  type="email"
                  placeholder="Vé điện tử sẽ gửi về email này"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4 text-zinc-500" />}
                />
              </div>
            </div>
          </section>

          {/* Step 3: Payment Method */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2.5">
              <span className="w-6.5 h-6.5 rounded-lg bg-white text-[#050507] flex items-center justify-center font-extrabold text-xs font-heading">3</span>
              <h3 className="font-extrabold text-base text-white tracking-wider uppercase font-heading">Cổng thanh toán</h3>
            </div>

            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </section>

          {/* Safety terms display */}
          <div className="flex gap-3 p-5 border border-white/5 bg-white/[0.02] rounded-2xl text-xs text-zinc-450 leading-relaxed font-semibold items-center justify-center select-none shadow-md">
            <ShieldCheck className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <span>Mọi giao dịch thanh toán đều được mã hóa SSL an toàn. Dữ liệu thẻ và ví điện tử của bạn không được lưu lại.</span>
          </div>
        </div>

        {/* Right Side: Sticky Checkout Math summaries */}
        <div className="lg:col-span-4">
          <OrderSummary
            eventTitle={event.title}
            eventDate={event.date}
            eventLocation={`${event.venueName} (${event.location})`}
            items={getSummaryItems()}
            onActionClick={handlePay}
            actionText="Thanh toán ngay"
            isLoading={isProcessing}
            disabled={getSummaryItems().reduce((acc, i) => acc + i.quantity, 0) === 0}
          />
        </div>
      </div>
    </div>
  );
};
