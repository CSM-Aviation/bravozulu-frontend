import CustomButton from "@/app/utils/CustomButton";

const HeroSection = () => {
  return (
    <section className="relative mb-16 h-screen w-screen" id="hero">
      <div className="absolute inset-0 -z-0 bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          preload="auto"
        >
          <source src="/videos/VideoBG3.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 w-screen overflow-x-hidden px-5">
        <div className="container mx-auto flex h-full flex-col items-center justify-center px-0 text-center">
          <h1 className="mb-6 max-w-4xl text-center font-display text-4xl font-extrabold tracking-[-0.025em] text-white md:text-[56px] md:leading-[1.1]">
            Professional detailing for the vehicles you rely on, enjoy, and
            take pride in.
          </h1>
          <p className="mb-8 max-w-[780px] text-center font-body text-base leading-relaxed text-white/90 md:text-lg">
            Bravo Zulu provides mobile detailing services for aircraft,
            automobiles, RVs, and vessels &mdash; helping keep your vehicle
            clean, protected, and ready for its next drive, flight or day on
            the water.
          </p>
          <CustomButton text="Request Quote" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
