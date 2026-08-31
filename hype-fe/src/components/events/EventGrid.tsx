import React from "react";
import { Event } from "../../types";
import { EventCard } from "./EventCard";
import { EmptyState } from "../common/EmptyState";

interface EventGridProps {
  events: Event[];
}

export const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="w-full py-16">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {events.map((event, idx) => (
        <EventCard key={event.id} event={event} index={idx} />
      ))}
    </div>
  );
};
