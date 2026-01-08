import React from "react";

export default function SalesRibbon() {
  return (
    <div
      className="fixed top-[72px] z-40 w-full 
      bg-gradient-to-r from-red-700 via-red-600 to-orange-600
      text-white py-1 text-xs md:text-sm flex items-center overflow-x-hidden"
      style={{
        minHeight: "25px",
        height: "28px",
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900
      }}
    >
      <div
        className="whitespace-nowrap animate-marquee flex gap-6 w-max"
        style={{ animation: "marquee 18s linear infinite" }}
      >
        <span role="img" aria-label="flash" className="mr-1">⚡</span>
        Launching Offer! Hurry Up! <span className="mx-2">|</span>
        <span role="img" aria-label="gift" className="mr-1">🎁</span>
        For Bulk Orders:
        <span className="ml-1">40% OFF</span>
        on orders above
        <span className="ml-1">10kg</span>!
        &nbsp;Use code
        <span className="bg-white/20 px-2 py-1 rounded text-xs md:text-sm tracking-wide ml-1">
          NUTRIEVE40
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
