import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Sparkles, Disc } from "lucide-react";
import { Event } from "../../types";

interface HeadlinerFeatureProps {
  event: Event;
}

export const HeadlinerFeature: React.FC<HeadlinerFeatureProps> = ({ event }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(event.priceFrom);

  return (
    <section className="relative w-full py-20 sm:py-28 border-t border-b editorial-border bg-[#08080d] overflow-hidden text-left">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header Line */}
        <div className="flex items-center justify-between font-tech text-xs text-zinc-500 uppercase tracking-widest pb-8">
          <div className="flex items-center gap-3 text-rose-500">
            <span>[ 02 ]</span>
            <span>THE HEADLINER ARCHIVE // CRITICS' SELECTION</span>
          </div>
          <span className="hidden sm:inline text-zinc-400">ACOUSTIC SPEC: ARENA DYNAMICS</span>
        </div>

        {/* Asymmetrical Magazine Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Full-Bleed Cinematic Art (Col span 7) */}
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden aspect-[16/10] bg-[#050508] border editorial-border shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-90 contrast-110"
            />
            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080d] via-transparent to-black/30 pointer-events-none" />

            {/* Live Audio Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border editorial-border text-[11px] font-tech text-white">
              <Disc className="w-4 h-4 text-rose-500 animate-spin" />
              <span>SPATIAL AUDIO ARENA</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-tech text-xs text-zinc-400">
              <span>EDITION: VERIFIED MASTER TICKET</span>
              <span className="text-white font-bold">{event.date}</span>
            </div>
          </div>

          {/* Right Column: Editorial Typographic Narrative (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-tech font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sự Kiện Tiêu Điểm Mùa Này</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading leading-tight sm:leading-[1.18] tracking-tight">
                {event.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Spec Table */}
            <div className="space-y-3 font-tech text-xs text-zinc-300 border-t border-b editorial-border py-6">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">SCHEDULE</span>
                <span className="text-white font-bold">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">LOCATION</span>
                <span className="text-white font-bold">{event.venueName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">PASS TIER</span>
                <span className="text-rose-400 font-bold">VIP ACCESS + DIGITAL COLLECTIBLE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">ACCESS FROM</span>
                <span className="text-white text-base font-black font-heading">{formattedPrice}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex items-center gap-4">
              <Link
                to={`/events/${event.slug}`}
                viewTransition
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-rose-500 text-black hover:text-white text-xs font-black tracking-widest uppercase transition-all duration-300 font-heading active:scale-95 cursor-pointer shadow-2xl"
              >
                <span>BOOK VIP PASS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
