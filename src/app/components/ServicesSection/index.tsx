"use client";

import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import ServicesCarousel from "../ServicesCarousel";
import { useRef, useState, useEffect } from "react";

interface TextComponentProps {
  children: React.ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
}

const ServicesSection = () => {
  // Change the type to HTMLDivElement specifically
  const ref = useRef<HTMLDivElement>(null);

  // Initialize with null and set in useEffect to avoid hydration issues
  const [deviceWidth, setDeviceWidth] = useState<boolean | null>(null);

  useEffect(() => {
    setDeviceWidth(window.innerWidth < 756);

    const handleResize = () => {
      setDeviceWidth(window.innerWidth < 756);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: deviceWidth
      ? ["end end", "start start"]
      : ["end end", "start start"],
  });

  const firstLine = "Professional detailing services for your";
  const secondLine = "most valued possessions";

  return (
    <section className="container mx-auto md:mt-32 4xl:mt-60 px-4 pb-5 md:pb-28 flex flex-col items-center">
      {/* Main Title */}
      <h2 className="mb-4 md:text-7xl text-4xl text-center text-black bebas-neue-regular">
        Servic<span className="stroked-text relative">es</span>
      </h2>

      {/* First Line */}
      <div
        ref={ref}
        className="flex flex-wrap gap-4 justify-center text-center mt-2 md:mt-9"
      >
        {firstLine.split(" ").map((ele, i, arr) => {
          const totalWords = arr.length;
          const start = i / totalWords;
          const end = start + 1 / totalWords;

          return (
            <Heading key={i} range={[start, end]} progress={scrollYProgress}>
              {ele}
            </Heading>
          );
        })}
      </div>

      {/* Second Line with Custom Color */}
      <div className="flex flex-wrap gap-4 justify-center text-center mt-2 mb-4 md:mb-16">
        {secondLine.split(" ").map((ele, i, arr) => {
          const totalWords = arr.length;
          const start = i / totalWords;
          const end = start + 1 / totalWords;

          return (
            <Para key={i} range={[start, end]} progress={scrollYProgress}>
              {ele}
            </Para>
          );
        })}
      </div>

      <ServicesCarousel />
    </section>
  );
};

const Heading = ({ children, range, progress }: TextComponentProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.h3
      style={{ opacity }}
      className="lg:text-5xl md:text-2xl text-xl font-semibold"
    >
      {children}
    </motion.h3>
  );
};

const Para = ({ children, range, progress }: TextComponentProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.p
      style={{ opacity }}
      className="lg:text-4xl text-xl font-semibold text-[#00879E]"
    >
      {children}
    </motion.p>
  );
};

export default ServicesSection;