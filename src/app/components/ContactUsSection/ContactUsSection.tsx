"use client";
import React, { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import "./contactUsAnimation.css";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

// Define proper types for text components
interface TextComponentProps {
  children: React.ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
}

const ContactUs = () => {
  interface FormData {
    name: string;
    email: string;
    phone: string;
    requirements: string;
    serviceDate: string;
    concerns: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    requirements: "",
    serviceDate: "",
    concerns: ""
  });

  const ref = useRef<HTMLDivElement>(null);

  // Get window width for responsive behavior
  const [deviceWidth, setDeviceWidth] = useState(false);

  // Update device width on client-side only
  useEffect(() => {
    setDeviceWidth(window.innerWidth < 756);

    const handleResize = () => {
      setDeviceWidth(window.innerWidth < 756);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: deviceWidth
      ? ["end end", "start end"]
      : ["start center", "center center"],
  });

  const firstLine = "Let's Work Together";
  const secondLine = `Bravo Zulu Services exceeded my expectations with their aircraft
  detailing. The attention to detail and professionalism were
  outstanding. My jet has never looked better!`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormData
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // You could add API call to send data or other actions
    alert("Thank you! Your message has been sent. We'll get back to you soon.");
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      requirements: "",
      serviceDate: "",
      concerns: ""
    });
  };

  const Heading = ({ children, range, progress }: TextComponentProps) => {
    const opacity = useTransform(progress, range, [0, 1]);

    return (
      <motion.h3
        style={{ opacity }}
        className="lg:text-5xl text-2xl font-bold text-gray-900 mb-2"
      >
        {children}
      </motion.h3>
    );
  };

  const Para = ({ children, range, progress }: TextComponentProps) => {
    const opacity = useTransform(progress, range, [0, 1]);

    return (
      <motion.p
        style={{ opacity }}
        className="md:text-sm text-sm text-neutral-600"
      >
        {children}
      </motion.p>
    );
  };

  return (
    <div className="container mx-auto flex-col px-4 4xl:mt-32 md:px-16">
      <h2 className="md:mb-4 md:text-7xl text-4xl text-center text-black bebas-neue-regular">
        Cont<span className="stroked-text">act</span>
      </h2>
      <div className="mt-9 w-full">
        <div ref={ref} className="flex justify-between md:flex-row flex-col">
          <div className="flex justify-center gap-4">
            {firstLine.split(" ").map((ele, i, arr) => {
              const totalWords = arr.length;
              const start = i / totalWords;
              const end = start + 1 / totalWords;

              return (
                <Heading
                  key={i}
                  range={[start, end]}
                  progress={scrollYProgress}
                >
                  {ele}
                </Heading>
              );
            })}
          </div>
          <div className="flex gap-1 my-3 md:my-7 flex-wrap md:w-[450px]">
            {secondLine.split(" ").map((ele, i, arr) => {
              const totalWords = arr.length;
              const start = i / totalWords;
              const end = start + 1 / totalWords;

              return (
                <Para key={i} range={[start, end]} progress={scrollYProgress}>
                  {ele}
                </Para>
              );
            })}
          </div>
        </div>
        <div className="flex md:flex-row flex-col justify-between items-center md:items-start">
          <div className="md:mb-16 h-full md:w-[40%]">
            {/* Contact Information Grid */}
            <div className="flex md:flex-row flex-col flex-wrap items-center justify-center w-full text-white gap-4">
              {/* Email Section */}
              <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 border-white rounded-3xl h-40 md:h-52 w-full md:w-[60%] lg:w-[50%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="contactcard absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
                <div>
                  <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#FF204E] absolute icon1" />
                    <Mail className="w-6 h-6 text-white absolute icon2" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 contactText">E-mail</h3>
                  <p className="lg:text-lg text-sm text-semibold contactText">
                    service@mybravozulu.com
                  </p>
                </div>
              </div>

              {/* Phone Section */}
              <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 rounded-3xl h-40 md:h-52 w-full md:w-[60%] lg:w-[45%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
                <div>
                  <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#FF204E] icon1 absolute" />
                    <Phone className="w-6 h-6 text-white icon2 absolute" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 contactText">Contact</h3>
                  <p className="lg:text-lg text-xs text-semibold contactText">
                    559-425-8620
                  </p>
                </div>
              </div>

              {/* Office Section */}
              <div className="group contactcard flex-1 relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 rounded-3xl h-40 md:h-52 w-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
                <div>
                  <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#FF204E] icon1 absolute" />
                    <MapPin className="w-6 h-6 text-white absolute icon2" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2">Office</h3>
                  <p className="lg:text-lg text-xs text-semibold">
                    6737 N. Milburn Ave. Suite
                  </p>
                  <p className="lg:text-lg text-xs text-semibold">
                    160-100 Fresno, CA 93722
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex flex-col items-end h-full md:mt-0 mt-10">
            <div className="flex flex-col md:flex-row w-full bg-[#F7F7F7] p-6 rounded-xl">
              {/* Simplified Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm text-black mb-1 block">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(e, "name")}
                      placeholder="Tell us your name"
                      className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="text-sm text-black mb-1 block">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                        placeholder="Your email address"
                        className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="text-sm text-black mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange(e, "phone")}
                        placeholder="Your contact number"
                        className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="text-sm text-black mb-1 block">Service Requirements</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange(e, "requirements")}
                      placeholder="Tell us about your requirements"
                      className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="text-sm text-black mb-1 block">Preferred Service Date</label>
                    <input
                      type="text"
                      value={formData.serviceDate}
                      onChange={(e) => handleInputChange(e, "serviceDate")}
                      placeholder="When do you want your service to be scheduled?"
                      className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  {/* <div className="form-group">
                    <label className="text-sm text-gray-600 mb-1 block">Any Concerns?</label>
                    <input
                      type="text"
                      value={formData.concerns}
                      onChange={(e) => handleInputChange(e, "concerns")}
                      placeholder="What is your main concern about your request?"
                      className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div> */}
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#2C003E] to-black text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;