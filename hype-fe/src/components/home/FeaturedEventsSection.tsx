import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, TrendingUp } from "lucide-react";
import { Event } from "../../types";
import { EventCard } from "../events/EventCard";

interface FeaturedEventsSectionProps {
  events: Event[];
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({ events }) => {
  return (
    <section className="space-y-8 text-left w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-5 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest font-heading">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trending Shows • Đang được săn lùng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2.5 font-heading">
            <Flame className="w-6 h-6 text-brand-primary animate-pulse" />
            Sự Kiện Nổi Bật
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Các show diễn HOT nhất vé đang được giữ chỗ nhanh chóng
          </p>
        </div>

        <Link
          to="/events"
          viewTransition
          className="group text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 font-heading uppercase tracking-wider bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 w-fit"
        >
          <span>Xem tất cả sự kiện</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-primary" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};
