"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Phone } from "lucide-react";
import "./button.css";
import "./navbar.css"; // Import the new CSS file
import { useRouter, usePathname } from "next/navigation";
import { apiService } from "../../APIServices/apiService";
import { useUser } from "../../contexts/UserContext";
import { motion } from "framer-motion";

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  
  // Check if we're on the homepage
  const isHomePage = pathname === "/" || pathname === "/home";
  
  // Monitor for navigation and scroll to the section if needed
  useEffect(() => {
    // Check if we're on homepage and have a section to scroll to
    if (isHomePage && scrollToSection) {
      // Find the element
      const element = document.getElementById(scrollToSection);
      if (element) {
        // Use setTimeout to ensure the DOM is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setScrollToSection(null); // Reset after scrolling
        }, 100);
      }
    }
  }, [isHomePage, scrollToSection]);
  
  // Handle scroll to section on homepage
  const handleSectionNavigation = (sectionId: string): void => {
    if (isHomePage) {
      // Already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Set the section to scroll to after navigation
      setScrollToSection(sectionId);
      // Navigate to homepage
      router.push('/');
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  // Determine background style based on page and scroll position
  const getBackgroundStyle = () => {
    if (isHomePage) {
      // On homepage, transparent when at top, semi-transparent when scrolled
      return prevScrollPos > 50 
        ? "bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] bg-opacity-80" 
        : "bg-transparent";
    } else {
      // On other pages, always use the gradient
      return "bg-gradient-to-br from-[#0F172A] to-[#1E3A8A]";
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] w-screen transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${getBackgroundStyle()}`}
    >
      <div
        className={`container mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-6`}
      >
        <div className="flex items-center">
          <div
            className="cursor-pointer z-20 md:hidden block"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={
                isOpen
                  ? { rotate: 45, y: 50, x: 200, backgroundColor: "white" }
                  : { rotate: 0, y: 0 }
              }
              className="w-6 h-0.5 bg-white mb-1 rounded"
            />
            <motion.div
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white mb-1 rounded"
            />
            <motion.div
              animate={
                isOpen
                  ? { rotate: -45, y: 38, x: 199, backgroundColor: "white" }
                  : { rotate: 0, y: 0 }
              }
              className="w-6 h-0.5 bg-white rounded"
            />
          </div>
          <Link href="/" className="relative h-10 w-32 ml-4">
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
          <button
            onClick={() => handleSectionNavigation('services')}
            className={`nav-link ${isActive("/services") ? "active" : ""}`}
          >
            Services
          </button>
          <Link
            href="/Quote"
            className={`nav-link ${isActive("/Quote") ? "active" : ""}`}
          >
            Quote
          </Link>
          <button
            onClick={() => handleSectionNavigation('contact')}
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </button>
          <a href="tel:559-690-9500" className="phone-link">
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
            href="tel:559-690-9500"
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
      {isOpen && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
          <div className="relative">
            {/* Sliding menu with updated background and text animation */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isOpen ? "7%" : "-100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-10 left-0 w-72 h-full bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] shadow-lg p-6 rounded-3xl"
            >
              <ul className="space-y-6 pt-16 text-white text-2xl font-bold">
                <motion.li
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.button
                    className={`${isActive("/services") ? "active" : ""} transition-all duration-300 hover:text-[#13fdfd]`}
                    onClick={() => {
                      setIsOpen(false);
                      handleSectionNavigation('services');
                    }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Services{" "}
                  </motion.button>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href="/Quote"
                      className={`${isActive("/Quote") ? "active" : ""} transition-all duration-300 hover:text-[#13fdfd]`}
                      onClick={() => setIsOpen(false)}
                    >
                      Quote
                    </Link>
                  </motion.div>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.button
                    className={`${isActive("/contact") ? "active" : ""} transition-all duration-300 hover:text-[#13fdfd]`}
                    onClick={() => {
                      setIsOpen(false);
                      handleSectionNavigation('contact');
                    }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Contact
                  </motion.button>
                </motion.li>
                {isAuthenticated && (
                  <motion.li
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href="/dashboard"
                        className={`${isActive("/dashboard") ? "active" : ""} transition-all duration-300 hover:text-[#13fdfd]`}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
