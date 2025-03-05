"use client";

import { useState, useEffect } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";

const MobileVersion = () => {
  const [rotation, setRotation] = useState(0);
  const totalItems = CarouselItems.length;
  const rotationAngle = 360 / totalItems;
  const [isVisible, setIsVisible] = useState(true);
  const [turn, setTurn] = useState(0);

  // Reduce carousel radius for mobile to keep all items in view
  const getCarouselRadius = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 100; // Smaller for mobile
      if (window.innerWidth < 1024) return 160; // Adjusted for tablet
    }
    return 400; // Desktop stays the same
  };

  // Adjust perspective for better 3D effect
  const getPerspective = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return "500px"; // Reduced for mobile
      if (window.innerWidth < 1024) return "800px"; // Adjusted for tablet
    }
    return "1500px"; // Desktop stays the same
  };

  const [carouselRadius, setCarouselRadius] = useState(getCarouselRadius());
  const [perspective, setPerspective] = useState(getPerspective());

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleResize = () => {
      setCarouselRadius(getCarouselRadius());
      setPerspective(getPerspective());
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("resize", handleResize);
    }

    if (isVisible) {
      interval = setInterval(() => {
        setRotation((prev) => prev - rotationAngle);
        setTurn((prev) => (prev + 1) % totalItems);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [rotationAngle, isVisible]);

  return (
    <div className="flex flex-col items-center justify-center my-6">
      {/* Increased container height to accommodate carousel */}
      <div className="relative h-[400px] w-full flex items-center justify-center">
        <div
          style={{ perspective }}
          className="relative w-full h-[350px] max-w-[350px] sm:max-w-[550px] md:max-w-[650px]"
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 2s ease-in-out",
              willChange: "transform",
            }}
          >
            {CarouselItems.map((item, index) => (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: `rotateY(${
                    index * rotationAngle
                  }deg) translateZ(${carouselRadius}px)`,
                  transformOrigin: "50% 50%",
                }}
              >
                <div
                  className={`transition-transform duration-500 ease-out ${
                    turn === index ? "hover:scale-105" : "pointer-events-none"
                  } will-change-transform`}
                >
                  {/* Adjusted card dimensions to ensure all cards are fully visible */}
                  <div className="w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg">
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
    </div>
  );
};

export default MobileVersion;