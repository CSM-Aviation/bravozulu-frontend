'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, LogOut, Menu, X, Phone } from 'lucide-react';
import { apiService } from '../APIServices/apiService';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const router = useRouter();
  const { user, clearUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and after any login/logout
    const checkAuth = () => {
      const isAuth = apiService.isAuthenticated();
      setIsAuthenticated(isAuth);

      // If not authenticated, clear user data
      if (!isAuth) {
        clearUser();
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage events to detect login/logout in other tabs
    window.addEventListener('storage', checkAuth);

    // Custom event listener for login/logout in same tab
    window.addEventListener('authStateChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChange', checkAuth);
    };
  }, [clearUser]);

  const handleLogout = () => {
    apiService.logout();
    clearUser();
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-16 md:h-24 items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex-shrink-0 flex flex-col items-center ml-2 md:ml-0">
              <Image
                src="/BravoZulu_logo.png"
                alt="Bravo Zulu Services Logo"
                width={200}
                height={200}
                className="w-32 md:w-40 lg:w-48 h-auto"
              />
              <div className="text-blue-600 font-bold text-xs mt-1">
                UNDER CONSTRUCTION
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
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
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute md:hidden top-16 left-0 right-0 bg-white shadow-lg z-10">
              <div className="px-4 pt-2 pb-4 space-y-4">
                <Link href="/services" className="block text-gray-700 hover:text-gray-900">
                  Services
                </Link>
                <Link href="/Quote" className="block text-gray-700 hover:text-gray-900">
                  Quote
                </Link>
                <Link href="/contact" className="block text-gray-700 hover:text-gray-900">
                  Contact
                </Link>
                <a
                  href="tel:559-425-8620"
                  className="block text-gray-700 hover:text-gray-900"
                >
                  559-425-8620
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {/* Phone number for mobile */}
            <a
              href="tel:559-425-8620"
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            >
              <Phone className="w-6 h-6" />
            </a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <div className="flex flex-col items-center">
                  {user && (
                    <span className="text-gray-700 text-sm font-medium">
                      {user.firstName}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 mt-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden md:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
