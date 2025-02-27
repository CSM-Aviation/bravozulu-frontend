'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, QuoteData, QuoteUpdateData, Service } from '../../../APIServices/apiService';
import {
  PlusCircle,
  Send,
  Loader2,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Car,
  Plane,
  Ship,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  FileText,
  ClipboardList,
  ClipboardCheck,
  ChevronLeft
} from 'lucide-react';
import WorkOrderSection from '../../WorkOrder/WorkOrderSection';
import PricingBreakdown from '../../../components/PricingBreakdown';
import PDFViewer from '@/app/components/PDFViewer';
import { useUser } from '@/app/contexts/UserContext';

// Service options configuration
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

// Component for section headers
const SectionHeader = ({ icon: Icon, title, children }: { 
  icon: React.ElementType, 
  title: string, 
  children?: React.ReactNode 
}) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center">
      <Icon className="h-5 w-5 text-blue-600 mr-2" />
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

// Component for quote status badge
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';
  let icon = null;

  switch (status) {
    case 'Need Response':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
    case 'Quoted':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
    case 'Approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case 'Completed':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      icon = <FileText className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <div className={`flex items-center px-3 py-1 mt-1 rounded-md ${bgColor} ${textColor} text-sm font-medium`}>
      {icon}
      {status}
    </div>
  );
};

// Component for info card
const InfoCard = ({ label, value, icon: Icon }: { 
  label: string, 
  value: string | React.ReactNode, 
  icon?: React.ElementType 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-start">
      {Icon && <Icon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <div className="mt-1 text-black font-medium">{value}</div>
      </div>
    </div>
  </div>
);

// Component for collapsible section
const CollapsibleSection = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  badge
}: {
  title: string,
  icon: React.ElementType,
  isExpanded: boolean,
  onToggle: () => void,
  children: React.ReactNode,
  badge?: React.ReactNode
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center transition-colors hover:bg-gray-100"
    >
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-blue-600 mr-3" />
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {badge && <div className="ml-4">{badge}</div>}
      </div>
      <ChevronDown
        className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
    {isExpanded && (
      <div className="p-6 animate-fadeIn">
        {children}
      </div>
    )}
  </div>
);

// Main component
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
    setLoading(true);
    try {
      const response = await apiService.getQuoteById(params.id as string);
      if (response.error) {
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
      if (err instanceof Error && err.message.includes('not found')) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

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

      // Show success message
      setSubmitting(false);
      // alert('Quote successfully generated and sent!');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate and send quote');
      setSubmitting(false);
    }
  };

  const vehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'Aircraft': return <Plane className="inline w-5 h-5 mr-1" />;
      case 'Automobile': return <Car className="inline w-5 h-5 mr-1" />;
      case 'Vessel': return <Ship className="inline w-5 h-5 mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">Loading Quote Details</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the quote information...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quote Not Found</h2>
          <p className="text-gray-600 mb-6">The quote you`&apos;`re looking for couldn`&apos;`t be found. It may have been deleted or you may not have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const total = services.reduce((sum, service) => sum + (service.price || 0), 0);

  // Get vehicle-specific details
  const getVehicleDetails = () => {
    const vehicleType = quote.vehicleType;

    if (vehicleType === 'Aircraft') {
      return (
        <>
          <InfoCard
            icon={Plane}
            label="Aircraft Type"
            value={quote.registrationNumber ? `${quote.registrationNumber}` : 'N/A'}
          />
          <InfoCard
            label="Service Type"
            value={quote.serviceType || 'N/A'}
          />
          <InfoCard
            label="Location"
            value={quote.serviceLocation || 'N/A'}
          />
        </>
      );
    } else if (vehicleType === 'Automobile') {
      return (
        <>
          <InfoCard
            icon={Car}
            label="Make & Model"
            value={`${quote.year} ${quote.make} ${quote.model}`}
          />
        </>
      );
    } else if (vehicleType === 'Vessel') {
      return (
        <>
          <InfoCard
            icon={Ship}
            label="Vessel Type"
            value={quote.vesselType || 'N/A'}
          />
          <InfoCard
            label="Boat Number"
            value={quote.boatNumber || 'N/A'}
          />
          <InfoCard
            label="Length"
            value={quote.length ? `${quote.length} ft` : 'N/A'}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header with breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-700">Quote Review</span>
            </div>
            {/* <h1 className="text-2xl font-bold text-gray-900">
              Quote Details
            </h1> */}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
        </div>

        {/* Quote Review Section */}
        <CollapsibleSection
          title="Quote Details"
          icon={FileText}
          isExpanded={isQuoteExpanded}
          onToggle={() => setIsQuoteExpanded(!isQuoteExpanded)}
          badge={null}
        >
          {/* Quote Header Card */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Quote #{quote.quoteId}</h3>
                    <StatusBadge status={quote.status} />
                  </div>
                </div>

                {quote.pdfUrl && (
                  <PDFViewer
                    quoteId={quote._id}
                    pdfUrl={quote.pdfUrl}
                    title="View Quote Document"
                    className="ml-auto"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard
                    label="Customer Name"
                    value={`${quote.firstName} ${quote.lastName}`}
                    icon={UserCircle}
                  />
                  <InfoCard
                    label="Email"
                    value={<a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">{quote.email}</a>}
                  />
                  <InfoCard
                    label="Phone"
                    value={<a href={`tel:${quote.phoneNumber}`} className="text-blue-600 hover:underline">{quote.phoneNumber}</a>}
                  />
                  {quote.companyName && (
                    <InfoCard
                      label="Company"
                      value={quote.companyName}
                    />
                  )}
                  <InfoCard
                    label="Created On"
                    value={new Date(quote.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <SectionHeader icon={UserCircle} title="Vehicle Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard
                label="Vehicle Type"
                value={(
                  <span className="flex items-center">
                    {vehicleTypeIcon(quote.vehicleType)}
                    {quote.vehicleType}
                  </span>
                )}
              />
              {getVehicleDetails()}
            </div>
          </div>

          {/* Services Section */}
          {quote.status === 'Need Response' ? (
            <div className="mb-8">
              <SectionHeader icon={DollarSign} title="Services & Pricing">
                <button
                  type="button"
                  onClick={addService}
                  className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Add Service
                </button>
              </SectionHeader>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-7">Service</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-200">
                  {services.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                      No services added yet. Click `&ldquo;`Add Service`&ldquo;` to get started.
                    </div>
                  ) : (
                    services.map((service, index) => (
                      <div key={index} className="px-4 py-3 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2">
                          <select
                            value={service.type}
                            onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="exterior">Exterior</option>
                            <option value="interior">Interior</option>
                          </select>
                        </div>

                        <div className="col-span-7">
                          <select
                            value={service.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            {serviceOptions[service.type].map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <div className="relative rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={service.price || ''}
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                              className="w-full text-black p-2 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                            aria-label="Remove service"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {services.length > 0 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="font-bold text-lg text-blue-600">${total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* View Only Services List with Pricing Breakdown */
            <div className="mb-8">
              <SectionHeader icon={DollarSign} title="Services & Pricing" />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <PricingBreakdown serviceDetails={quote.serviceDetails} />
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="mb-8">
            <SectionHeader icon={ClipboardList} title="Additional Notes" />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={quote.status !== 'Need Response'}
                rows={4}
                className="w-full text-black p-4 border-0 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none"
                placeholder="Add any additional notes or special instructions..."
              />

              {quote.serviceDetails.specialRequests && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Special Requests from Customer:</h4>
                  <p className="text-gray-600 italic">{quote.serviceDetails.specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-red-600">{error}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
            {(quote.status === 'Approved' || quote.status === 'Completed') && (
              <div className="mr-auto text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                <span className="font-medium">Approved by:</span> {quote.approvedUser?.firstName || 'System'} on{' '}
                {new Date(quote.updatedAt || quote.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {quote.status === 'Need Response' && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
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
        </CollapsibleSection>

        {/* Work Order Section */}
        {(quote.status === 'Approved' || quote.status === 'Completed') && (
          <CollapsibleSection
            title="Work Order"
            icon={ClipboardCheck}
            isExpanded={isWorkOrderExpanded}
            onToggle={() => setIsWorkOrderExpanded(!isWorkOrderExpanded)}
          >
            {quote._id && (
              <WorkOrderSection
                quoteId={quote._id}
                status={quote.status}
                quoteData={quote}
              />
            )}
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}