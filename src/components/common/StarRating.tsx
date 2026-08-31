import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number | null;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewsCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 5,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  reviewsCount,
  interactive = false,
  onRatingChange
}) => {
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 5.0;

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" dir="ltr">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = safeRating >= starValue;
          const isHalf = safeRating > index && safeRating < starValue;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-bold text-slate-700 mr-1">
          {safeRating.toFixed(1)}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className="text-[11px] text-slate-400">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
