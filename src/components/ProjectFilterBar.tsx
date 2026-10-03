import React from 'react';
import { Layers, Globe, ShoppingBag, Cpu, BookOpen } from 'lucide-react';

export interface ProjectFilterBarProps {
  categories?: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
  className?: string;
}

export const DEFAULT_PROJECT_CATEGORIES = [
  'Semua',
  'Aplikasi Web',
  'Bisnes & E-Dagang',
  'Sistem & Automasi',
  'Novel & Sastera',
];

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  categories = DEFAULT_PROJECT_CATEGORIES,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  totalCount,
  className = '',
}) => {
  // Category Icons mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Semua':
        return <Layers className="w-3.5 h-3.5" />;
      case 'Aplikasi Web':
        return <Globe className="w-3.5 h-3.5" />;
      case 'Bisnes & E-Dagang':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'Sistem & Automasi':
        return <Cpu className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Horizontal Scrollable Pills Container (mobile-first, no scrollbar) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1.5 px-0.5 -mx-1 sm:mx-0 whitespace-nowrap scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'Semua'
                ? totalCount !== undefined
                  ? totalCount
                  : categoryCounts['Semua']
                : categoryCounts[cat];

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`group inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.97] shrink-0 ${
                  isActive
                    ? 'bg-[#006B57] dark:bg-emerald-600 text-white shadow-sm ring-2 ring-[#006B57]/20 dark:ring-emerald-500/30'
                    : 'bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-100 dark:text-emerald-200' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>

                {count !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-mono-data rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clean right indicator on tablet/desktop */}
        {totalCount !== undefined && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
            <span>Menapis:</span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCategory}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
