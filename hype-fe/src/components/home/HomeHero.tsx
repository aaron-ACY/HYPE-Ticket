import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Calendar, MapPin, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap, ShieldCheck } from "lucide-react";
import { Event } from "../../types";
import { Button } from "../common/Button";

// Lazy load 3D canvas
const Hero3DCanvas = lazy(() =>
  import("./Hero3DCanvas").then((mod) => ({ default: mod.Hero3DCanvas }))
);

interface HomeHeroProps {
  events: Event[];
}

export const HomeHero: React.FC<HomeHeroProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [events]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[currentIndex];
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(currentEvent.priceFrom);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <div className="relative w-full min-h-[640px] lg:min-h-[720px] bg-[#0c0c12] overflow-hidden border-b border-white/10 flex flex-col justify-between">
      
      {/* 1. Cinematic Background Backdrop with Luminous Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {imageErrors[currentEvent.id] ? (
            <div className="w-full h-full bg-gradient-to-tr from-violet-950/40 via-purple-900/30 to-cyan-950/30 filter blur-[50px]" />
          ) : (
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              onError={() => setImageErrors((prev) => ({ ...prev, [currentEvent.id]: true }))}
              className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.15]"
            />
          )}

          {/* Balanced Gradient Overlays to keep content legible without drowning in pitch black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12]/90 via-[#0c0c12]/40 to-transparent hidden lg:block" />
          
          {/* Ambient Lighting Spots */}
          <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-violet-600/15 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-cyan-500/15 rounded-full filter blur-[100px]" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Top Live Notification Ticker */}
      <div className="relative z-20 w-full border-b border-white/10 bg-black/40 backdrop-blur-md py-2.5 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs font-medium text-zinc-300">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-emerald-400 uppercase tracking-wider font-heading">Đang Mở Bán Trực Tiếp</span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="hidden sm:inline text-zinc-200">100% vé chính hãng, bảo hiểm hoàn tiền nếu sự kiện bị huỷ</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] uppercase tracking-wider">Xác nhận vé tức thì qua Email & QR</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Hero Content Grid */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-14 flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
          
          {/* Left Column: Event Title & Actions (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            
            {/* Category / Feature Tag */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 p-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md w-fit shadow-lg"
            >
              <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
              <span className="text-xs font-extrabold text-white uppercase tracking-widest font-heading">
                Sự Kiện Nổi Bật 2026
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {currentEvent.category.replace("-", " ")}
              </span>
            </motion.div>

            {/* Event Title */}
            <motion.h1
              key={`title-${currentEvent.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-[56px] font-black text-white leading-tight sm:leading-[1.18] tracking-tight uppercase font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              {currentEvent.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              key={`desc-${currentEvent.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-medium line-clamp-2 drop-shadow-md"
            >
              {currentEvent.description}
            </motion.p>

            {/* Date & Location Badges */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-white"
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md shadow-md">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{currentEvent.date} • {currentEvent.time}</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md shadow-md">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{currentEvent.venueName}</span>
              </div>
            </motion.div>

            {/* CTA Buttons & Price */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <Link to={`/events/${currentEvent.slug}`} viewTransition>
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="px-8 py-3.5 font-heading font-black uppercase text-sm tracking-wider bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.45)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] cursor-pointer" 
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Mua Vé Ngay
                </Button>
              </Link>

              <Link to={`/events/${currentEvent.slug}`} viewTransition>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-6 py-3.5 font-heading font-bold uppercase text-sm tracking-wider border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-md cursor-pointer"
                >
                  Xem Sơ Đồ Ghế
                </Button>
              </Link>

              <div className="flex items-baseline gap-2 pl-3 sm:pl-4 border-l border-white/15">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Giá từ</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tight font-heading drop-shadow-md">
                  {formattedPrice}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: WebGL 3D Holographic Ticket (Col span 5) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-full max-w-[480px] aspect-square relative flex items-center justify-center">
              
              {/* Vibrant Ambient Glow Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-purple-500/25 to-cyan-400/30 rounded-full filter blur-[70px] pointer-events-none" />

              <Suspense
                fallback={
                  <div className="w-full h-80 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md animate-pulse flex flex-col items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-pink-400 animate-spin" />
                    <span className="text-xs font-bold text-zinc-200">Đang khởi tạo vé 3D Hologram...</span>
                  </div>
                }
              >
                <Hero3DCanvas
                  ticketTitle={currentEvent.title}
                  ticketSub="VIP ALL-ACCESS PASS"
                  className="w-full h-full"
                />
              </Suspense>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Carousel Indicators & Controls */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 pb-6 flex items-center justify-between">
        
        {/* Progress Bars */}
        <div className="flex items-center gap-2.5">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex ? "w-12 bg-gradient-to-r from-violet-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.7)]" : "w-3 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="p-3 rounded-xl border border-white/15 hover:border-white/30 bg-black/50 hover:bg-black/80 text-zinc-300 hover:text-white transition-all backdrop-blur-md active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="p-3 rounded-xl border border-white/15 hover:border-white/30 bg-black/50 hover:bg-black/80 text-zinc-300 hover:text-white transition-all backdrop-blur-md active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
