'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, LogOut } from 'lucide-react';
import { apiService } from '../APIServices/apiService';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and after any login/logout
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-24">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/BravoZulu_logo.avif"
                alt="Bravo Zulu Services Logo"
                width={200}
                height={200}
                className="mr-2"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-gray-900">
              Services
            </Link>
            <Link href="/Quote" className="text-gray-700 hover:text-gray-900">
              Quote
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <a 
              href="tel:559-425-8620" 
              className="text-gray-700 hover:text-gray-900"
            >
              559-425-8620
            </a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}