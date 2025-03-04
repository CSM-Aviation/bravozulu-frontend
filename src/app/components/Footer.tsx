import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  // const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-[23px] relative overflow-hidden lg:h-auto h-auto md:h-[78vh]">
      {/* Added max-w-7xl to limit content width and mx-auto to center it */}
      <div className="max-w-7xl mx-auto px-8 md:px-14 py-6">
        <div className="flex lg:flex-row flex-col justify-center lg:justify-between items-center">
          {/* Company Info */}
          <div className="space-y-8 flex flex-col items-center justify-center">
            <Link href="/">
              <Image
                src="/footerlogo2.png"
                alt="Bravo Zulu Services Logo"
                width={190}
                height={20}
              />
            </Link>
            <p className="text-sm md:w-[480px] lg:w-[290px] lg:text-left text-center text-white opacity-70 md:opacity-50 lg:opacity-70">
              Bravo Zulu Services exceeded my expectations with their aircraft
              detailing. The attention to detail and professionalism were
              outstanding. My jet has never looked better!
            </p>
          </div>

          {/* Removed the excessive gap-32 and replaced with gap-16 */}
          <div className="flex md:flex-row flex-col items-center md:items-start flex-wrap justify-center md:justify-end gap-10 md:gap-16 z-20 md:mt-12 lg:mt-0 mt-10">
            {/* Quick Links */}
            <div className="order-1">
              <h3 className="text-white text-sm mb-5 lg:mb-7 text-center lg:text-left">
                Quick Links
              </h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6] opacity-70 lg:text-left text-center">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quote"
                    className="hover:text-white transition-colors"
                  >
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="order-2 lg:order-2 md:order-3">
              <h3 className="text-white text-sm text-center lg:text-left mb-5 lg:mb-7">
                Our Services
              </h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6] opacity-70 lg:text-left text-center">
                <li className="hover:text-white transition-colors">
                  Aircraft Detailing
                </li>
                <li className="hover:text-white transition-colors">
                  Automotive Detailing
                </li>
                <li className="hover:text-white transition-colors">
                  Vessel Detailing
                </li>
                <li className="hover:text-white transition-colors">
                  Interior Services
                </li>
                <li className="hover:text-white transition-colors">
                  Exterior Services
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="order-3 lg:order-3 md:order-2">
              <h3 className="text-white text-sm text-center lg:text-left mb-5 lg:mb-7">
                Contact
              </h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6] lg:text-left opacity-70 text-center">
                <li>
                  <a
                    href="tel:559-425-8620"
                    className="hover:text-white transition-colors"
                  >
                    559-425-8620
                  </a>
                </li>
                <li className="flex items-center justify-center lg:justify-start">
                  <a
                    href="mailto:service@mybravozulu.com"
                    className="hover:text-white transition-colors"
                  >
                    service@mybravozulu.com
                  </a>
                </li>
                <li className="w-[160px]">
                  6737 N. Milburn Ave.Suite 160-100 Fresno, CA 93722
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              ©️ {currentYear} Bravo Zulu Services Inc. All rights reserved.
            </p>
            <p className="text-sm mt-2 md:mt-0">
            &quot;A job well done&quot; in Naval terms
            </p>
          </div>
        </div> */}
      </div>
      <div className="pointer-events-none lg:block hidden absolute lg:-bottom-[36%] md:-bottom-[14%] -bottom-[5%] left-1/2 -translate-x-1/2 text-[47px] md:text-[160px] lg:text-[180px] whitespace-nowrap font-semibold">
        <h1 className="text-white opacity-[20%] bebas-neue-regular tracking-wide uppercase">
          Bravo Zulu
        </h1>
      </div>
      <div className="pointer-events-none lg:block hidden absolute bottom-0 w-full h-[10%] md:h-[30%] lg:h-[50%] bg-gradient-to-t from-black/90 to-transparent"></div>
    </footer>
  );
}