"use client";
import React, { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import "./contactUsAnimation.css";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import CustomButton2 from "@/app/utils/CustomButton2";

// Define proper types for text components
interface TextComponentProps {
  children: React.ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
  index?: number;
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
    concerns: "",
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
      ? ["start center", "center center"]
      : ["start center", "center center"],
  });

  const firstLine = "Premium Detailing Services";


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
      concerns: "",
    });
  };

  const Heading = ({ children, range, progress, index }: TextComponentProps) => {
    const opacity = useTransform(progress, range, [0, 1]);
    // Check if this word is the middle one (Detailing)
    const isMiddleWord = index === 1; // For "Premium Detailing Services", the middle word is at index 1

    return (
      <motion.h3
        style={{ opacity }}
        className={`text-3xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl font-bold mb-2 ${
          isMiddleWord 
            ? 'text-transparent bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] bg-clip-text' 
            : 'text-gray-900'
        }`}
      >
        {children}
      </motion.h3>
    );
  };

  // const Para = ({ children, range, progress }: TextComponentProps) => {
  //   const opacity = useTransform(progress, range, [0, 1]);

  //   return (
  //     <motion.p
  //       style={{ opacity }}
  //       className="md:text-sm text-sm text-neutral-600"
  //     >
  //       {children}
  //     </motion.p>
  //   );
  // };

  return (
    <section id="contact" className="container mx-auto flex-col px-4 4xl:mt-32 md:px-16">
      <h2 className="md:mb-4 md:text-7xl text-4xl text-center text-black bebas-neue-regular">
        Cont<span className="stroked-text">act</span>
      </h2>
      <div className="mt-9 w-full">
        <div
          ref={ref}
          className="flex justify-between gap-16 md:flex-row flex-col"
        >
         <div className="flex flex-wrap justify-center items-center w-full my-8 md:my-12 lg:my-16 gap-2 md:gap-4">
            {firstLine.split(" ").map((ele, i, arr) => {
              const totalWords = arr.length;
              const start = i / totalWords;
              const end = start + 1 / totalWords;

              return (
                <Heading
                  key={i}
                  range={[start, end]}
                  progress={scrollYProgress}
                  index={i}
                >
                  {ele}
                </Heading>
              );
            })}
          </div>
          
        </div>
        <div className="flex lg:flex-row flex-col justify-between items-center md:items-start">
          <div className="md:mb-16 h-full w-full lg:w-[40%]">
            {/* Contact Information Grid */}
            <div className="flex md:flex-row flex-col flex-wrap items-center justify-center w-full text-white gap-4">
              {/* Email Section */}
              <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] p-5 border-white rounded-3xl h-40 md:h-52 w-full md:w-[60%] lg:w-[50%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="contactcard absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
                <div>
                  <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#FF204E] absolute icon1" />
                    <Mail className="w-6 h-6 text-white absolute icon2" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 contactText">E-mail</h3>
                  <p className="text-xs  text-semibold contactText">
                    service@mybravozulu.com
                  </p>
                </div>
              </div>

              {/* Phone Section */}
              <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] p-5 rounded-3xl h-40 md:h-52 w-full md:w-[60%] lg:w-[45%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
                    559-690-9500
                  </p>
                </div>
              </div>

              {/* Office Section */}
              <div className="group contactcard flex-1 relative flex flex-col justify-between bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] p-5 rounded-3xl h-40 md:h-52 w-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
                <div>
                  <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#FF204E] icon1 absolute" />
                    <MapPin className="w-6 h-6 text-white absolute icon2" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 contactText">Office</h3>
                  <p className="lg:text-lg text-xs text-semibold contactText">
                    6737 N. Milburn Ave. Suite
                  </p>
                  <p className="lg:text-lg text-xs text-semibold contactText">
                    160-100 Fresno, CA 93722
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col items-end h-full md:mt-0 mt-10">
            <div className="flex flex-col md:flex-row w-full bg-[#F7F7F7] px-6 py-3 rounded-xl">
              {/* Simplified Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm text-black mb-1 block">
                      Your Name
                    </label>
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
                      <label className="text-sm text-black mb-1 block">
                        Email Address
                      </label>
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
                      <label className="text-sm text-black mb-1 block">
                        Phone Number
                      </label>
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
                    <label className="text-sm text-black mb-1 block">
                      Service Requirements
                    </label>
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
                    <label className="text-sm text-black mb-1 block">
                      Preferred Service Date
                    </label>
                    <input
                      type="text"
                      value={formData.serviceDate}
                      onChange={(e) => handleInputChange(e, "serviceDate")}
                      placeholder="When do you want your service to be scheduled?"
                      className="w-full border-b border-gray-300 pb-2 text-base bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="text-center pt-4">
                <CustomButton2 text="Send Message" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
