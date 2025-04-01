import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CoinRedeemProps {
  amount: number;
  name: string;
  onClose?: () => void;
}

const CoinRedeemSuccess: React.FC<CoinRedeemProps> = ({ amount, name, onClose }) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!circleRef.current || !checkmarkRef.current || !textRef.current) return;

    // Create a GSAP timeline for sequenced animations
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // Initial state - circle starts big and covers the entire container
    gsap.set(circleRef.current, {
      scale: 1.5,
      backgroundColor: "#10B981",
      borderRadius: "50%",
      clipPath: "circle(150% at top right)"
    });
    gsap.set(checkmarkRef.current, { autoAlpha: 0 });
    gsap.set(textRef.current, { autoAlpha: 0, y: 20 });

    // Animation sequence - circle contracts to center
    tl.to(circleRef.current, {
      scale: 1,
      duration: 0.8,
      clipPath: "circle(50% at center)",
      ease: "power2.out"
    })
      .to(checkmarkRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        scale: 1,
        ease: "back.out(1.7)"
      })
      .to(textRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5
      });

    return () => {
      // Clean up animation
      tl.kill();
    };
  }, []);

  return (
    <div className="bg-gray-50 absolute top-0 left-0 w-full h-full z-50">
      <div className="w-full max-w-md px-6 py-12 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          {/* Animation container */}
          <div className="relative w-32 h-32 mb-8 overflow-hidden">
            {/* Circle */}
            <div
              ref={circleRef}
              className="absolute inset-0"
            />

            {/* Checkmark */}
            <svg
              ref={checkmarkRef}
              className="absolute inset-0 w-full h-full text-white p-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Text */}
          <div ref={textRef} className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Redemption Successful!</h2>
            <p className="text-lg text-gray-600 mb-6">
              {amount} Tugo Coins have been added to <strong>{name}'s</strong> account
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinRedeemSuccess;