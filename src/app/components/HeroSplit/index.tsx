import Image from "next/image";
import CustomButton from "@/app/utils/CustomButton";

const HeroSplit = () => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-white">
      {/* Decorative layers */}
      <div
        aria-hidden="true"
        className="bz-fade-in pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-bz-mist/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="bz-fade-in pointer-events-none absolute -right-20 top-[62%] h-80 w-80 -translate-y-1/2 rounded-full bg-bz-glaze opacity-70 blur-3xl md:-right-36 md:top-1/2 md:h-[620px] md:w-[620px]"
      />
      <div
        aria-hidden="true"
        className="bz-fade-in pointer-events-none absolute right-4 top-20 hidden h-[400px] w-[460px] opacity-60 [animation-delay:0.4s] lg:block [background-image:radial-gradient(circle,#C0C0C0_1.5px,transparent_1.5px)] [background-size:22px_22px] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      <div className="container relative mx-auto grid items-center gap-12 px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-20 lg:min-h-[min(820px,92vh)] lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Copy block */}
        <div className="max-w-2xl">
          <span
            aria-hidden="true"
            className="bz-rule-wipe mb-6 block h-[3px] w-16 rounded-full bg-bz-electric [animation-delay:0.1s]"
          />
          <h1 className="bz-fade-up font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.025em] text-bz-jet [animation-delay:0.2s] md:text-5xl xl:text-[54px]">
            Professional detailing for the vehicles you rely on, enjoy, and
            take <span className="text-bz-electric">pride</span> in.
          </h1>
          <p className="bz-fade-up mt-6 max-w-[560px] font-body text-base leading-relaxed text-bz-slate [animation-delay:0.35s] md:text-lg">
            Bravo Zulu provides mobile detailing services for aircraft,
            automobiles, RVs, and vessels &mdash; helping keep your vehicle
            clean, protected, and ready for its next drive, flight or day on
            the water.
          </p>
          <div className="bz-fade-up mt-8 [animation-delay:0.5s]">
            <CustomButton text="Request Quote" />
          </div>
        </div>

        {/* Photo collage */}
        <div className="relative grid w-full grid-cols-2 items-center gap-4 md:gap-5 lg:max-w-[560px] lg:justify-self-end">
          <svg
            aria-hidden="true"
            className="bz-fade-in pointer-events-none absolute -left-10 -top-10 hidden text-bz-silver [animation-delay:0.8s] lg:block"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M40 0V80M0 40H80"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
          <svg
            aria-hidden="true"
            className="bz-fade-in pointer-events-none absolute -bottom-10 -right-10 hidden text-bz-silver [animation-delay:0.8s] lg:block"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M40 0V80M0 40H80"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
          <div className="bz-fade-up relative aspect-[3/4] overflow-hidden rounded-2xl border border-bz-silver/40 [animation-delay:0.3s]">
            <Image
              src="/images/hero/hero-aircraft.jpg"
              alt="Business jet on a sunny ramp after professional detailing"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 26vw, 45vw"
            />
          </div>
          <div className="flex flex-col gap-4 md:gap-5">
            <div className="bz-fade-up relative aspect-square overflow-hidden rounded-xl border border-bz-silver/40 [animation-delay:0.45s]">
              <Image
                src="/images/hero/hero-vessel.jpg"
                alt="Boat at a marina dock, freshly detailed"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 26vw, 45vw"
              />
            </div>
            <div className="bz-fade-up relative aspect-[4/3] overflow-hidden rounded-xl border border-bz-silver/40 [animation-delay:0.6s]">
              <Image
                src="/images/hero/hero-auto.jpg"
                alt="Luxury car in bright sunlight after mobile detailing"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 26vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSplit;
