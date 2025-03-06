'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { apiService, QuoteData, ServiceItem } from '../APIServices/apiService';
import RegistrationDropdown from '../components/RegistrationDropdown';
import ServiceSelectionSection from '../components/ServiceSelectionSection';
import { Loader2 } from 'lucide-react';

// import { useRouter } from 'next/navigation';

const Quote = () => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [vehicleType, setVehicleType] = useState<'Aircraft' | 'Automobile' | 'Vessel'>('Aircraft');
  const [selectedExterior, setSelectedExterior] = useState<string[]>([]);
  const [selectedInterior, setSelectedInterior] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [formData, setFormData] = useState<QuoteData>({
    status: 'Need Response',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    vehicleType: 'Aircraft',
    registrationNumber: '',
    serviceType: '',
    serviceLocation: 'FAT',
    year: undefined,
    make: '',
    model: '',
    boatNumber: '',
    vesselType: '',
    length: undefined,
    isInFleet: false,
    createdAt: '',
    serviceDetails: {
      services: []
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Transform selected services into ServiceItem array
    const transformedServices: ServiceItem[] = [
      // Transform exterior services
      ...selectedExterior.map(service => ({
        type: 'exterior' as const,
        name: service,
        displayName: getDisplayName(service),
        status: 'pending' as const
      })),
      // Transform interior services
      ...selectedInterior.map(service => ({
        type: 'interior' as const,
        name: service,
        displayName: getDisplayName(service),
        status: 'pending' as const
      }))
    ];

    const quoteData: Partial<QuoteData> = {
      ...formData,
      serviceDetails: {
        services: transformedServices,
        specialRequests: specialRequests || undefined
      }
    };

    setLoading(true);
    try {
      const response = await apiService.submitQuote(quoteData);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (serviceName: string): string => {
    const displayNames: Record<string, string> = {
      tripReady: 'Trip Ready',
      basic: 'Basic',
      basicPlus: 'Basic Plus',
      complete: 'Complete',
      wetWash: 'Wet Wash',
      dryWash: 'Dry Wash',
      waxing: 'Waxing/Buffing',
      brightwork: 'Brightwork Polishing',
      boots: 'Boot Treatment',
      gearWells: 'Gear Wells',
      carpetExtraction: 'Carpet Extraction',
      leatherReconditioning: 'Leather Reconditioning',
      stainRemoval: 'Stain Removal'
    };

    return displayNames[serviceName] || serviceName;
  };


  const formRefs = {
    customerInfo: useRef(null),
    vehicleInfo: useRef(null)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(formRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [formRefs]);

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="text-green-500 mb-8">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Thank you!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your quote request has been sent. We will get in touch with you shortly after reviewing your servicing details.
          </p>
          {/* <button
            onClick={resetForm}
            className="bg-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200"
          >
            Submit New Quote
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto p-12 bg-white rounded-xl shadow-lg space-y-12">
        <h1 className="text-2xl font-bold text-center mb-12 text-gray-800 tracking-tight md:text-5xl">
          QUOTE REQUEST
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Customer Information Section */}
          <div ref={formRefs.customerInfo} className="transform transition-all duration-700 opacity-0 translate-y-10">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">Customer Information</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl text-gray-800 font-semibold mb-3">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xl text-gray-800 font-semibold mb-3">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl text-gray-800 font-semibold mb-3">Company Name (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl text-gray-800 font-semibold mb-3">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xl text-gray-800 font-semibold mb-3">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div ref={formRefs.vehicleInfo} className="transform transition-all duration-700 opacity-0 translate-y-10">
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">Vehicle Information</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xl text-gray-800 font-semibold mb-3">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as 'Aircraft' | 'Automobile' | 'Vessel')}
                  className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aircraft">Aircraft</option>
                  <option value="Automobile">Automobile</option>
                  <option value="Vessel">Vessel</option>
                </select>
              </div>

              {vehicleType === 'Aircraft' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xl text-gray-800 font-semibold mb-3">Registration Number *</label>
                      <RegistrationDropdown
                        value={formData.registrationNumber || ''}
                        onChange={(value, isInFleet) => {
                          if (value === 'other') {
                            setFormData(prev => ({
                              ...prev,
                              registrationNumber: '',
                              isInFleet: false
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              registrationNumber: value,
                              isInFleet
                            }));
                          }
                        }}
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.registrationNumber === 'other' && (
                        <input
                          type="text"
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleInputChange}
                          placeholder="Enter Registration Number"
                          required
                          className="mt-2 w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xl text-gray-800 font-semibold mb-3">Services Requested *</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a service</option>
                        <option value="exterior">Exterior Detailing</option>
                        <option value="interior">Interior Detailing</option>
                        <option value="both">Both Interior & Exterior</option>
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {vehicleType === 'Automobile' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-xl text-gray-800 font-semibold mb-3">Year *</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xl text-gray-800 font-semibold mb-3">Make *</label>
                      <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xl text-gray-800 font-semibold mb-3">Model *</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {vehicleType === 'Vessel' && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-xl text-gray-800 font-semibold mb-3">Boat Number *</label>
                    <input
                      type="text"
                      name="boatNumber"
                      value={formData.boatNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-gray-800 font-semibold mb-3">Vessel Type *</label>
                    <input
                      type="text"
                      name="vesselType"
                      value={formData.vesselType}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Yacht, Speedboat, etc."
                      className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xl text-gray-800 font-semibold mb-3">Length (ft) *</label>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Selection Section */}
          {vehicleType === 'Aircraft' && (
            <ServiceSelectionSection
              // className="space-y-8"
              vehicleType={vehicleType}
              selectedExterior={selectedExterior}
              selectedInterior={selectedInterior}
              onExteriorChange={setSelectedExterior}
              onInteriorChange={setSelectedInterior}
              serviceType={formData.serviceType}
            />
          )}
          <div>
            <label className="block text-xl text-gray-800 font-semibold mb-3">Service Location</label>
            <select
              name="serviceLocation"
              value={formData.serviceLocation}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="FAT">FAT</option>
              <option value="MJC">MJC</option>
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xl text-gray-800 font-semibold mb-3">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requirements or additional information..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-5 px-8 rounded-xl text-xl font-semibold hover:bg-blue-600"
          >
            {loading ?
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                Submitting...
              </>

              : 'Submit Quote Request'}
          </button>

          {error && (
            <div className="text-red-500 text-center mt-4">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Quote;