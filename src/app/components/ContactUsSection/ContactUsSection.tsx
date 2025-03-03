"use client";
import React, { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import mapImage from "../../../../public/images/mapImage.png";
import "./contactUsAnimation.css";
import CustomButton from "@/app/utils/CustomButton";
import { useScroll, useTransform, motion } from "framer-motion";

const ContactUs = () => {
  const messageFormRef = useRef<HTMLDivElement>(null);
  const scrollToMessageForm = () => {
    messageFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  interface Question {
    id: string;
    label: string;
    field: keyof FormData;
  }

  interface FormData {
    nameAndEnquiry: string;
    mobileAndRequirements: string;
    projectDetails: string;
    budget: string;
    timeline: string;
  }

  const questions: Question[] = [
    {
      id: "01",
      label: "Tell us your name and what you are enquiring about today.",
      field: "nameAndEnquiry",
    },
    {
      id: "02",
      label:
        "Tell us your contact number and email?",
      field: "mobileAndRequirements",
    },
    {
      id: "03",
      label: "Tell us more about your  requirements.",
      field: "projectDetails",
    },
    {
      id: "04",
      label: "When do you want your service to be scheduled?",
      field: "budget",
    },
    {
      id: "05",
      label: "What is your main concern about your request?",
      field: "timeline",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    nameAndEnquiry: "",
    mobileAndRequirements: "",
    projectDetails: "",
    budget: "",
    timeline: "",
  });

  const ref = useRef(null);

  // Get window width for responsive behavior
  const [deviceWidth, setDeviceWidth] = useState(false);
  
  // Update device width on client-side only
  useEffect(() => {
    setDeviceWidth(window.innerWidth < 756);
    
    const handleResize = () => {
      setDeviceWidth(window.innerWidth < 756);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: deviceWidth
      ? ["start center", "start start"]
      : ["start center", "center center"],
  });

  const firstLine = "Let's Work Together";
  const secondLine = `Bravo Zulu Services exceeded my expectations with their aircraft
  detailing. The attention to detail and professionalism were
  outstanding. My jet has never looked better!`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleNext = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const isActive = index === currentQuestion;
    const isNext = index === currentQuestion + 1;
    const isPrevious = index === currentQuestion - 1;

    return (
      <div
        key={question.id}
        className={`absolute w-full transition-all duration-500 ease-in-out ${
          isActive
            ? "translate-y-0 opacity-100 visible"
            : isNext
            ? "translate-y-32 opacity-70 visible pointer-events-none"
            : isPrevious
            ? "-translate-y-32 opacity-0 invisible"
            : "translate-y-32 opacity-0 invisible"
        }`}
      >
        <div className="flex items-center gap-4 my-6">
          <span className="w-10 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500">
            {question.id}
          </span>
          <span className="text-gray-500 text-sm">{index + 1}/5</span>
        </div>

        <input
          type="text"
          placeholder={question.label}
          value={formData[question.field]}
          onChange={(e) => handleInputChange(e, question.field)}
          disabled={!isActive}
          className={`w-full border-b pb-2 text-lg transition-colors bg-transparent ${
            isActive
              ? "border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              : "border-gray-200 placeholder-gray-300"
          }`}
          autoFocus={isActive}
        />
      </div>
    );
  };

  const Heading = ({ children, range, progress }: any) => {
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

  const Para = ({ children, range, progress }: any) => {
    const opacity = useTransform(progress, range, [0, 1]);

    return (
      <motion.p
        style={{ opacity }}
        className="md:text-lg text-sm  text-neutral-600"
      >
        {children}
      </motion.p>
    );
  };

  return (
    <div ref={ref} className="container px-4 md:px-16">
      <div className="mx-auto md:mb-16 h-full">
        <h2 className="md:mb-4 md:text-[100px] lg:text-[250px] text-6xl  text-center  text-black bebas-neue-regular">
          Cont<span className="stroked-text">act</span>
        </h2>

        <div className="flex md:flex-row md:gap-9 flex-col items-center justify-between mt-6 md:mt-20">
          <div className="md:w-1/2 md:max-w-xl ">
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

            <div className="flex gap-1 my-3 md:my-7 flex-wrap">
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

            <motion.button
              style={{ opacity: scrollYProgress }}
              className="my-4"
              onClick={scrollToMessageForm}
            >
              <CustomButton text="Send Message" />
            </motion.button>
          </div>

          {/* Contact Information Grid */}
          <div className="flex flex-wrap justify-center items-center w-full text-white gap-4">
            {/* Email Section */}
            <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 lg:p-8 border-dashed border-b md:border-r border-white rounded-3xl h-52 md:h-40 lg:h-64 w-full md:w-[60%] lg:w-[48%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
            <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 lg:p-8 rounded-3xl border-dashed border-l h-52 md:h-40 lg:h-64 w-full md:w-[60%] lg:w-[48%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
              <div>
                <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#FF204E] icon1 absolute" />
                  <Phone className="w-6 h-6 text-white icon2 absolute" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 contactText">Contact</h3>
                <p className="lg:text-lg text-sm text-semibold contactText">
                  559-425-8620
                </p>
              </div>
            </div>

            {/* Office Section */}
            <div className="group contactcard relative flex flex-col justify-between bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 lg:p-8 rounded-3xl border-dashed border-t border-r h-52 md:h-40 lg:h-64 w-full md:w-[60%] lg:w-[48%] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
              <div>
                <div className="w-12 h-12 relative rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#FF204E] icon1  absolute" />
                  <MapPin className="w-6 h-6 text-white absolute icon2" />
                </div>
              </div>
              <div>
                <h3 className="mb-2">Office</h3>
                <p className="lg:text-lg text-sm text-semibold">
                  6737 N. Milburn Ave. Suite
                </p>
                <p className="lg:text-lg text-sm text-semibold">
                  160-100 Fresno, CA 93722
                </p>
              </div>
            </div>

            {/* Map Section */}
            <div className="group relative bg-gradient-to-br from-[#2C003E] to-[#000000] p-5 lg:p-8 rounded-3xl border-dashed border-t border-l h-52  md:h-40 lg:h-64 w-full md:w-[60%] lg:w-[48%] cursor-pointer transition-all duration-300">
              <div className="absolute inset-0 bg-white opacity-10 rounded-3xl transition-opacity duration-300 group-hover:opacity-20"></div>
              <div className="flex items-start">
                {/* Map Image (Uncomment if needed)
      <Image src={mapImage} alt="Location Map" fill className="w-full object-cover rounded-lg" />
      */}
              </div>
            </div>
          </div>
        </div>
        {/* Header Section */}
      </div>
      <hr />
      <div
        ref={messageFormRef}
        className="mx-auto py-16 flex flex-col md:flex-row gap-12 md:mt-10 w-full"
      >
        {/* Left Section */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-5xl font-bold mb-4 text-black">
            Send us a
            <span className="block text-gray-400 font-normal">message</span>
          </h1>

          <p className="text-gray-500 mt-6 italic leading-relaxed lg:w-1/2">
            "Bravo Zulu Services exceeded my expectations with their aircraft
            detailing. The attention to detail and professionalism were
            outstanding. My jet has never looked better!"
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative h-[300px]">
            {questions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-full border border-gray-300 text-sm transition-colors duration-200 ${
                currentQuestion === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className={`px-6 py-2 rounded-full border border-gray-300 text-sm transition-colors duration-200 ${
                currentQuestion === questions.length - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;