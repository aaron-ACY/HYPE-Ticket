import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Event } from "../../types";
import { Button } from "../common/Button";
import { Hero3DCanvas } from "../home/Hero3DCanvas";

interface HeroCarouselProps {
  events: Event[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [events]);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(currentEvent.priceFrom);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[650px] bg-bg-main overflow-hidden border-b border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Main Background Cover Image */}
          {imageErrors[currentEvent.id] ? (
            <div className="w-full h-full gradient-bg opacity-25 filter blur-[40px]" />
          ) : (
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              onError={() => setImageErrors((prev) => ({ ...prev, [currentEvent.id]: true }))}
              className="w-full h-full object-cover object-center scale-100 filter brightness-75 transition-transform duration-1000"
            />
          )}
          {/* Cinematic Overlays using design token #18181C */}
          {/* Bottom-to-top gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181c] via-[#18181c]/30 to-transparent" />
          {/* Left-to-right gradient for text readability (only on larger screens) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#18181c]/95 via-[#18181c]/30 to-transparent hidden md:block" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Content container */}
      <div className="absolute inset-0 flex items-end md:items-center py-10 px-4 sm:px-6 lg:px-12 z-10">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col md:grid md:grid-cols-12 gap-8 items-end md:items-center">
          {/* Left content column */}
          <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-left">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 p-1 px-3 bg-brand-primary/10 border border-brand-primary/20 rounded-full w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-bold text-brand-primary tracking-widest uppercase font-heading">
                Sự kiện nổi bật
              </span>
            </motion.div>

            {/* Event Title - Large, bold,Outfit font */}
            <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6px font-extrabold text-white leading-tight sm:leading-[1.18] tracking-tight line-clamp-2 uppercase font-heading"
              style={{ fontSize: "clamp(30px, 5vw, 68px)" }}
            >
              {currentEvent.title}
            </motion.h1>

            {/* Event Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-3 max-w-xl font-medium"
            >
              {currentEvent.description}
            </motion.p>

            {/* Event Time & Venue Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-zinc-300 border-t border-white/5 pt-5 uppercase tracking-wide font-heading"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                {currentEvent.date} • {currentEvent.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00F0FF]" />
                {currentEvent.venueName} ({currentEvent.location})
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3 sm:gap-4 mt-2"
            >
              <Link to={`/events/${currentEvent.slug}`}>
                <Button variant="gradient" size="lg" className="font-heading font-bold uppercase tracking-wider" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Đặt Vé Ngay
                </Button>
              </Link>
              <Link to={`/events/${currentEvent.slug}`}>
                <Button variant="outline" size="lg" className="font-heading font-bold uppercase tracking-wider border-white/10 hover:bg-white/5">
                  Chi tiết
                </Button>
              </Link>
              <div className="hidden lg:flex items-baseline gap-1.5 ml-4 border-l border-white/10 pl-5 py-1 justify-center text-left">
                <span className="text-xs font-bold text-zinc-400 font-heading">Vé chỉ từ</span>
                <span className="text-lg font-black text-brand-price tracking-tight font-heading">{formattedPrice}</span>
              </div>
            </motion.div>
            {/* Right 3D Ticket Canvas column */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="w-full max-w-[420px] aspect-square flex items-center justify-center">
                <Hero3DCanvas 
                  ticketTitle={currentEvent.title}
                  ticketSub="VIP ALL-ACCESS PASS"
                  className="scale-90 xl:scale-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Navigations (Next / Prev) */}
      <div className="absolute right-4 bottom-4 md:right-12 md:bottom-12 z-25 flex items-center gap-2.5">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl border border-white/10 hover:border-white/20 bg-black/60 hover:bg-black/80 text-zinc-400 hover:text-white transition-all backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-xl border border-white/10 hover:border-white/20 bg-black/60 hover:bg-black/80 text-zinc-400 hover:text-white transition-all backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slider Pagination Indicators */}
      <div className="absolute left-4 bottom-4 md:left-12 md:bottom-12 z-25 flex items-center gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? "w-8 bg-brand-primary" : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
