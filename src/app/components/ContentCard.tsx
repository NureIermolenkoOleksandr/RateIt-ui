import { ImageWithFallback } from "./ImageWithFallback";
import { Link } from "react-router";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  detailPath: string;
}

export function ContentCard({
  id,
  title,
  description,
  image,
  rating,
  detailPath,
}: ContentCardProps) {
  return (
    <div className="group bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all">
      <Link to={detailPath} className="block aspect-[3/4] overflow-hidden bg-zinc-900">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-5">
        <Link to={detailPath}>
          <h3 className="text-base font-light text-white mb-2 line-clamp-1 hover:text-zinc-300 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 font-light leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-600 font-light">Середня оцінка</span>
          <span className="text-lg text-white font-light">{rating > 0 ? rating.toFixed(1) : "—"}</span>
        </div>
      </div>
    </div>
  );
}