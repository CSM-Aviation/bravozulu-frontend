'use client'

import React from 'react'
import Image from 'next/image'

const Aircraft = () => {
  const exteriorServices = [
    {
      title: "Quick Turn Trip Ready Exterior",
      description: "Our team wipes down the exterior trouble areas, removes bug strikes from leading edges, windscreen, engine inlets, aircraft's nose, and windows. Followed by dry washing away oil and fluids from the sides and bottom of the engines. This service is completed by a light wipe down of the landing gear and engine cowlings."
    },
    {
      title: "Basic Wash",
      description: "This is a mini-wet wash service focusing on your aircraft's most visible exterior surfaces, especially the upper area of the aircraft, the nose, doors, steps, leading edges, and inlets. The final step is the cleaning of all exterior windows."
    },
    {
      title: "Wet Wash",
      description: "Our wet washing technique insures that the entire exterior of the aircraft is completely clean and free of debris. The aircraft is dry and spot free when complete. Service recommended for aircraft that have been exposed to harsh or corrosive conditions, like saltwater areas."
    },
    {
      title: "Dry Wash",
      description: "Our environmentally friendly technique completely cleans the entire exterior of the aircraft, without water, while leaving a beautiful shine. Our most popular wash technique due to stringent environmental restrictions."
    },
    {
      title: "Exterior Wax",
      description: "Regular exterior wax applications will not only keep you aircraft looking great and protect your paint, but it will also extend the life of the paint greatly. All of our waxes are aircraft approved and silicone free."
    },
    {
      title: "Brightwork Metal Polishing",
      description: "Polishing Brightwork is an art that few have mastered. One of our specialties is our metal polishing process. Leading edges, Engine Inlets, Thrust Reversers and Propeller Spinners are polished to a mirror finish. Even scratches and gouges can be removed."
    },
    {
      title: "De-Ice Boot Refurbishment",
      description: "Our 3 step process of stripping, conditioning and sealing pneumatic de-ice boots will restore your boots to a high gloss shine while protecting them. Regular de-ice boot treatments will not only keep the boots looking their best but will also extend their life greatly."
    }
  ]

  const interiorServices = [
    {
      title: "Quick Turn Trip Ready Interior",
      description: "Our staff will have you trip ready in record time. All trash will be removed, passenger seating area straightened and safety belts organized, tables wiped down, finished off by the aircraft's cabin being vacuumed."
    },
    {
      title: "Basic Interior Detail",
      description: "You can relax while our team removes the trash, and wipes down all wood/Formica, leather/vinyl surfaces, countertops, and the interior windows. Once completed they will vacuum your carpet and spray a mild air freshener throughout your aircraft."
    },
    {
      title: "Basic Interior Plus/Mid-Interior",
      description: "When a basic interior isn't quite enough and a complete interior isn't required we will customize a basic interior plus service to meet your needs. This service includes all items in the standard basic interior plus additional areas which need extra attention."
    },
    {
      title: "Complete Interior Detail",
      description: "Our thorough interior cleaning and detailing process is truly first-class. All of the carpeting and upholstery vacuumed. All surfaces are cleaned, sanitized and detailed. All wood cabinets and trim is polished. Leather seating and surfaces are cleaned and conditioned. Galleys and Lavs are cleaned and sanitized. Cabin entries and cockpits are detailed and upon request, instrument panels can be cleaned and detailed."
    },
    {
      title: "Carpet & Upholstery Extraction",
      description: "Our steam extraction process deep cleans carpeting and upholstery to get them looking their best. This service is great for high traffic areas."
    },
    {
      title: "Leather Cleaning & Conditioning",
      description: "Our leather cleaning and conditioning service is a great way to maintain the look, feel, color and smell of your fine leather. Regular cleaning and conditioning will prolong the life and look of your leather for years to come."
    },
    {
      title: "Stain Removal",
      description: "If a stain can be removed, we are the ones who can do it. We are masters at stain removal. Coffee, wine, ink, soda, food, gum & biological are just a few of the stains that we can almost always successfully remove. Time is critical for easy removal."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <Image
          src="/aircraft-hero.jpg"
          alt="Aircraft Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30">
          <div className="container mx-auto h-full flex items-center px-4">
            <h1 className="text-5xl font-bold text-white max-w-2xl">
              Professional Aircraft Detailing Services
            </h1>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Schedule Your Aircraft Detailing?
          </h2>
          <button className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg 
            hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl">
            Book Now
          </button>
        </div>
      </div>

      {/* Services Sections */}
      <div className="container mx-auto py-16 px-4">
        {/* Exterior Services */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-cyan-700 mb-12 text-center">Exterior Services</h2>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <div className="space-y-8">
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/privatejet1.jpg"
                    alt="Aircraft Exterior Service 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/exterior2.png"
                    alt="Aircraft Exterior Service 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/exterior3.jpg"
                    alt="Aircraft Exterior Service 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              {exteriorServices.map((service, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-cyan-700 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interior Services */}
        <div>
          <h2 className="text-3xl font-bold text-cyan-700 mb-12 text-center">Interior Services</h2>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <div className="space-y-8">
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/interior1.jpg"
                    alt="Aircraft Interior Service 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/interior2.jpg"
                    alt="Aircraft Interior Service 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/interior3.jpg"
                    alt="Aircraft Interior Service 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              {interiorServices.map((service, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-cyan-700 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Aircraft