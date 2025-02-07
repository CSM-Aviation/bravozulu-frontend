'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, LogOut } from 'lucide-react';
import { apiService } from '../APIServices/apiService';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const router = useRouter();
  const { user, clearUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <div className="flex justify-between h-24 items-center">
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
