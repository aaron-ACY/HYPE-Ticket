import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Compass, Sparkles, ArrowRight, Star } from "lucide-react";
import { Event } from "../../types";
import { Button } from "../common/Button";

interface WeekendPickSectionProps {
  event: Event;
}

export const WeekendPickSection: React.FC<WeekendPickSectionProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(event.priceFrom);

  return (
    <section className="relative w-full rounded-3xl overflow-hidden glass-card p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 text-left">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Large Poster Left (Col span 7) */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-video lg:aspect-[16/10] bg-bg-main border border-white/10 group relative shadow-2xl">
          {imageError ? (
            <div className="w-full h-full gradient-bg opacity-20 flex items-center justify-center text-white/50 select-none">
              <span className="text-xs font-bold uppercase tracking-wider font-heading">Hype Ticket Exclusive</span>
            </div>
          ) : (
            <img
              src={event.image}
              alt={event.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-transparent to-transparent pointer-events-none" />

          {/* Top Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-[11px] font-bold uppercase tracking-wider font-heading shadow-lg">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Biên tập viên bình chọn</span>
          </div>
        </div>

        {/* Editorial Content Right (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-brand-amber text-xs font-bold uppercase tracking-widest font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gợi ý cho cuối tuần này</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase font-heading">
              {event.title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            {event.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-col gap-3 text-xs font-semibold text-zinc-200">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 w-fit">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 w-fit">
              <Compass className="w-4 h-4 text-brand-cyan" />
              <span>{event.venueName}</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link to={`/events/${event.slug}`} viewTransition>
              <Button
                variant="gradient"
                size="lg"
                className="px-8 font-heading uppercase text-xs tracking-wider font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Khám Phá Vé Ngay
              </Button>
            </Link>

            <div className="flex items-baseline gap-1.5 pl-2">
              <span className="text-xs text-zinc-400 font-medium">Chỉ từ</span>
              <span className="text-lg font-black text-brand-price font-heading">{formattedPrice}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
