"use client";

import { useState, useEffect } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";

const MobileVersion = () => {
  const [rotation, setRotation] = useState(0);
  const totalItems = CarouselItems.length;
  const rotationAngle = 360 / totalItems;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout; // ✅ Define interval type

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (isVisible) {
      interval = setInterval(() => {
        setRotation((prev) => prev - rotationAngle);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [rotationAngle, isVisible]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-[350px] w-full flex items-center justify-center">
        <div
          style={{ perspective: "5000px" }}
          className="relative w-[350px] h-[350px]"
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
                className="absolute transition-transform duration-500 ease-out hover:scale-105"
                style={{
                  transform: `rotateY(${
                    index * rotationAngle
                  }deg) translateZ(100px)`,
                  transformOrigin: "center",
                }}
              >
                <div className="w-[350px] h-[350px] rounded-lg overflow-hidden shadow-lg">
                  <div
                    className="relative w-full h-full bg-cover bg-center flex flex-col justify-between p-4 text-white"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 rounded-lg" />
                    <div className="relative z-10 text-center">
                      <h2 className="text-lg font-bold">{item.title}</h2>
                    </div>
                    <button className="relative z-10 mx-auto mt-auto flex items-center gap-2 rounded-full bg-white py-2 px-4 text-xs text-black shadow-md hover:bg-gray-100">
                      Book Now
                      <span className="p-2 bg-gray-100 rounded-full flex items-center justify-center">
                        <TfiArrowTopRight size={14} />
                      </span>
                    </button>
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
