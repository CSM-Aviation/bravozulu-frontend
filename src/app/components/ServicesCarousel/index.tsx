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

  // Adjusted carousel radius for better spacing
  const getCarouselRadius = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 140; // Mobile
      if (window.innerWidth < 1024) return 180; // Tablet
    }
    return 400; // Desktop
  };

  const getPerspective = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return "900px"; // Mobile
      if (window.innerWidth < 1024) return "1100px"; // Tablet
    }
    return "1500px"; // Desktop
  };

  const [carouselRadius, setCarouselRadius] = useState(getCarouselRadius());
  const [perspective, setPerspective] = useState(getPerspective());

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

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
    <div className="flex flex-col items-center md:mt-8 justify-center">
      <div className="relative h-[400px] w-full flex items-center justify-center">
        <div
          style={{ perspective }}
          className="relative w-full h-[400px] max-w-[450px] sm:max-w-[550px] md:max-w-[650px]"
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
                  <div className="w-[150px] h-[240px] sm:w-[200px] sm:h-[300px] md:w-[250px] md:h-[350px] lg:w-[300px] rounded-lg overflow-hidden shadow-lg">
                    <div
                      className="relative w-full h-full bg-cover bg-center flex flex-col justify-between p-4 text-white"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/30 rounded-lg" />
                      <div className="relative z-10 text-center">
                        <h2 className="text-sm sm:text-md md:text-lg font-bold">
                          {item.title}
                        </h2>
                      </div>
                      <button className="relative z-10 mx-auto mt-auto flex items-center gap-1 rounded-full bg-white py-1 px-3 md:px-8 text-[9px] sm:text-xs text-black shadow-md hover:bg-gray-100">
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
