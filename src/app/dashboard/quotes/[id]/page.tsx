'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, QuoteData } from '../../../APIServices/apiService';
import { PlusCircle, MinusCircle, Send, Loader2, FileText } from 'lucide-react';

interface Service {
  description: string;
  price: number;
}

export default function QuoteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState<Service[]>([{ description: '', price: 0 }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await apiService.getQuoteById(params.id as string);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setQuote(response.data);
        if (response.data.services) {
          setServices(response.data.services);
        }
        if (response.data.notes) {
          setNotes(response.data.notes);
        }
      }
    } catch (err) {
      setError('Failed to fetch quote details');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...services];
    if (field === 'price') {
      updatedServices[index][field] = parseFloat(value) || 0;
    } else {
      updatedServices[index][field] = value;
    }
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { description: '', price: 0 }]);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleSubmit = async () => {
    if (!quote) return;

    // Validate services
    if (services.some(service => !service.description || service.price <= 0)) {
      setError('Please fill in all service details with valid prices');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await apiService.generateQuote(quote._id as string, {
        services,
        notes
      });

      if (response.error) {
        throw new Error(response.error);
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Failed to generate and send quote');
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

  const total = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="min-h-screen text-black bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quote Review</h1>
            <div className="text-sm text-gray-500">
              Quote ID: {quote.quoteId}
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <div className="mt-1">{quote.firstName} {quote.lastName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <div className="mt-1">{quote.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <div className="mt-1">{quote.phoneNumber}</div>
              </div>
              {quote.companyName && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Company</label>
                  <div className="mt-1">{quote.companyName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
                <div className="mt-1">{quote.vehicleType}</div>
              </div>
              
              {quote.vehicleType === 'Aircraft' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Registration Number</label>
                    <div className="mt-1">{quote.registrationNumber}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Service Type</label>
                    <div className="mt-1">{quote.serviceType}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Location</label>
                    <div className="mt-1">{quote.serviceLocation}</div>
                  </div>
                </>
              )}

              {quote.vehicleType === 'Automobile' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Year</label>
                    <div className="mt-1">{quote.year}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Make</label>
                    <div className="mt-1">{quote.make}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Model</label>
                    <div className="mt-1">{quote.model}</div>
                  </div>
                </>
              )}

              {quote.vehicleType === 'Vessel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Boat Number</label>
                    <div className="mt-1">{quote.boatNumber}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Vessel Type</label>
                    <div className="mt-1">{quote.vesselType}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Length</label>
                    <div className="mt-1">{quote.length} ft</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Services */}
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
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Service description"
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Price"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <div className="text-lg font-semibold">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || quote.status !== 'Need Response'}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          </div>

          {quote.status !== 'Need Response' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-gray-600 text-sm">
              This quote has already been {quote.status.toLowerCase()}. No further changes can be made.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}