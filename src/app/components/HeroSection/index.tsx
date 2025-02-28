'use client'
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loader from '../Loader';

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (videoLoaded) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoLoaded]);

  return (
    <section className="relative mb-16 h-screen w-screen">
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
        >
          <source src="/videos/BgLightening.mp4" type="video/mp4" />
          <source src="/videos/BgLightening.gif" type="video/gif" />
        </video>
      </div>

      <div className="absolute inset-0 -z-10 bg-black/50" />

      <motion.div
        className="absolute inset-0 flex items-center justify-center pl-12"
        initial={{ y: '-100%' }}
        animate={videoLoaded ? { y: '33%' } : {}}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
          delay: 0.5,
        }}
      >
        <div className="relative w-full max-w-3xl">
          <Image
            src="/images/hero/Plane.png"
            alt="Aircraft front view"
            width={1200}
            height={400}
            className="h-auto w-full"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 w-screen overflow-x-hidden bg-gradient-to-b from-black/30 to-transparent pl-12"
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
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Perfection is in the Detail
          </h1>
          <p className="mb-8 max-w-2xl text-base uppercase tracking-wide text-white/90 md:text-base">
            From single engine Cessna&apos;s to Gulfstreams and everything in
            between, we take care of your aircraft&apos;s detailing needs from
            start to finish, inside and out.
          </p>
          <a
            href="#contact-form"
            className="btn w-inline-block btn-border-anim stroke-gr custom-a"
          >
            <div>Book Now</div>
            <div className="arrow-20 w-embed">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
              >
                <path
                  d="M8.5 15.5L12.5 11L8.5 6.5"
                  stroke="currentcolor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Image
              src="https://cdn.prod.website-files.com/672799259500d2477d1eafa5/672799259500d2477d1eb09a_btg-bg.svg"
              loading="lazy"
              width="195"
              height="56"
              alt=""
              className="btn-bg"
            />
            <Image
              src="https://cdn.prod.website-files.com/672799259500d2477d1eafa5/672799259500d2477d1eb099_btn-bg-hover.svg"
              alt=""
              width="193"
              height="62"
              className="btn-bg-hover"
            />
            <div className="animating-block"></div>
            <div className="btn-hack"></div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
