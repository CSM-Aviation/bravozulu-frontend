"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";

  const handleContactClick = () => {
    if (isHomePage) {
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#contact");
    }
  };

  return (
    <footer className="bg-bz-jet py-[23px] relative overflow-hidden h-auto">
      {/* Updated container to match contact section alignment */}
      <div className="container mx-auto px-4 md:px-16 py-6">
        <div className="flex lg:flex-row flex-col justify-center lg:justify-between items-center">
          {/* Company Info */}
          <div className="space-y-8 flex flex-col items-center lg:items-start justify-center">
            <Link href="/">
              <Image
                src="/logo-bravo-zulu-white.svg"
                alt="Bravo Zulu Detailing Logo"
                width={167}
                height={90}
                className="h-auto w-40"
              />
            </Link>
          </div>

          {/* Updated spacing for better alignment */}
          <div className="flex md:flex-row flex-col items-center md:items-start flex-wrap justify-center md:justify-end gap-10 md:gap-16 z-20 md:mt-12 lg:mt-0 mt-10">
            {/* Quick Links */}
            <div className="order-1">
              <h3 className="font-display font-bold text-white text-sm mb-5 lg:mb-7 text-center lg:text-left">
                Quick Links
              </h3>
              <ul className="space-y-[14px] text-xs text-bz-silver lg:text-left text-center">
                <li>
                  <Link href="/" className="hover:text-bz-electric transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-bz-electric transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Quote"
                    className="hover:text-bz-electric transition-colors"
                  >
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleContactClick}
                    className="hover:text-bz-electric transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-bz-electric transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="order-2 lg:order-2 md:order-3">
              <h3 className="font-display font-bold text-white text-sm text-center lg:text-left mb-5 lg:mb-7">
                Our Services
              </h3>
              <ul className="space-y-[14px] text-xs text-bz-silver lg:text-left text-center">
                <li className="hover:text-bz-electric transition-colors">
                  Aircraft Detailing
                </li>
                <li className="hover:text-bz-electric transition-colors">
                  Automotive Detailing
                </li>
                <li className="hover:text-bz-electric transition-colors">
                  RV Detailing
                </li>
                <li className="hover:text-bz-electric transition-colors">
                  Vessel Detailing
                </li>
                <li className="hover:text-bz-electric transition-colors">
                  Interior Services
                </li>
                <li className="hover:text-bz-electric transition-colors">
                  Exterior Services
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="order-3 lg:order-3 md:order-2">
              <h3 className="font-display font-bold text-white text-sm text-center lg:text-left mb-5 lg:mb-7">
                Contact
              </h3>
              <ul className="space-y-[14px] text-xs text-bz-silver lg:text-left text-center">
                <li>
                  <a
                    href="tel:559-690-9500"
                    className="hover:text-bz-electric transition-colors"
                  >
                    559-690-9500
                  </a>
                </li>
                <li className="flex items-center justify-center lg:justify-start">
                  <a
                    href="mailto:services@mybravozulu.com"
                    className="hover:text-bz-electric transition-colors"
                  >
                    services@mybravozulu.com
                  </a>
                </li>
                <li className="w-[160px]">
                  2665 N. Air Fresno Dr, Suite 110, Fresno, CA 93727
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white opacity-70">
              ©️ {currentYear} Bravo Zulu Services Inc. All rights reserved.
            </p>
            <Link
              href="/login"
              className="text-sm mt-2 md:mt-0 text-bz-silver hover:text-white transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none lg:block hidden absolute lg:-bottom-[36%] md:-bottom-[14%] -bottom-[5%] left-1/2 -translate-x-1/2 text-[47px] md:text-[160px] lg:text-[180px] whitespace-nowrap">
        <h1 className="font-display font-extrabold text-white opacity-[20%] tracking-wide uppercase">
          Bravo Zulu
        </h1>
      </div>
      <div className="pointer-events-none lg:block hidden absolute bottom-0 w-full h-[10%] md:h-[30%] lg:h-[50%] bg-gradient-to-t from-bz-jet to-transparent"></div>
    </footer>
  );

}
