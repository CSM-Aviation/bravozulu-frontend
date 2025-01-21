'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/BravoZulu_logo.avif"
                alt="Bravo Zulu Services Logo"
                width={140}
                height={140}
                className="mr-2"
              />
              {/* <span className="text-xl font-bold">Bravo Zulu Services</span> */}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/services" className="text-gray-700 hover:text-gray-900">
              Services
            </Link>
            <Link href="/quote" className="text-gray-700 hover:text-gray-900">
              Quote
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <a 
              href="tel:559-425-8620" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              559-425-8620
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}