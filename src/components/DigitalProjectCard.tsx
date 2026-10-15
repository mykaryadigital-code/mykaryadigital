import React from 'react';
import { Book } from '../types/book';
import { ExternalLink, Code2, Globe, Cpu, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface DigitalProjectCardProps {
  project: Book;
  onOpenProject: (project: Book) => void;
  onOpenDetail: (project: Book) => void;
}

export const DigitalProjectCard: React.FC<DigitalProjectCardProps> = ({
  project,
  onOpenProject,
  onOpenDetail,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Aplikasi Web':
        return <Globe className="w-3.5 h-3.5" />;
      case 'Sistem & Automasi':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Bisnes & E-Dagang':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      default:
        return <Code2 className="w-3.5 h-3.5" />;
    }
  };

  const imageSource = project.imageUrl || project.coverUrl;

  return (
    <article className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group text-left">
      {/* 16:9 Landscape Preview for Software / Digital Systems */}
      <div
        onClick={() => onOpenDetail(project)}
        className="relative w-full aspect-video bg-slate-900 overflow-hidden cursor-pointer select-none"
      >
        {imageSource ? (
          <img
            src={imageSource}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#063F35] to-emerald-950 flex items-center justify-center p-6 text-white text-center">
            <Code2 className="w-8 h-8 text-emerald-400 mb-2" />
            <h4 className="font-bold text-sm">{project.title}</h4>
          </div>
        )}

        {/* Demo Tag */}
        {project.isDemo && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
              Demo
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            {!project.price || project.price <= 0 ? 'Percuma' : `RM ${project.price.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006B57] dark:text-emerald-400 mb-1">
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(project)}
            className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#006B57] dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {project.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Primary Action Button (min 44px) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onOpenProject(project)}
            className="w-full min-h-[44px] h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#006B57] hover:bg-[#063F35] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <span>Buka Projek</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
