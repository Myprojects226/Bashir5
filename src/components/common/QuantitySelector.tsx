import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  unit?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 999,
  size = 'md',
  unit
}) => {
  const sizeStyles = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-11 px-4 text-base'
  };

  const btnSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  return (
    <div className={`inline-flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 select-none ${sizeStyles[size]}`}>
      <button
        type="button"
        id="qty-decrease-btn"
        onClick={e => {
          e.stopPropagation();
          if (quantity > min) onDecrease();
        }}
        disabled={quantity <= min}
        className={`${btnSizes[size]} flex items-center justify-center rounded-md bg-white text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        aria-label="تقليل الكمية"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center justify-center min-w-[36px] px-2 font-bold text-slate-800">
        <span>{quantity}</span>
        {unit && <span className="text-[10px] font-normal text-slate-500 mr-1">{unit}</span>}
      </div>

      <button
        type="button"
        id="qty-increase-btn"
        onClick={e => {
          e.stopPropagation();
          if (quantity < max) onIncrease();
        }}
        disabled={quantity >= max}
        className={`${btnSizes[size]} flex items-center justify-center rounded-md bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        aria-label="زيادة الكمية"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
