"use client";

import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import ServicesCarousel from "../ServicesCarousel";
import { useRef } from "react";

interface TextComponentProps {
  children: React.ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
}

const ServicesSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const headline = "Services designed around how you use your vehicle.";

  return (
    <section
      id="services"
      className="container mx-auto md:mt-32 px-4 pb-5 md:pb-28 flex flex-col items-center"
    >
      {/* Section label */}
      <span className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-bz-electric">
        Services
      </span>

      {/* Headline */}
      <div
        ref={ref}
        className="flex max-w-4xl flex-wrap justify-center gap-x-3 gap-y-1 text-center mt-2 md:mt-4"
      >
        {headline.split(" ").map((ele, i, arr) => {
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

      {/* Body copy */}
      <p className="mt-6 mb-4 max-w-3xl text-center font-body text-base leading-relaxed text-bz-slate md:mb-16">
        Bravo Zulu provides professional wash, interior cleaning, exterior
        detailing, paint enhancement, correction, and ceramic protection
        services designed to clean, restore, and protect the vehicles you rely
        on and enjoy &mdash; from routine upkeep and trip-ready cleaning to
        more complete detailing services.
      </p>

      <ServicesCarousel />
    </section>
  );
};

const Heading = ({ children, range, progress }: TextComponentProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.h2
      style={{ opacity }}
      className="font-display text-3xl font-extrabold tracking-[-0.02em] text-bz-jet md:text-5xl"
    >
      {children}
    </motion.h2>
  );
};

export default ServicesSection;
