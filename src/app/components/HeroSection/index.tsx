"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import CustomButton from "@/app/utils/CustomButton";

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Set video as loaded after initial render
    setVideoLoaded(true);

    // Ensure the page starts at the top when loaded
    window.scrollTo(0, 0);

    if (videoLoaded) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoLoaded]);

  return (
    <section className="relative mb-16 h-screen w-screen" id="hero">
      <AnimatePresence>{showLoader && <Loader />}</AnimatePresence>
      <div className="absolute inset-0 -z-0 bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
          onPlay={() => setVideoLoaded(true)}
          preload="auto"
        >
          <source src="/videos/BgLightening.mp4" type="video/mp4" />
          {/* <source src="/videos/BgLightening.gif" type="video/gif" /> */}
        </video>
      </div>

      <div className="absolute inset-0 -z-10 bg-black/50" />

      <motion.div
        className="absolute flex justify-center items-center inset-0"
        initial={{ y: "-100%" }}
        animate={videoLoaded ? { y: "33%" } : {}}
        transition={{
          duration: 1.5,
          ease: "easeOut",
          delay: 0.5,
        }}
      >
        <>
          <Image
            src="/images/hero/plane3.png"
            alt="Aircraft front view"
            width={1200}
            height={400}
            className="h-auto w-[90%] ml-[2.75%] md:w-1/2 max-h-[40vh] object-contain  "
            priority
          />
        </>
      </motion.div>

      <motion.div
        className="absolute inset-0 md:-translate-y-12 w-screen overflow-x-hidden bg-gradient-to-b from-black/30 to-transparent px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="container mx-auto flex h-full flex-col items-center justify-center px-0 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <h1 className="mb-6 text-4xl text-center font-bold tracking-tight text-white md:text-7xl">
            Perfection is in the Detail
          </h1>
          <p className="mb-8 max-w-[780px] text-center text-xs uppercase tracking-wide text-white/90 md:text-base">
            FROM SINGLE ENGINE CESSNA&apos;S TO GULFSTREAMS AND EVERYTHING IN
            BETWEEN, WE TAKE CARE OF YOUR AIRCRAFT&apos;S DETAILING NEEDS FROM
            START TO FINISH, INSIDE AND OUT.
          </p>
          <CustomButton text="Request Quote" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
