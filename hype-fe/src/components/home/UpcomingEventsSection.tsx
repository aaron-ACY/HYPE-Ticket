import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Layers } from "lucide-react";
import { Event } from "../../types";
import { EventCard } from "../events/EventCard";
import { Button } from "../common/Button";

interface UpcomingEventsSectionProps {
  events: Event[];
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoriesFilter = [
    { id: "all", label: "Tất Cả" },
    { id: "concert", label: "Ca Nhạc" },
    { id: "music-festival", label: "Festival" },
    { id: "theater", label: "Sân Khấu" },
    { id: "comedy", label: "Hài Kịch" },
  ];

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <section className="space-y-8 text-left w-full">
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-5 gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-widest font-heading">
            <Layers className="w-3.5 h-3.5" />
            <span>Lịch Trình Sự Kiện Sắp Tới</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2.5 font-heading">
            <Calendar className="w-6 h-6 text-brand-primary" />
            Sắp Diễn Ra
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Lên kế hoạch tham gia cùng bạn bè và giữ chỗ sớm
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoriesFilter.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-brand-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.35)]"
                  : "bg-bg-surface hover:bg-bg-surface-elevated text-zinc-400 hover:text-zinc-200 border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Bottom View All Link */}
      <div className="flex justify-center pt-6">
        <Link to="/events" viewTransition>
          <Button
            variant="outline"
            size="lg"
            className="px-10 font-heading uppercase text-xs tracking-wider font-bold border-white/10 hover:border-brand-primary/40 bg-white/5 hover:bg-white/10 backdrop-blur-md"
            rightIcon={<ArrowRight className="w-4 h-4 text-brand-primary" />}
          >
            Xem Thêm Tất Cả Sự Kiện
          </Button>
        </Link>
      </div>
    </section>
  );
};
