"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const CustomMouse: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState<"default" | "text">(
    "default"
  );
  const [cursorSize, setCursorSize] = useState<{
    width: number;
    height: number;
  }>({ width: 16, height: 16 });
  const headingsRef = useRef<NodeListOf<HTMLHeadingElement> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener("mousemove", mouseMove);

      const updateHeadings = () => {
        if (typeof document !== "undefined") {
          headingsRef.current = document.querySelectorAll("h1, h2, h3");

          const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const computedFontSize = window.getComputedStyle(target).fontSize;
            const fontSize = parseFloat(computedFontSize);
            const scaleFactor = fontSize > 40 ? 1.5 : 2;
            setCursorSize({
              width: fontSize * scaleFactor,
              height: fontSize * scaleFactor,
            });
            setCursorVariant("text");
          };

          const handleMouseLeave = () => {
            setCursorSize({ width: 16, height: 16 });
            setCursorVariant("default");
          };

          headingsRef.current.forEach((heading) => {
            heading.addEventListener("mouseenter", handleMouseEnter);
            heading.addEventListener("mouseleave", handleMouseLeave);
          });

          return () => {
            if (headingsRef.current) {
              headingsRef.current.forEach((heading) => {
                heading.removeEventListener("mouseenter", handleMouseEnter);
                heading.removeEventListener("mouseleave", handleMouseLeave);
              });
            }
          };
        }
        return () => {}; // Return empty cleanup function when document is undefined
      };

      const cleanupHeadings = updateHeadings();

      return () => {
        window.removeEventListener("mousemove", mouseMove);
        if (cleanupHeadings) {
          cleanupHeadings();
        }
      };
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--cursor-color",
        pathname === "/contact-us" ? "white" : "#121212"
      );
    }
  }, [pathname]);

  const variants = {
    default: {
      x: mousePosition.x - cursorSize.width / 2,
      y: mousePosition.y - cursorSize.height / 2,
      width: cursorSize.width,
      height: cursorSize.height,
      transition: { duration: 0.1 },
    },
    text: {
      x: mousePosition.x - cursorSize.width / 2,
      y: mousePosition.y - cursorSize.height / 2,
      width: cursorSize.width,
      height: cursorSize.height,
      backgroundColor: "#ebebeb",
      mixBlendMode: "difference" as const,
      opacity: 1,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.div
      className="fixed hidden md:block bg-black rounded-full opacity-80 top-0 left-0 pointer-events-none z-[100]"
      variants={variants}
      animate={cursorVariant}
      style={{ width: cursorSize.width, height: cursorSize.height }}
    />
  );
};

export default CustomMouse;