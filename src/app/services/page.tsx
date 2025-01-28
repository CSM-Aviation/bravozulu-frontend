'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HeroWithNav = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`/${path.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative h-96 w-full">
        <Image
          src="/heroimageservices.png"
          alt="Hero"
          fill
          className="object-fill"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <h1 className="text-4xl font-bold text-white">Transport Categories</h1> */}
        </div>
      </div>

      <div className="relative flex justify-center gap-8 py-20 overflow-hidden bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500">
        <div className="absolute inset-0 opacity-10 bg-repeat pattern-grid" />
        
        {['Aircraft', 'Automobile', 'Vessel'].map((category) => (
          <button
            key={category}
            onClick={() => handleNavigation(category)}
            className="group relative px-12 py-6 text-xl font-bold text-white overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:z-10"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            <span className="relative z-10 flex items-center gap-2">
              {category}
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-12 py-20 px-8 bg-white">
        <div className="flex-1 text-black">
          <h2 className="text-3xl font-bold mb-6">EXTERIOR</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Ensuring that your vehicle looks its best and is more fuel efficient can be accomplished by using our detailing service. 
            We offer standard detailing services such as, washing, and waxing; specialized services such as brightwork polishing 
            and paint rejuvenation, and custom services. Get rid of those unsightly containments by calling Bravo Zulu Services 
            to schedule your next detailing service in the Central California Area.
          </p>
        </div>
        <div className="relative w-96 h-96">
          <Image
            src="/aircraftdetailing.jpg"
            alt="Exterior Detailing Service"
            fill
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>

      <div className="relative flex items-center gap-12 py-20 px-8 bg-gray-50">
        <div className="relative w-96 h-96">
          <Image
            src="/interiorclean.jpg"
            alt="Interior Detailing Service"
            fill
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
        <div className="flex-1 text-black">
          <h2 className="text-3xl font-bold mb-6">INTERIOR</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Both time and condition determine what level of cleaning your vehicle interior requires which is why we offer everything from a trip ready interior cleaning to a deep interior detail. Whether you need a quick touch-up, a full deep cleaning, or something in between we&apos;ll have your vehicle ready meeting the highest standards. In addition to our regular interior detailing services, we offer custom services such as stain removal, leather dye touch-up and repair. We welcome you to call us for more information or to schedule your next interior detailing service.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            transform: translateX(100%) skewX(-12deg);
          }
        }
        .pattern-grid {
          background-image: radial-gradient(circle, white 1px, transparent 1px);
          background-size: 20px 20px;
        }
        :global(.animate-shine) {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroWithNav;