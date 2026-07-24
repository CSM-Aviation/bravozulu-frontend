"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";
import Link from "next/link";

const ServicesCarousel = () => {
  const [rotation, setRotation] = useState(0);
  const totalItems = CarouselItems.length;
  const rotationAngle = useMemo(() => 360 / totalItems, [totalItems]);
  const [isVisible, setIsVisible] = useState(true);
  const [translateZ, setTranslateZ] = useState<number | null>(null);
  useEffect(() => {
    const updateTranslateZ = () => {
      const width = window.innerWidth;
      if (width < 768) setTranslateZ(150);
      else if (width < 1024) setTranslateZ(300);
      else setTranslateZ(400);
    };

    updateTranslateZ();
    window.addEventListener("resize", updateTranslateZ);

    return () => window.removeEventListener("resize", updateTranslateZ);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const rotateCarousel = useCallback(() => {
    setRotation((prev) => prev - rotationAngle);
  }, [rotationAngle]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(rotateCarousel, 5000);
    return () => clearInterval(interval);
  }, [isVisible, rotateCarousel]);

  if (translateZ === null) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-[400px] w-full flex items-center justify-center">
        <div
          style={{ perspective: "5000px" }}
          className="relative w-[400px] h-[400px]"
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 2s ease-in-out",
              willChange: "transform",
              position: "absolute",
              top: "50%",
              left: "50%",
              transformOrigin: "center",
              transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
            }}
          >
            {CarouselItems.map((item, index) => {
              const itemRotation = index * rotationAngle;
              const transformStyle = `rotateY(${itemRotation}deg) translateZ(${translateZ}px)`;

              return (
                <div
                  key={index}
                  className="absolute transition-transform duration-500 ease-out hover:scale-105"
                  style={{
                    transformOrigin: "center",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) ${transformStyle}`,
                  }}
                >
                  <div className="w-[200px] h-[340px] md:w-[260px] md:h-[350px] lg:w-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                    <div
                      className="relative w-full h-full bg-bz-jet bg-cover bg-center flex flex-col justify-between p-4 text-white"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/30 rounded-lg" />
                      <div className="relative z-10 text-center">
                        <h2 className="font-display text-lg font-bold">{item.title}</h2>
                      </div>
                      <Link href="/Quote" className="block w-full">
                      <button className="relative z-10 mt-auto flex items-center justify-between gap-4 rounded-full bg-white py-3 px-6 text-base font-medium text-bz-jet shadow-md w-full max-w-[200px] mx-auto transition-all duration-300 hover:bg-bz-electric hover:text-white group">
  Get Quote
  <span className="p-2 bg-bz-mist rounded-full flex items-center justify-center text-bz-jet transition-all duration-300 group-hover:bg-white group-hover:text-bz-jet">
    <TfiArrowTopRight size={14} />
  </span>
</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCarousel;