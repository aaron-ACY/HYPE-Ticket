import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Disc } from "lucide-react";
import { Event } from "../../types";

interface EventCardProps {
  event: Event;
  variant?: "standard" | "featured" | "wide";
  index?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = "standard",
  index,
}) => {
  const [imageError, setImageError] = useState(false);
  const isSoldOut = event.status === "sold-out";

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(event.priceFrom);

  const aspectRatioClass =
    variant === "featured"
      ? "aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10]"
      : variant === "wide"
      ? "aspect-[16/9]"
      : "aspect-[3/4] sm:aspect-[4/5]";

  return (
    <Link
      to={`/events/${event.slug}`}
      viewTransition
      className={`group relative w-full ${aspectRatioClass} overflow-hidden bg-[#0a0a10] block text-left transition-all duration-500 cursor-pointer select-none`}
    >
      {/* 1. Full-Bleed Event Visual */}
      {imageError ? (
        <div className="w-full h-full bg-[#12121c] flex items-center justify-center text-zinc-600 font-tech text-xs tracking-widest uppercase">
          [ HYPETICKET // ARCHIVE ]
        </div>
      ) : (
        <img
          src={event.image}
          alt={event.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08] group-hover:scale-105 group-hover:brightness-[0.9] transition-all duration-700 ease-out"
          loading="lazy"
        />
      )}

      {/* 2. Cinematic Black Gradients for Pure Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 via-35% via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/75 via-transparent to-transparent pointer-events-none" />

      {/* 3. Top Editorial Header (Raw Minimal Specs) */}
      <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 flex items-center justify-between z-10 font-tech text-[10px] tracking-widest uppercase text-zinc-300">
        <div className="flex items-center gap-2">
          {index !== undefined && (
            <span className="text-zinc-500 font-bold">
              {index < 9 ? `0${index + 1}` : index + 1} //
            </span>
          )}
          {isSoldOut ? (
            <span className="text-rose-500 font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              SOLD OUT
            </span>
          ) : event.featured ? (
            <span className="text-rose-400 font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              FEATURED ACT
            </span>
          ) : (
            <span className="text-zinc-400">
              {event.category.replace("-", " ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span className="hidden sm:inline">PASS</span>
          <ArrowUpRight className="w-4 h-4 text-white group-hover:text-rose-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </div>

      {/* 4. Bottom Typography & Information Layer */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 flex flex-col justify-end gap-2.5">
        
        {/* Category / Sub-meta */}
        <div className="flex items-center gap-2 font-tech text-[11px] text-rose-400 uppercase tracking-widest">
          <Disc className="w-3 h-3 animate-spin text-rose-500 group-hover:text-white transition-colors" />
          <span>{event.category.replace("-", " ")}</span>
        </div>

        {/* Large Confident Editorial Title */}
        <h3 className="display-headline font-heading font-black text-xl sm:text-2xl text-white uppercase leading-tight tracking-tight group-hover:text-rose-400 transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>

        {/* Secondary Metadata (reveals on hover smoothly) */}
        <div className="pt-2 border-t editorial-border flex flex-col gap-1 font-tech text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">{event.date}</span>
            <span className="text-white font-bold font-heading text-sm sm:text-base">
              {formattedPrice}
            </span>
          </div>

          {/* Reveal venue details */}
          <div className="h-0 group-hover:h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden flex items-center gap-1.5 text-[11px] text-zinc-400 pt-0.5">
            <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{event.venueName}</span>
          </div>
        </div>

      </div>

      {/* Subtle Laser Accent Hover Line on Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};
