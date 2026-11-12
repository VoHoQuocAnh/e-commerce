// client/src/components/product/RatingStar.jsx
import { Star } from 'lucide-react';

const RatingStar = ({ rating = 0, count, size = 'w-4 h-4' }) => {
  const rounded = Math.round(Number(rating || 0));

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < rounded ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
          }`}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-zinc-400 ml-1">({count})</span>
      )}
    </div>
  );
};

export default RatingStar;
