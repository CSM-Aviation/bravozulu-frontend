"use client";

import { useState, useEffect } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";
import { CarouselItems } from "./constants";
import MobileVersion from "./MobileVersion";
import DesktopVersion from "./DesktopVersion";

const ServicesCarousel = () => {
  const [isMobile, setIsMobie] = useState(window.innerWidth < 768);

  // return isMobile ? <MobileVersion /> : <DesktopVersion />;
  return <MobileVersion />
  // return <DesktopVersion />;
};

export default ServicesCarousel;
