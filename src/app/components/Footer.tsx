import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-[23px]  relative overflow-hidden">
      <div className="max-w-full px-4 md:px-14 py-6">
        <div className="flex md:flex-row flex-col justify-between ">
          {/* Company Info */}
          <div className="space-y-8">
            <Link href="/" className="block">
              <Image
                src="/footerlogo2.png"
                alt="Bravo Zulu Services Logo"
                width={190}
                height={20}
              />
            </Link>
            <p className="text-xs md:w-[330px] text-white opacity-70">
              Bravo Zulu Services exceeded my expectations with their aircraft
              detailing. The attention to detail and professionalism were
              outstanding. My jet has never looked better!
            </p>
          </div>

          <div className="flex flex-row flex-wrap  justify-center md:justify-end gap-10 md:gap-32 z-20 md:mt-0 mt-10">
            {/* Quick Links */}
            <div>
              <h3 className="text-white  text-sm  mb-7">Quick Links</h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6]">
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
            <div>
              <h3 className="text-white text-sm  mb-7">Our Services</h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6]">
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
            <div>
              <h3 className="text-white text-sm  mb-7">Contact</h3>
              <ul className="space-y-[14px] text-xs text-[#B6B6B6]">
                <li className="flex items-center">
                  <a
                    href="tel:559-425-8620"
                    className="hover:text-white transition-colors"
                  >
                    559-425-8620
                  </a>
                </li>
                <li className="flex items-center ">
                  <a
                    href="mailto:service@mybravozulu.com"
                    className="hover:text-white transition-colors"
                  >
                    service@mybravozulu.com
                  </a>
                </li>
                <li className="flex items-start">
                  <div>
                    <p>6737 N. Milburn Ave.</p>
                    <p>Suite 160-100</p>
                    <p>Fresno, CA 93722</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} Bravo Zulu Services Inc. All rights reserved.
            </p>
            <p className="text-sm mt-2 md:mt-0">
            &quot;A job well done&quot; in Naval terms
            </p>
          </div>
        </div> */}
      </div>
      <div className="pointer-events-none absolute lg:-bottom-[36%] md:-bottom-[14%] -bottom-[5%] left-1/2 -translate-x-1/2 text-[47px] md:text-[160px] lg:text-[180px] whitespace-nowrap font-semibold">
        <h1 className="text-white opacity-[20%] bebas-neue-regular tracking-wide uppercase">
          Bravo Zulu
        </h1>
      </div>
      <div className="pointer-events-none absolute bottom-0 w-full h-[10%] md:h-[30%] lg:h-[50%] bg-gradient-to-t from-black/90 to-transparent"></div>
    </footer>
  );
}
