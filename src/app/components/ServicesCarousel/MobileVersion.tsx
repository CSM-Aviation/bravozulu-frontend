"use client";

import { useState, useEffect } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";

const MobileVersion = () => {

  const totalItems = CarouselItems.length;
  const [isVisible, setIsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fixed positions for the three cards instead of 3D rotation
  // This ensures cards are always in view regardless of screen size
  const [itemPositions, setItemPositions] = useState([
    { x: 0, scale: 1, opacity: 1, zIndex: 30 },        // Center
    { x: "75%", scale: 0.85, opacity: 0.8, zIndex: 20 },  // Right
    { x: "-75%", scale: 0.85, opacity: 0.8, zIndex: 20 }  // Left
  ]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Adjust positions based on screen size
      if (mobile) {
        setItemPositions([
          { x: 0, scale: 1, opacity: 1, zIndex: 30 },          // Center
          { x: "60%", scale: 0.8, opacity: 0.8, zIndex: 20 },  // Right (closer)
          { x: "-60%", scale: 0.8, opacity: 0.8, zIndex: 20 }  // Left (closer)
        ]);
      } else {
        setItemPositions([
          { x: 0, scale: 1, opacity: 1, zIndex: 30 },          // Center
          { x: "75%", scale: 0.85, opacity: 0.8, zIndex: 20 }, // Right
          { x: "-75%", scale: 0.85, opacity: 0.8, zIndex: 20 } // Left
        ]);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    if (isVisible) {
      interval = setInterval(() => {
        // Rotate the active index instead of using 3D rotation
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isVisible, totalItems]);

  // Function to get the correct position for each card
  const getItemStyle = (itemIndex: number) => {
    // Calculate relative position (0 = active, 1 = right, 2 = left)
    const relativePos = (totalItems + itemIndex - activeIndex) % totalItems;
    
    // Map to position style
    let posIndex = 0; // Default to center
    if (relativePos === 1) posIndex = 1; // Right
    if (relativePos === 2) posIndex = 2; // Left
    
    return {
      transform: `translateX(${itemPositions[posIndex].x}) scale(${itemPositions[posIndex].scale})`,
      opacity: itemPositions[posIndex].opacity,
      zIndex: itemPositions[posIndex].zIndex,
      transition: "all 0.5s ease"
    };
  };

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="relative w-full max-w-[350px] h-[350px] overflow-visible">
          {/* Static positioning instead of 3D rotation */}
          {CarouselItems.map((item, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-500"
              style={getItemStyle(index)}
            >
              <div className="transition-transform duration-500 ease-out hover:scale-105">
                <div className={`${isMobile ? 'w-[180px] h-[280px]' : 'w-[240px] h-[320px]'} rounded-lg overflow-hidden shadow-lg`}>
                  <div
                    className="relative w-full h-full bg-cover bg-center flex flex-col justify-between p-4 text-white"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 rounded-lg" />
                    <div className="relative z-10 text-center">
                      <h2 className="text-lg font-bold">
                        {item.title}
                      </h2>
                    </div>
                    <button className="relative z-10 mx-auto mt-auto flex items-center gap-1 rounded-full bg-white py-1 px-3 text-xs text-black shadow-md hover:bg-gray-100">
                      Get Quote
                      <span className="p-1.5 bg-gray-100 rounded-full flex items-center justify-center">
                        <TfiArrowTopRight size={12} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileVersion;