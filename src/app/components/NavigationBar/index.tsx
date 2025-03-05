"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Menu, X, Phone } from "lucide-react";
import "./button.css";
import "./navbar.css"; // Import the new CSS file
import { useRouter, usePathname } from "next/navigation";
import { apiService } from "../../APIServices/apiService";
import { useUser } from "../../contexts/UserContext";

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

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
    window.addEventListener("storage", checkAuth);

    // Custom event listener for login/logout in same tab
    window.addEventListener("authStateChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authStateChange", checkAuth);
    };
  }, [clearUser]);

  const handleLogout = () => {
    apiService.logout();
    clearUser();
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Function to check if the link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] w-screen transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        prevScrollPos > 10
          ? "bg-[rgb(1,10,16)] backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div
        className={`container mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-6`}
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-white/80"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <Link href="/" className="relative h-10 w-40">
            <Image
              src="/BravoZulu_logo.png"
              alt="Bravo Zulu Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className={`nav-link ${isActive("/services") ? "active" : ""}`}
          >
            Services
          </a>
          <Link
            href="/Quote"
            className={`nav-link ${isActive("/Quote") ? "active" : ""}`}
          >
            Quote
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
          <a href="tel:559-425-8620" className="phone-link">
            <Phone className="w-4 h-4 mr-2" />
          </a>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <div className="flex flex-col items-center">
                {user && (
                  <span className="text-white text-sm font-medium">
                    {user.firstName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 mt-1 text-sm text-white hover:text-[#13fdfd] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-secondary in-nav w-inline-block stroke-gr-8 secondary-btn-gr custom-a"
              onClick={handleLogin}
            >
              <div className="nav-text">Login</div>
            </Link>
          )}
        </div>

        {/* Mobile Phone and Login Button */}
        <div className="md:hidden flex items-center gap-4">
          <a
            href="tel:559-425-8620"
            className="p-2 text-white hover:text-[#13fdfd] transition-colors"
          >
            <Phone className="w-6 h-6" />
          </a>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-white hover:text-[#13fdfd] transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center text-white hover:text-[#13fdfd] transition-colors"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[rgb(1,10,16)] shadow-lg">
          <div className="px-8 py-4 space-y-1">
            <a
              href="#services"
              className={`mobile-nav-link ${
                isActive("/services") ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <Link
              href="/Quote"
              className={`mobile-nav-link ${
                isActive("/Quote") ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quote
            </Link>
            <Link
              href="/contact"
              className={`mobile-nav-link ${
                isActive("/contact") ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`mobile-nav-link ${
                  isActive("/dashboard") ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
