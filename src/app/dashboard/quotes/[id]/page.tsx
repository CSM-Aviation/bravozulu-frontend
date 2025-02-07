'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, QuoteData, QuoteUpdateData, Service } from '../../../APIServices/apiService';
import { PlusCircle, Send, Loader2, ChevronDown } from 'lucide-react';
import WorkOrderSection from '../../WorkOrder/WorkOrderSection';
import PricingBreakdown from '../../../components/PricingBreakdown';
import PDFViewer from '@/app/components/PDFViewer';
import { useUser } from '@/app/contexts/UserContext';

const serviceOptions = {
  exterior: [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'wetWash', label: 'Wet Wash' },
    { value: 'dryWash', label: 'Dry Wash' },
    { value: 'waxing', label: 'Waxing/Buffing' },
    { value: 'brightwork', label: 'Brightwork Polishing' },
    { value: 'boots', label: 'Boots' },
    { value: 'gearWells', label: 'Gear Wells' }
  ],
  interior: [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'basicPlus', label: 'Basic +' },
    { value: 'complete', label: 'Complete' },
    { value: 'carpetExtraction', label: 'Carpet Extraction' },
    { value: 'leatherReconditioning', label: 'Leather Reconditioning' },
    { value: 'stainRemoval', label: 'Stain Removal' }
  ]
};


export default function QuoteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [notes, setNotes] = useState('');
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(true);
  const [isWorkOrderExpanded, setIsWorkOrderExpanded] = useState(false);
  const { user } = useUser();

  const fetchQuote = useCallback(async () => {
    try {
      const response = await apiService.getQuoteById(params.id as string);
      if (response.error) {
        router.push('/dashboard');
        throw new Error(response.error);
      }
      if (response.data) {
        setQuote(response.data);
        if (response.data.serviceDetails?.services) {
          setServices(response.data.serviceDetails.services);
        }
        if (response.data.notes) {
          setNotes(response.data.notes);
        }
        setIsWorkOrderExpanded(response.data.status === 'Approved' || response.data.status === 'Completed');
        setIsQuoteExpanded(response.data.status !== 'Approved' && response.data.status !== 'Completed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handleServiceChange = (index: number, field: keyof Service, value: string | number) => {
    const updatedServices = [...services];
    if (field === 'type') {
      const type = value as 'interior' | 'exterior';
      const serviceOption = serviceOptions[type][0];
      updatedServices[index] = {
        ...updatedServices[index],
        type,
        name: serviceOption.value,
        displayName: serviceOption.label,
        price: 0
      };
    } else if (field === 'name') {
      const type = updatedServices[index].type;
      const serviceOption = serviceOptions[type].find(opt => opt.value === value);
      if (serviceOption) {
        updatedServices[index] = {
          ...updatedServices[index],
          name: serviceOption.value,
          displayName: serviceOption.label
        };
      }
    } else if (field === 'price') {
      updatedServices[index] = {
        ...updatedServices[index],
        price: typeof value === 'number' ? value : parseFloat(value) || 0
      };
    }
    setServices(updatedServices);
  };

  const addService = () => {
    const newService: Service = {
      type: 'exterior',
      name: serviceOptions.exterior[0].value,
      displayName: serviceOptions.exterior[0].label,
      price: 0,
      status: 'pending'
    };
    setServices([...services, newService]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!quote) return;

    if (services.some(service => !service.name || !service.price || service.price <= 0)) {
      setError('Please fill in all service details with valid prices');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const quoteData: QuoteUpdateData = {
        services: services,
        notes: notes,
        specialRequests: quote.serviceDetails.specialRequests || '',
        approvedUser: user ?? undefined
      };
      const response = await apiService.generateQuote(quote._id as string, quoteData);

      if (response.error) {
        throw new Error(response.error);
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate and send quote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Quote not found</div>
      </div>
    );
  }

  const total = services.reduce((sum, service) => sum + (service.price || 0), 0);



  return (
    <div className="min-h-screen text-black bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Quote Review Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
            className="w-full flex justify-between items-center mb-4"
          >
            <h1 className="text-2xl font-bold">Quote Review</h1>
            <ChevronDown
              className={`w-6 h-6 transform transition-transform ${isQuoteExpanded ? 'rotate-180' : ''
                }`}
            />
          </button>
          {isQuoteExpanded && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500">
                  Quote ID: {quote.quoteId}
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <div className="mt-1 font-medium">{quote.firstName} {quote.lastName}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <div className="mt-1 font-medium">{quote.email}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <div className="mt-1 font-medium">{quote.phoneNumber}</div>
                  </div>
                  {quote.companyName && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-600">Company</label>
                      <div className="mt-1 font-medium">{quote.companyName}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
                    <div className="mt-1 font-medium">{quote.vehicleType}</div>
                  </div>

                  {quote.vehicleType === 'Aircraft' && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Registration Number</label>
                        <div className="mt-1 font-medium">{quote.registrationNumber}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Service Type</label>
                        <div className="mt-1 font-medium">{quote.serviceType}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Location</label>
                        <div className="mt-1 font-medium">{quote.serviceLocation}</div>
                      </div>
                    </>
                  )}

                  {quote.vehicleType === 'Automobile' && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Year</label>
                        <div className="mt-1 font-medium">{quote.year}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Make</label>
                        <div className="mt-1 font-medium">{quote.make}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Model</label>
                        <div className="mt-1 font-medium">{quote.model}</div>
                      </div>
                    </>
                  )}

                  {quote.vehicleType === 'Vessel' && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Boat Number</label>
                        <div className="mt-1 font-medium">{quote.boatNumber}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Vessel Type</label>
                        <div className="mt-1 font-medium">{quote.vesselType}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600">Length</label>
                        <div className="mt-1 font-medium">{quote.length} ft</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Services Section */}
              {quote.status === 'Need Response' && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Services & Pricing</h2>
                    <button
                      type="button"
                      onClick={addService}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <PlusCircle className="w-5 h-5 mr-1" />
                      Add Service
                    </button>
                  </div>

                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <select
                          value={service.type}
                          onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="exterior">Exterior</option>
                          <option value="interior">Interior</option>
                        </select>

                        <select
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {serviceOptions[service.type].map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Price"
                          value={service.price || ''}
                          onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                          className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right">
                    <div className="text-lg font-semibold">
                      Total: ${total.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* View Only Services List */}
              {/* {quote.status !== 'Need Response' && quote.serviceDetails?.services && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Services</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {quote.serviceDetails.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{service.displayName} ({service.type})</span>
                          {service.price && (
                            <span className="font-medium">${service.price.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {quote.serviceDetails.totalPrice && (
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">
                          ${quote.serviceDetails.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )} */}

              {/* Pricing Breakdown */}
              {quote.status !== 'Need Response' && quote.serviceDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <PricingBreakdown serviceDetails={quote.serviceDetails} />
                  {quote.pdfUrl && (
                    <div className="mt-6">
                      <PDFViewer
                        quoteId={quote._id}
                        pdfUrl={quote.pdfUrl}
                        title="View Quote PDF"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={quote.status !== 'Need Response'}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  placeholder="Add any additional notes or special instructions..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                {(quote.status === 'Approved' || quote.status === 'Completed') && (
                  <div className="mr-auto text-sm text-gray-600">
                    Approved by: {quote.approvedUser?.firstName} on{' '}
                    {new Date(quote.updatedAt!).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    {new Date(quote.updatedAt!).getDate() >= 1 && new Date(quote.updatedAt!).getDate() <= 31 && ['st', 'nd', 'rd', 'th'][
                      (new Date(quote.updatedAt!).getDate() % 10 > 3) ? 3 : new Date(quote.updatedAt!).getDate() % 10 - 1
                    ]}, {new Date(quote.updatedAt!).getFullYear()} at{' '}
                    {new Date(quote.updatedAt!).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                {quote.status === 'Need Response' && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Quote...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Quote
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Work Order Section */}
        {(quote.status === 'Approved' || quote.status === 'Completed') && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => setIsWorkOrderExpanded(!isWorkOrderExpanded)}
              className="w-full flex justify-between items-center mb-4"
            >
              <h1 className="text-2xl font-bold">Work Order</h1>
              <ChevronDown
                className={`w-6 h-6 transform transition-transform ${isWorkOrderExpanded ? 'rotate-180' : ''
                  }`}
              />
            </button>
            {isWorkOrderExpanded && quote._id && (
              <WorkOrderSection
                quoteId={quote._id}
                status={quote.status}
                quoteData={quote}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}