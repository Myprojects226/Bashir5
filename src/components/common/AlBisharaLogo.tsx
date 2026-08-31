import React from 'react';

interface AlBisharaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'horizontal' | 'badge';
  theme?: 'colored' | 'white' | 'dark';
  showSlogan?: boolean;
  showPhones?: boolean;
}

export const AlBisharaLogo: React.FC<AlBisharaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'colored',
  showSlogan = false,
  showPhones = false,
}) => {
  // Dimensions mapping
  const sizeMap = {
    xs: { icon: 28, text: 'text-xs', subText: 'text-[9px]' },
    sm: { icon: 36, text: 'text-sm', subText: 'text-[10px]' },
    md: { icon: 48, text: 'text-base', subText: 'text-xs' },
    lg: { icon: 64, text: 'text-xl', subText: 'text-sm' },
    xl: { icon: 84, text: 'text-2xl', subText: 'text-base' },
    '2xl': { icon: 110, text: 'text-3xl', subText: 'text-lg' },
  };

  const { icon: iconDim } = sizeMap[size];

  // Colors based on theme
  const blueColor = theme === 'white' ? '#FFFFFF' : '#0284C7';
  const greenColor = theme === 'white' ? '#A7F3D0' : '#10B981';
  const dropColor = theme === 'white' ? '#E0F2FE' : '#0EA5E9';
  const textColor = theme === 'white' ? 'text-white' : theme === 'dark' ? 'text-slate-900' : 'text-[#0284C7]';
  const greenTextColor = theme === 'white' ? 'text-emerald-200' : 'text-emerald-600';
  const phoneColor = theme === 'white' ? 'text-blue-200' : 'text-[#0284C7]';

  // SVG Icon component matching official 'ABR' Al-Bishara emblem
  const LogoIcon = (
    <svg
      width={iconDim}
      height={iconDim}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 drop-shadow-xs"
    >
      {/* Green Bottle Cap / Top Dispenser */}
      <rect x="85" y="10" width="30" height="14" rx="4" fill={greenColor} />
      <path d="M78 24C78 22 80 20 82 20H118C120 20 122 22 122 24V28H78V24Z" fill={greenColor} />

      {/* Main Outer Bottle & 'ABR' Intertwined Shape */}
      {/* 'R' Right Green Arm */}
      <path
        d="M130 50C145 50 162 60 162 82C162 98 150 110 135 114L165 160C168 164 163 170 156 168L130 148C126 145 120 148 120 154V165C120 168 116 170 112 168C98 160 88 152 82 144"
        stroke={greenColor}
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottle Body Background Soft Accent */}
      <path
        d="M100 32C74 32 55 52 55 78C55 105 70 148 100 158C130 148 145 105 145 78C145 52 126 32 100 32Z"
        fill={theme === 'white' ? 'rgba(255,255,255,0.15)' : '#F0F9FF'}
        stroke={greenColor}
        strokeWidth="6"
      />

      {/* 'A' Left Blue Swirl */}
      <path
        d="M35 158C45 130 60 80 82 45C92 28 108 28 118 45C130 65 138 95 140 120"
        stroke={blueColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 'B' Center Blue Loop & Handle */}
      <path
        d="M80 70C70 85 68 115 85 140C98 158 120 155 130 138C140 120 135 90 118 76C105 65 90 62 80 70Z"
        stroke={blueColor}
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Water Drop (Pure Freshness) */}
      <path
        d="M100 95C100 95 90 108 90 118C90 124 94.5 129 100 129C105.5 129 110 124 110 118C110 108 100 95 100 95Z"
        fill={dropColor}
      />
      {/* Inner Drop Highlight */}
      <path
        d="M97 110C95 113 94 117 96 120"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Clean Sparkle Bubbles */}
      <circle cx="108" cy="98" r="3.5" fill={greenColor} />
      <circle cx="115" cy="106" r="2.5" fill={dropColor} />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {LogoIcon}
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${textColor} ${sizeMap[size].text}`}>
              البشارة
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
              ABR
            </span>
          </div>
          <span className={`font-bold ${greenTextColor} ${sizeMap[size].subText} tracking-wide`}>
            للبلاستيك والمنظفات
          </span>
          {showSlogan && (
            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
              البشارة.. عنوان الجودة
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 shadow-sm ${className}`}>
        {LogoIcon}
        <span className={`font-black ${textColor} ${sizeMap[size].text} mt-1`}>البشارة</span>
        <span className={`font-bold ${greenTextColor} ${sizeMap[size].subText}`}>للبلاستيك والمنظفات</span>
      </div>
    );
  }

  // Default 'full' vertical logo with typography matching the official image
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {LogoIcon}

      {/* Arabic Official Brand Name */}
      <div className="mt-2 flex flex-col items-center">
        <h1 className={`font-black tracking-wide ${textColor} ${sizeMap[size].text} leading-none`}>
          البـشـــــارة
        </h1>
        <div className={`font-extrabold ${greenTextColor} ${sizeMap[size].subText} tracking-widest mt-1`}>
          للبـلاسـتـيــك والـمـنـظـفــــات
        </div>

        {showSlogan && (
          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[11px] border border-emerald-500/20">
            البشارة.. عنوان الجودة
          </div>
        )}

        {showPhones && (
          <div className={`font-bold font-mono text-[10px] sm:text-xs mt-2 ${phoneColor} tracking-wider`} dir="ltr">
            776776429 - 783755055 - 783744044
          </div>
        )}
      </div>
    </div>
  );
};
