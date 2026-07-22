import React from "react";

export function VediqLogo({ className = "h-10 w-10", showText = true, textClassName = "font-display text-xl font-bold" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="vediq_blue_teal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005C97" />
              <stop offset="50%" stopColor="#00B4DB" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>
            <linearGradient id="vediq_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A8E8" />
              <stop offset="100%" stopColor="#00C9FF" />
            </linearGradient>
          </defs>

          {/* 1. Orbit Arc & Endpoint Dot */}
          <path
            d="M 65 200 A 145 145 0 1 1 335 200"
            stroke="url(#vediq_blue_teal)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="335" cy="200" r="10" fill="#00B4DB" />

          {/* 2. Graduation Cap Top & Tassel */}
          <path d="M 200 60 L 305 100 L 200 140 L 95 100 Z" fill="#0A1B3A" />
          <path
            d="M 140 120 L 140 155 C 140 175, 260 175, 260 155 L 260 120"
            fill="none"
            stroke="#0A1B3A"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Tassel */}
          <line x1="290" y1="106" x2="295" y2="148" stroke="#0A1B3A" strokeWidth="5" />
          <path d="M 292 148 L 298 148 L 297 175 L 293 175 Z" fill="#0A1B3A" />

          {/* 3. Circuit Brain Central */}
          {/* Left Hemisphere */}
          <path
            d="M 145 165 C 120 180, 115 220, 135 245 C 120 260, 130 285, 155 290 C 175 295, 190 280, 192 270 L 192 165 Z"
            fill="url(#vediq_blue_teal)"
          />
          {/* Right Hemisphere */}
          <path
            d="M 255 165 C 280 180, 285 220, 265 245 C 280 260, 270 285, 245 290 C 225 295, 210 280, 208 270 L 208 165 Z"
            fill="url(#vediq_cyan)"
          />

          {/* Circuit Nodes & Connections */}
          <circle cx="160" cy="195" r="7" fill="#FFFFFF" />
          <circle cx="240" cy="195" r="7" fill="#FFFFFF" />
          <circle cx="140" cy="230" r="7" fill="#FFFFFF" />
          <circle cx="260" cy="230" r="7" fill="#FFFFFF" />
          <circle cx="170" cy="260" r="7" fill="#FFFFFF" />
          <circle cx="230" cy="260" r="7" fill="#FFFFFF" />

          <line x1="160" y1="195" x2="192" y2="195" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="240" y1="195" x2="208" y2="195" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="140" y1="230" x2="180" y2="230" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="260" y1="230" x2="220" y2="230" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="170" y1="260" x2="192" y2="260" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="230" y1="260" x2="208" y2="260" stroke="#FFFFFF" strokeWidth="4" />

          {/* Center Gap */}
          <line x1="200" y1="160" x2="200" y2="295" stroke="#FFFFFF" strokeWidth="6" />

          {/* 4. Open Book Wings */}
          {/* Left Wing Outer Dark Blue */}
          <path d="M 50 240 Q 200 215 200 295 L 180 320 Q 200 290 60 270 Z" fill="#0A1B3A" />
          {/* Left Wing Inner Blue Gradient */}
          <path d="M 60 230 Q 200 205 200 288 Q 200 210 65 240 Z" fill="url(#vediq_blue_teal)" />

          {/* Right Wing Outer Dark Blue */}
          <path d="M 350 240 Q 200 215 200 295 L 220 320 Q 200 290 340 270 Z" fill="#0A1B3A" />
          {/* Right Wing Inner Blue Gradient */}
          <path d="M 340 230 Q 200 205 200 288 Q 200 210 335 240 Z" fill="url(#vediq_cyan)" />

          {/* Main Book Spine Page Base */}
          <path
            d="M 60 245 Q 200 220 200 300 Q 200 220 340 245 L 320 330 Q 200 300 200 340 Q 200 300 80 330 Z"
            fill="#0A1B3A"
          />
        </svg>
      </div>
      {showText && (
        <span className={`tracking-tight ${textClassName}`}>
          <span className="text-[#0A1B3A] dark:text-white font-extrabold">Vedi</span>
          <span className="text-[#00B4DB] font-extrabold">Q</span>
        </span>
      )}
    </div>
  );
}

