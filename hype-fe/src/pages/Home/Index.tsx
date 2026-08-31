import React from "react";
import { events } from "../../data/events";
import { categories } from "../../data/categories";
import { EditorialHero } from "../../components/home/EditorialHero";
import { CuratedSonics } from "../../components/home/CuratedSonics";
import { HeadlinerFeature } from "../../components/home/HeadlinerFeature";
import { Exhibition3DPass } from "../../components/home/Exhibition3DPass";
import { ProgrammeSchedule } from "../../components/home/ProgrammeSchedule";
import { ManifestoLounge } from "../../components/home/ManifestoLounge";

export const Home: React.FC = () => {
  const featuredEvent = events.find((e) => e.featured) || events[0];
  const headlinerEvent = events.find((e) => e.slug === "hai-kich-cuoi-xuyen-bien-gioi") || events[1] || events[0];

  return (
    <div className="flex flex-col bg-[#050508] text-white w-full overflow-hidden">
      
      {/* 1. Full-Bleed Cinematic Editorial Hero with Interactive 3D WebGL Canvas */}
      <EditorialHero featuredEvent={featuredEvent} />

      {/* 2. Curated Sonics: Editorial Genre List with Dynamic Image Preview */}
      <CuratedSonics categories={categories} />

      {/* 3. The Headliner: Full-Bleed Magazine Spread Feature */}
      <HeadlinerFeature event={headlinerEvent} />

      {/* 4. Object 01: 3D Holographic Pass Exhibition Space */}
      <Exhibition3DPass />

      {/* 5. Season Programme: Line-by-Line Festival Schedule */}
      <ProgrammeSchedule events={events} />

      {/* 6. Manifesto & VIP Lounge Access */}
      <ManifestoLounge />

    </div>
  );
};
