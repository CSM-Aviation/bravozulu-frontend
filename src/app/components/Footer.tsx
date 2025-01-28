import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Image
                src="/BravoZulu_logo.avif"
                alt="Bravo Zulu Services Logo"
                width={140}
                height={140}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-sm">
              Professional detailing services for aircraft, automobiles, and vessels. 
              Located at Fresno Yosemite International Airport.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors">Aircraft Detailing</li>
              <li className="hover:text-white transition-colors">Automotive Detailing</li>
              <li className="hover:text-white transition-colors">Vessel Detailing</li>
              <li className="hover:text-white transition-colors">Interior Services</li>
              <li className="hover:text-white transition-colors">Exterior Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone size={20} />
                <a 
                  href="tel:559-425-8620" 
                  className="hover:text-white transition-colors"
                >
                  559-425-8620
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} />
                <a 
                  href="mailto:service@mybravozulu.com"
                  className="hover:text-white transition-colors"
                >
                  service@mybravozulu.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1" />
                <div>
                  <p>6737 N. Milburn Ave.</p>
                  <p>Suite 160-100</p>
                  <p>Fresno, CA 93722</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} Bravo Zulu Services Inc. All rights reserved.
            </p>
            <p className="text-sm mt-2 md:mt-0">
            &quot;A job well done&quot; in Naval terms
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}