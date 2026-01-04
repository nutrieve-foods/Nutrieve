import React from "react";

export default function SalesRibbon() {
  return (
    <div className="fixed top-[72px] z-40 w-full bg-gradient-to-r from-red-400 via-orange-400 to-orange-300 text-white py-1 text-xs md:text-sm flex items-center overflow-x-hidden" style={{minHeight:'25px', height:'28px'}}>
      <div
        className="whitespace-nowrap animate-marquee font-semibold flex gap-6 w-max"
        style={{animation: 'marquee 18s linear infinite'}}
      >
        <span role="img" aria-label="flash" className="mr-1">⚡</span>
        Flash Sale for New Year! <span className="mx-2">|</span>
        <span role="img" aria-label="gift" className="mr-1">🎁</span>
        For Bulk Orders: <span className="font-bold text-yellow-100">40% OFF</span> on orders above <span className="font-bold text-yellow-100">10kg</span>!&nbsp;Use code <span className="bg-white/30 px-2 py-1 rounded text-xs md:text-sm font-bold tracking-wide ml-1">NUTRIEVE40</span>
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
