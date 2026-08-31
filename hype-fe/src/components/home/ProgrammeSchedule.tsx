import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { Event } from "../../types";

interface ProgrammeScheduleProps {
  events: Event[];
}

export const ProgrammeSchedule: React.FC<ProgrammeScheduleProps> = ({ events }) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  return (
    <section className="relative w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-16 max-w-[1500px] mx-auto text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 border-b editorial-border gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 font-tech text-xs text-rose-500 uppercase tracking-widest">
            <span>[ 04 ]</span>
            <span>OFFICIAL LINEUP // SEASON 2026</span>
          </div>
          <h2 className="display-title text-white uppercase font-black tracking-tight leading-tight">
            LỊCH TRÌNH BIỂU DIỄN
          </h2>
        </div>

        <Link
          to="/events"
          viewTransition
          className="font-tech text-xs text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-2 border-b border-zinc-700 hover:border-white pb-1 w-fit transition-colors"
        >
          <span>VIEW FULL ARCHIVE ({events.length} EVENTS)</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
        </Link>
      </div>

      {/* Editorial Line-By-Line Schedule */}
      <div className="divide-y editorial-border">
        {events.map((event, index) => {
          const formattedPrice = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(event.priceFrom);

          return (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              viewTransition
              onMouseEnter={() => setHoveredEventId(event.id)}
              onMouseLeave={() => setHoveredEventId(null)}
              className="group py-7 sm:py-9 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:bg-white/[0.02] -mx-4 px-4 sm:mx-0 sm:px-0 cursor-pointer"
            >
              {/* Left Info: Index & Date & Title */}
              <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                <span className="font-tech text-xs text-zinc-600 group-hover:text-rose-500 transition-colors pt-1 sm:pt-0">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 font-tech text-[11px] text-zinc-400">
                    <span className="text-rose-400 font-bold uppercase">{event.date}</span>
                    <span>•</span>
                    <span className="text-zinc-500 uppercase">{event.category}</span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-rose-400 group-hover:translate-x-2 transition-all duration-300 uppercase font-heading">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Right Info: Venue, Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 font-tech text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="truncate max-w-[180px] sm:max-w-none">{event.venueName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-sm font-heading">{formattedPrice}</span>

                  <div className="w-9 h-9 rounded-full border editorial-border group-hover:border-white group-hover:bg-white text-zinc-400 group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
};
