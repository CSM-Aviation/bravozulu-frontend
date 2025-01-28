import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  imagePath: string;
}

const ServiceCard = ({ title, description, imagePath }: ServiceCardProps) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="relative h-48">
      <Image
        src={imagePath}
        alt={title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        href="/quote" 
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Now
      </Link>
    </div>
  </div>
);

export default function Services() {
  const services = [
    {
      title: "Aircraft Detailing",
      description: "Professional detailing services for all aircraft types, from single-engine Cessnas to Gulfstreams. Includes wet washes, boot conditioning, and brightwork polishing.",
      imagePath: "/Hero_image.avif"
    },
    {
      title: "Automotive Detailing",
      description: "Comprehensive automotive detailing services including washing, waxing, paint rejuvenation, and specialized brightwork polishing for superior results.",
      imagePath: "/AUTOMOBILE.avif"
    },
    {
      title: "Vessel Detailing",
      description: "Expert vessel detailing services to keep your watercraft in pristine condition, with attention to every detail inside and out.",
      imagePath: "/vessel.avif"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-xl text-gray-600">
            Professional detailing services for your most valued possessions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              imagePath={service.imagePath}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Interior Services</h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            From quick touch-ups to deep interior detailing, we offer comprehensive interior cleaning services including leather treatments, carpet cleaning, and wood cabinet polishing. Custom services such as stain removal and leather repair are also available.
          </p>
          <Link 
            href="/services" 
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}