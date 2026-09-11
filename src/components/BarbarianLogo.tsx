import React from "react";
import vikingImg from "../assets/barbarian_viking_logo.jpg";

interface BarbarianLogoProps {
  variant?: "full" | "icon" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export const BarbarianLogo: React.FC<BarbarianLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = true,
}) => {
  const iconSize = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  }[size];

  const titleSize = {
    sm: "text-lg tracking-[0.15em]",
    md: "text-2xl tracking-[0.18em]",
    lg: "text-4xl sm:text-5xl tracking-[0.2em]",
    xl: "text-5xl sm:text-7xl tracking-[0.22em]",
  }[size];

  if (variant === "icon") {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${iconSize} ${className}`}>
        <img
          src={vikingImg}
          alt="Barbarian Viking"
          className="w-full h-full object-cover rounded-2xl brightness-110 contrast-125"
        />
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`relative overflow-hidden rounded-xl ${iconSize} shrink-0 bg-[#022A1E] border border-[#28D978]/30 shadow-md`}>
          <img
            src={vikingImg}
            alt="Barbarian Viking"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <span className={`font-['Bebas_Neue'] font-black text-white leading-none ${titleSize}`}>
            BARBARIAN
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-[#28D978] font-bold tracking-wider uppercase mt-0.5">
              Almacén &bull; Inventario
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full centered layout (like in Login screen Image 1)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className={`relative overflow-hidden rounded-3xl ${iconSize} mb-3 border-2 border-[#28D978]/40 shadow-2xl shadow-black/50 bg-[#022A1E]`}>
        <img
          src={vikingImg}
          alt="Barbarian Viking"
          className="w-full h-full object-cover brightness-105 contrast-125"
        />
      </div>
      <h1 className={`font-['Bebas_Neue'] font-black text-white leading-none ${titleSize} drop-shadow-md`}>
        BARBARIAN
      </h1>
      {showSubtitle && (
        <p className="text-xs sm:text-sm text-[#28D978] font-bold tracking-wider mt-2 drop-shadow-sm uppercase">
          Sistema de Gestión de Inventario
        </p>
      )}
    </div>
  );
};
