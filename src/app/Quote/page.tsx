'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { apiService, QuoteData, ServiceItem } from '../APIServices/apiService';
import RegistrationDropdown from '../components/RegistrationDropdown';
import ServiceSelectionSection from '../components/ServiceSelectionSection';
import { Loader2 } from 'lucide-react';

const inputClasses =
  "w-full border-b border-bz-silver pb-2 font-body text-base text-bz-jet bg-transparent focus:outline-none focus:border-bz-electric transition-colors";
const labelClasses =
  "mb-1 block font-mono text-xs font-medium uppercase tracking-[0.14em] text-bz-slate";

const Quote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    vehicleType: 'Automobile',
    registrationNumber: '',
    serviceType: '',
    serviceLocation: 'Onsite - Drop Off',
    serviceAddress: '',
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
      serviceAddress:
        formData.serviceLocation === 'Mobile Service'
          ? formData.serviceAddress
          : undefined,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bz-mist py-12">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="text-green-500 mb-8">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-extrabold mb-4 text-bz-jet">Thank you!</h1>
          <p className="font-body text-xl text-bz-slate mb-8">
            Your quote request has been sent. We will get in touch with you shortly after reviewing your servicing details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bz-mist py-12">
    <div className="max-w-6xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-lg space-y-12">
      <h1 className="font-display text-2xl mt-10 font-extrabold text-center mb-12 text-bz-jet tracking-[-0.025em] md:text-3xl lg:text-4xl">
        QUOTE REQUEST
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Customer Information Section */}
        <div
          ref={formRefs.customerInfo}
          className="transform transition-all duration-700 opacity-0 translate-y-10"
        >
          <h2 className="font-display md:text-3xl text-xl font-bold mb-8 text-bz-jet tracking-[-0.02em]">
            Customer Information
          </h2>
          <div className="space-y-8 form-group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClasses}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClasses}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information Section */}
        <div
          ref={formRefs.vehicleInfo}
          className="transform transition-all duration-700 opacity-0 translate-y-10"
        >
          <h2 className="font-display md:text-3xl text-xl font-bold mb-8 text-bz-jet tracking-[-0.02em]">
            Vehicle Information
          </h2>
          <div className="space-y-8">
            <div>
              <label className={labelClasses}>Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={inputClasses}
              >
                <option value="Automobile">Automobile</option>
                <option value="Aircraft">Aircraft</option>
                <option value="RV/Trailer">RV/Trailer</option>
                <option value="Vessel">Vessel</option>
              </select>
            </div>

            {formData.vehicleType === "Aircraft" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>
                      Registration Number *
                    </label>
                    <RegistrationDropdown
                      value={formData.registrationNumber || ""}
                      onChange={(value, isInFleet) => {
                        if (value === "other") {
                          setFormData((prev) => ({
                            ...prev,
                            registrationNumber: "",
                            isInFleet: false,
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            registrationNumber: value,
                            isInFleet,
                          }));
                        }
                      }}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      Services Requested *
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
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

            {(formData.vehicleType === "Automobile" ||
              formData.vehicleType === "RV/Trailer") && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <label className={labelClasses}>Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year ?? ""}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Make *</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                    />
                  </div>
                  {formData.vehicleType === "RV/Trailer" && (
                    <div>
                      <label className={labelClasses}>Length (ft)</label>
                      <input
                        type="number"
                        name="length"
                        value={formData.length ?? ""}
                        onChange={handleInputChange}
                        className={inputClasses}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.vehicleType === "Vessel" && (
              <div className="space-y-8">
                <div>
                  <label className={labelClasses}>
                    Boat Number *
                  </label>
                  <input
                    type="text"
                    name="boatNumber"
                    value={formData.boatNumber}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Vessel Type *
                  </label>
                  <input
                    type="text"
                    name="vesselType"
                    value={formData.vesselType}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Yacht, Speedboat, etc."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Length (ft) *
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length ?? ""}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Selection Section */}
        {formData.vehicleType === "Aircraft" && (
          <ServiceSelectionSection
            vehicleType={formData.vehicleType}
            selectedExterior={selectedExterior}
            selectedInterior={selectedInterior}
            onExteriorChange={setSelectedExterior}
            onInteriorChange={setSelectedInterior}
            serviceType={formData.serviceType}
          />
        )}
        <div>
          <label className={labelClasses}>Service Location</label>
          <select
            name="serviceLocation"
            value={formData.serviceLocation}
            onChange={handleInputChange}
            className={inputClasses}
          >
            <option value="Onsite - Drop Off">Onsite - Drop Off</option>
            <option value="Mobile Service">Mobile Service</option>
          </select>
        </div>

        {formData.serviceLocation === "Mobile Service" && (
          <div>
            <label className={labelClasses}>Service Address *</label>
            <input
              type="text"
              name="serviceAddress"
              value={formData.serviceAddress}
              onChange={handleInputChange}
              required
              placeholder="Street, City, ZIP — where should we come to you?"
              className={inputClasses}
            />
          </div>
        )}

        {/* Special Requests */}
        <div>
          <label className={labelClasses}>Special Requests</label>
          <textarea
            name="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={4}
            className="w-full p-4 font-body text-lg text-bz-jet border border-bz-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-bz-electric"
            placeholder="Any special requirements or additional information..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-bz-electric font-display font-bold text-white rounded-lg transition-colors duration-300 hover:bg-bz-current disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Submitting...
            </>
          ) : (
            "Submit Quote Request"
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </form>
    </div>
  </div>
  );
};

export default Quote;
