'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { apiService } from '../APIServices/apiService';
// import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  // const router = useRouter();
  const { clearUser } = useUser();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and after any login/logout
    const checkAuth = () => {
      const isAuth = apiService.isAuthenticated();
      // setIsAuthenticated(isAuth);

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
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Empty div preserved to maintain layout */}
          </div>
        </div>
      </nav>
    </header>
  );
}