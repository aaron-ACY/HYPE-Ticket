import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Event } from "../../types";
import { CinematicScene3D } from "./CinematicScene3D";

interface EditorialHeroProps {
  featuredEvent: Event;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ featuredEvent }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(featuredEvent.priceFrom);

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#050507] border-b border-[#24242B]">
      
      {/* 1. Full-Bleed 3D WebGL Canvas Backdrop */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <CinematicScene3D heroEventTitle={featuredEvent.title} />
      </div>

      {/* 2. Top Minimalist Editorial Navigation Subheader */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between font-tech text-[11px] text-[#85858D]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FF176B] animate-ping" />
          <span className="text-[#F5F5F5] font-bold tracking-widest">[ LIVE SEASON 2026 ]</span>
          <span className="text-[#34343D]">/</span>
          <span className="hidden sm:inline text-[#85858D]">GLOBAL STAGE ARCHIVE</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-[#85858D] font-tech">COORD: 10.8231° N, 106.6297° E</span>
          <span className="text-[#FF176B] font-bold tracking-widest">VERIFIED PASS ONLY</span>
        </div>
      </div>

      {/* 3. Main Center Stage: Oversized Editorial Typography (Framed on Left Half, Zero Overlap) */}
      <div className="relative z-10 max-w-[1500px] w-full mx-auto px-6 sm:px-10 py-12 flex flex-col justify-center flex-grow pointer-events-none">
        
        {/* Asymmetrical Floating Event Pill */}
        <div className="pointer-events-auto w-fit mb-4 animate-reveal-1">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#111116]/80 border border-[#24242B] backdrop-blur-md text-xs font-tech text-[#B5B5BC]">
            <span className="text-[#FF176B] font-black">ACT 01</span>
            <span className="w-1 h-1 rounded-full bg-[#34343D]" />
            <span className="text-[#F5F5F5] uppercase font-bold tracking-wider">{featuredEvent.category}</span>
          </div>
        </div>

        {/* Oversized Cinematic Headline - Display Huge Strictly 2 Lines with Stagger Reveal */}
        <div className="w-fit text-left pointer-events-auto overflow-visible">
          <h1 className="display-huge uppercase font-black tracking-tight select-none font-heading text-[#F5F5F5] whitespace-nowrap overflow-visible">
            <span className="inline-block animate-reveal-2 pr-2">HYPETICKET</span> <br />
            <span className="inline-block text-[#FF176B] animate-reveal-3">
              EDITION '26
            </span>
          </h1>
        </div>

        {/* Editorial Sub-Narrative & Direct Booking Action */}
        <div className="mt-8 pt-8 border-t border-[#24242B] max-w-xl text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-auto animate-reveal-4">
          <div className="space-y-2">
            <p className="text-xs font-tech text-[#FF176B] uppercase tracking-widest">Featured Performance</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase font-heading line-clamp-2">
              {featuredEvent.title}
            </h3>
            <p className="text-xs text-[#85858D] font-tech">
              {featuredEvent.date} — {featuredEvent.venueName}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
            <span className="text-xs font-tech text-[#85858D]">ACCESS FROM <strong className="text-[#F5F5F5] text-base">{formattedPrice}</strong></span>
            <Link
              to={`/events/${featuredEvent.slug}`}
              viewTransition
              className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#F5F5F5] hover:bg-[#FF176B] text-[#050507] hover:text-white text-xs font-black tracking-widest uppercase transition-all duration-300 font-heading shadow-2xl active:scale-95 cursor-pointer"
            >
              <span>CLAIM TICKET</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Bottom Continuous Soundwave Marquee */}
      <div className="relative z-10 w-full border-t border-[#24242B] bg-[#050507]/90 backdrop-blur-md overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 font-tech text-xs tracking-widest text-[#85858D] uppercase">
          <span>• SOUNDTRACK OF THE FUTURE</span>
          <span>• ARENA CONCERT EXPERIENCES</span>
          <span>• 3D VERIFIED DIGITAL TICKETING</span>
          <span>• INDIE SOUNDS & RESIDENCIES</span>
          <span>• CONTEMPORARY THEATRE</span>
          <span>• ELECTRONIC FESTIVALS</span>
          <span>• SOUNDTRACK OF THE FUTURE</span>
          <span>• ARENA CONCERT EXPERIENCES</span>
          <span>• 3D VERIFIED DIGITAL TICKETING</span>
        </div>
      </div>

    </section>
  );
};
