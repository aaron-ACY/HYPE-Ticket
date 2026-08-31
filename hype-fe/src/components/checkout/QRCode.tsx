import React from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({ value, size = 180 }) => {
  // We can create a simulated QR code using SVG with detailed anchor blocks
  // to give a premium, authentic ticketing feel.
  return (
    <div className="bg-white p-4.5 rounded-2xl flex items-center justify-center inline-block shadow-inner w-fit mx-auto">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="text-[#0B0B0C]"
        fill="currentColor"
      >
        {/* Top-Left Anchor */}
        <rect x="0" y="0" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="8" y="8" width="14" height="14" rx="1.5" />

        {/* Top-Right Anchor */}
        <rect x="70" y="0" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="78" y="8" width="14" height="14" rx="1.5" />

        {/* Bottom-Left Anchor */}
        <rect x="0" y="70" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="8" y="78" width="14" height="14" rx="1.5" />

        {/* Small Bottom-Right Anchor */}
        <rect x="75" y="75" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="79" y="79" width="2" height="2" />

        {/* Pseudo-Random QR Grid Pixels */}
        <rect x="36" y="2" width="6" height="6" />
        <rect x="48" y="2" width="12" height="6" />
        <rect x="36" y="14" width="6" height="12" />
        <rect x="48" y="14" width="6" height="6" />
        <rect x="58" y="20" width="6" height="6" />
        
        <rect x="2" y="36" width="6" height="6" />
        <rect x="14" y="36" width="12" height="6" />
        <rect x="30" y="36" width="6" height="12" />
        <rect x="42" y="36" width="18" height="6" />
        <rect x="66" y="36" width="6" height="18" />
        <rect x="78" y="36" width="12" height="6" />
        
        <rect x="2" y="48" width="18" height="6" />
        <rect x="24" y="48" width="6" height="12" />
        <rect x="36" y="48" width="12" height="6" />
        <rect x="54" y="48" width="6" height="6" />
        <rect x="78" y="48" width="6" height="6" />
        <rect x="88" y="48" width="10" height="6" />

        <rect x="14" y="58" width="6" height="6" />
        <rect x="36" y="58" width="6" height="12" />
        <rect x="48" y="58" width="18" height="6" />
        <rect x="82" y="58" width="6" height="18" />

        <rect x="36" y="76" width="12" height="6" />
        <rect x="54" y="70" width="6" height="12" />
        <rect x="64" y="70" width="6" height="6" />
        <rect x="64" y="82" width="6" height="12" />
        <rect x="52" y="88" width="6" height="6" />
        <rect x="36" y="88" width="10" height="6" />

        {/* Middle Tiny Details */}
        <circle cx="50" cy="50" r="2.5" className="text-brand-primary" fill="currentColor" />
      </svg>
    </div>
  );
};
