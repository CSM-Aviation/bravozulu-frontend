"use client";
import { useEffect, useState } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";

const DesktopVersion = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currDeg = -(activeCard * 120);

  return (
    <div className="flex items-center justify-center">
      <div className="perspective-[1000px] relative h-[400px] w-[350px]">
        <div
          className="absolute h-full w-full transition-transform duration-1000 [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${currDeg}deg)` }}
        >
          {CarouselItems.map((item, index) => {
            const angle = index * 120;
            const translateZ =
              activeCard % CarouselItems.length === index ? 500 : 450;
            const cardContainerTransform = `rotateY(${angle}deg) translateZ(${translateZ}px) rotateY(-${angle}deg)`;

            return (
              <div
                key={index}
                className="[transform-style:preserve-3d]"
                style={{ transform: cardContainerTransform }}
              >
                <div
                  className="absolute flex h-[400px] w-[320px] flex-col items-center justify-between overflow-hidden rounded-md p-4 text-white"
                  style={{
                    transform: `rotateY(${-currDeg}deg) scale(${
                      activeCard % CarouselItems.length === index ? 1.2 : 1
                    })`,
                    transition: "transform 1s",
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <button className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white py-1 pl-6 pr-2 text-xs text-black transition-all hover:bg-opacity-90">
                    Book Now
                    <span className="ml-2 rounded-full bg-[#F6F6F6] p-4">
                      <TfiArrowTopRight size={15} />
                    </span>
                  </button>
                  <div className="relative z-10 mt-auto text-center">
                    <h2 className="mb-2 text-2xl font-bold">{item.title}</h2>
                    <div className="my-2 w-full rounded-md bg-black/30 p-3">
                      <p className="mb-4 text-xs">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesktopVersion;
