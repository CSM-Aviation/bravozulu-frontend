"use client";
import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "center center"],
  });

  const firstLine = "Premium Mobile Detailing Services";


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
    // Accent word: "Mobile" in "Premium Mobile Detailing Services"
    const isAccentWord = index === 1;

    return (
      <motion.h3
        style={{ opacity }}
        className={`font-display text-3xl font-extrabold tracking-[-0.025em] md:text-4xl mb-2 ${
          isAccentWord ? "text-bz-electric" : "text-bz-jet"
        }`}
      >
        {children}
      </motion.h3>
    );
  };

  const inputClasses =
    "w-full border-b border-bz-silver pb-2 font-body text-base text-bz-jet placeholder:text-bz-slate/60 bg-transparent focus:outline-none focus:border-bz-electric transition-colors";
  const labelClasses =
    "mb-1 block font-mono text-xs font-medium uppercase tracking-[0.14em] text-bz-slate";

  return (
    <section id="contact" className="container mx-auto flex-col px-4 md:px-16">
      <div className="flex flex-col items-center">
        <span className="font-mono text-4xl font-medium uppercase tracking-[0.08em] text-bz-electric md:text-5xl">
          Contact
        </span>
      </div>
      <div className="mt-2 w-full">
        <div
          ref={ref}
          className="flex justify-between gap-16 md:flex-row flex-col"
        >
         <div className="flex flex-wrap justify-center items-center w-full my-8 md:my-10 gap-2 md:gap-3">
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
            <div className="grid grid-cols-1 gap-4 w-full">
              {/* Email Section */}
              <div className="flex items-start gap-4 rounded-xl border border-bz-silver/40 bg-bz-mist p-5 transition-shadow duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bz-glaze">
                  <Mail className="h-5 w-5 text-bz-electric" />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-lg font-bold text-bz-jet">
                    E-mail
                  </h3>
                  <a
                    href="mailto:services@mybravozulu.com"
                    className="font-body text-sm text-bz-current transition-colors hover:text-bz-electric"
                  >
                    services@mybravozulu.com
                  </a>
                </div>
              </div>

              {/* Phone Section */}
              <div className="flex items-start gap-4 rounded-xl border border-bz-silver/40 bg-bz-mist p-5 transition-shadow duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bz-glaze">
                  <Phone className="h-5 w-5 text-bz-electric" />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-lg font-bold text-bz-jet">
                    Contact
                  </h3>
                  <a
                    href="tel:559-690-9500"
                    className="font-body text-sm text-bz-current transition-colors hover:text-bz-electric"
                  >
                    559-690-9500
                  </a>
                </div>
              </div>

              {/* Office Section */}
              <div className="flex items-start gap-4 rounded-xl border border-bz-silver/40 bg-bz-mist p-5 transition-shadow duration-300 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bz-glaze">
                  <MapPin className="h-5 w-5 text-bz-electric" />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-lg font-bold text-bz-jet">
                    Office &amp; Onsite Detail Garage
                  </h3>
                  <p className="font-body text-sm text-bz-slate">
                    2665 N. Air Fresno Dr, Suite 110
                  </p>
                  <p className="font-body text-sm text-bz-slate">
                    Fresno, CA 93727
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col items-end h-full md:mt-0 mt-10">
            <div className="flex flex-col md:flex-row w-full bg-bz-mist p-6 md:p-8 rounded-xl">
              {/* Simplified Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className={labelClasses}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(e, "name")}
                      placeholder="Tell us your name"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className={labelClasses}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                        placeholder="Your email address"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className={labelClasses}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange(e, "phone")}
                        placeholder="Your contact number"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className={labelClasses}>
                      Service Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange(e, "requirements")}
                      placeholder="Tell us about your requirements"
                      className={inputClasses}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className={labelClasses}>
                      Preferred Service Date
                    </label>
                    <input
                      type="text"
                      value={formData.serviceDate}
                      onChange={(e) => handleInputChange(e, "serviceDate")}
                      placeholder="When do you want your service to be scheduled?"
                      className={inputClasses}
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
