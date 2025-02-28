'use client'
import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    const messageFormRef = useRef<HTMLDivElement>(null);
    const scrollToMessageForm = () => {
        messageFormRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            id: '01',
            label: 'Tell us your name and what you are enquiring about today.',
            field: 'nameAndEnquiry'
        },
        {
            id: '02',
            label: 'Tell us about your reason of inquiry?',
            field: 'mobileAndRequirements'
        },
        {
            id: '03',
            label: 'Tell us more about your location.',
            field: 'projectDetails'
        },
        {
            id: '04',
            label: 'What is your contact number and details?',
            field: 'budget'
        },
        {
            id: '05',
            label: 'What is your expected timeline for this project?',
            field: 'timeline'
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>({
        nameAndEnquiry: '',
        mobileAndRequirements: '',
        projectDetails: '',
        budget: '',
        timeline: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData): void => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleNext = (): void => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = (): void => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
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
                ? 'translate-y-0 opacity-100 visible'
                : isNext
                  ? 'translate-y-32 opacity-70 visible pointer-events-none'
                  : isPrevious
                    ? '-translate-y-32 opacity-0 invisible'
                    : 'translate-y-32 opacity-0 invisible'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
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
                  ? 'border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500'
                  : 'border-gray-200 placeholder-gray-300'
              }`}
              autoFocus={isActive}
            />
          </div>
        );
      };
      
    return (
        <div className='container px-16'>
            <div className="mx-auto mb-16 h-full">
                <h2 className="text-center text-3xl font-bold mb-12 text-gray-900 underline">Contact Us</h2>

                <div className="flex justify-between">


                    <div className="w-full max-w-xl">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Let's Work
                            <span className="block text-gray-400">Together</span>
                        </h1>

                        <p className="text-gray-500 max-w-md mt-6 mb-8 italic">
                            "Bravo Zulu Services exceeded my expectations with their aircraft detailing. The attention to detail and professionalism were outstanding. My jet has never looked better!"
                        </p>

                        <button onClick={scrollToMessageForm} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-200">
                            Send Message
                        </button>
                    </div>

                    {/* Contact Information Grid */}
                    <div className=" grid md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">

                        {/* Email Section */}
                        <div className="flex flex-col justify-between row bg-gray-50 p-8 rounded-lg h-64 w-full">
                            <div className="group m-0">
                                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                                    <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
                                </div>
                            </div>
                            <div className="">
                                <h3 className="text-gray-600 mb-2">E-mail</h3>
                                <p className="text-gray-900 text-lg text-semibold">service@mybravozulu.com</p>
                            </div>
                        </div>

                        {/* Phone Section */}
                        <div className=" flex flex-col justify-between row bg-gray-50 p-8 rounded-lg  h-64 w-full">
                            <div className="group">
                                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                                    <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
                                </div>
                            </div>
                            <div className=" ">
                                <h3 className="text-gray-600 mb-2">Contact</h3>
                                <p className="text-gray-900 text-lg text-semibold">559-425-8620</p>
                            </div>
                        </div>

                        {/* Office Section */}
                        <div className="flex flex-col justify-between row bg-gray-50 p-8 rounded-lg  h-64 w-full">
                            <div className="group">
                                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                                    <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
                                </div>
                            </div>
                            <div className="">
                                <h3 className="text-gray-600 mb-2">Office</h3>
                                <p className="text-gray-900 text-lg text-semibold">6737 N.Milburn Ave. Suite</p>
                                <p className="text-gray-900 text-lg text-semibold">160-100 Fresno, CA 93722</p>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-gray-50 p-8 rounded-lg  h-64 w-full">
                            <div className="flex items-start">
                                <img
                                    src="/api/placeholder/800/300"
                                    alt="Location Map"
                                    className="w-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Header Section */}

            </div>
            <hr />
            <div ref={messageFormRef}  className="mx-auto py-16 flex flex-col md:flex-row gap-12 mt-10 w-full">
                {/* Left Section */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-5xl font-bold mb-4 text-black">
                        Send us a
                        <span className="block text-gray-400 font-normal">message</span>
                    </h1>

                    <p className="text-gray-500 mt-6 italic leading-relaxed w-1/2">
                        "Bravo Zulu Services exceeded my expectations with their aircraft detailing.
                        The attention to detail and professionalism were outstanding.
                        My jet has never looked better!"
                    </p>
                </div>

                {/* Right Section - Form */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative h-[300px]">
                    {questions.map((question, index) => renderQuestion(question, index))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className={`px-6 py-2 rounded-full border border-gray-300 text-sm transition-colors duration-200 ${currentQuestion === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Previous
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentQuestion === questions.length - 1}
                            className={`px-6 py-2 rounded-full border border-gray-300 text-sm transition-colors duration-200 ${currentQuestion === questions.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-50'
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