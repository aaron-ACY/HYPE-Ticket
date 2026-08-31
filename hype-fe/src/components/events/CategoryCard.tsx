import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Category } from "../../types";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = (LucideIcons as any)[category.iconName] || LucideIcons.HelpCircle;
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/events?category=${category.slug}`}
      className="group relative flex-shrink-0 w-36 sm:w-44 aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-bg-surface flex flex-col justify-end p-5 transition-all duration-300 hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/5 active:scale-95 cursor-pointer"
    >
      {/* Background Image */}
      {imageError ? (
        <div className="absolute inset-0 w-full h-full gradient-bg opacity-20" />
      ) : (
        <img
          src={category.imageUrl}
          alt={category.name}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
        />
      )}
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/95 via-bg-secondary/30 to-transparent pointer-events-none" />

      {/* Floating Elements */}
      <div className="relative z-10 flex flex-col gap-3 text-left">
        {/* Icon wrapper */}
        <div className="w-9 h-9 rounded-xl glass-effect bg-black/15 flex items-center justify-center text-white group-hover:scale-105 transition-all duration-300">
          <IconComponent className="w-4.5 h-4.5 text-brand-primary" />
        </div>
        
        {/* Title */}
        <p className="font-extrabold text-xs sm:text-sm text-white tracking-wider leading-tight uppercase font-heading">
          {category.name.split(" / ")[0]}
        </p>
      </div>
    </Link>
  );
};
