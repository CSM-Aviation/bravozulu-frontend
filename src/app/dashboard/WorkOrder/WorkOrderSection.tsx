import React, { useState, useEffect } from 'react';
import { apiService, QuoteData, Service, WorkOrder } from '../../APIServices/apiService';
import { Loader2, ClipboardCheck, Clock, AlertTriangle } from 'lucide-react';
import WorkOrderForm from './WorkOrderForm';
import PDFViewer from '@/app/components/PDFViewer';

interface WorkOrderSectionProps {
  quoteId: string;
  status: string;
  quoteData: QuoteData;
}

const ServicesList = ({ services }: { services: Service[] }) => {
  // Separate services by type
  const exteriorServices = services.filter((service: Service) => service.type === 'exterior');
  const interiorServices = services.filter((service: Service) => service.type === 'interior');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Exterior Services */}
        {exteriorServices.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Exterior</h4>
            <div className="bg-white rounded-md border border-gray-200">
              {exteriorServices.map((service, index) => (
                <div
                  key={service.name}
                  className={`px-4 py-2 flex justify-between items-center ${index !== exteriorServices.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                >
                  <span className="text-gray-700">{service.displayName}</span>
                  {/* {service.price && (
                    <span className="text-gray-600">${service.price.toFixed(2)}</span>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interior Services */}
        {interiorServices.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Interior</h4>
            <div className="bg-white rounded-md border border-gray-200">
              {interiorServices.map((service, index) => (
                <div
                  key={service.name}
                  className={`px-4 py-2 flex justify-between items-center ${index !== interiorServices.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                >
                  <span className="text-gray-700">{service.displayName}</span>
                  {/* {service.price && (
                    <span className="text-gray-600">${service.price.toFixed(2)}</span>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkOrderSection: React.FC<WorkOrderSectionProps> = ({ quoteId, status, quoteData }) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchWorkOrder = async () => {
      if (status !== 'Approved' && status !== 'Completed') return;

      try {
        const response = await apiService.getWorkOrderByQuoteId(quoteId);
        if (response.error) {
          throw new Error(response.error);
        }
        if (response.data) {
          setWorkOrder(response.data);
          setExpanded(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch work order');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [quoteId, status]);

  const handleWorkOrderUpdate = async (updateData: WorkOrder) => {
    try {
      setLoading(true);
      // Just update the local state with the new work order data
      // The API call is already handled in the WorkOrderForm
      setWorkOrder(updateData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update work order');
    }
  };

  if (status !== 'Approved' && status !== 'Completed') {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'In Progress':
        return <Loader2 className="w-5 h-5 text-blue-500" />;
      case 'Completed':
        return <ClipboardCheck className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="p-4 bg-red-50 text-red-500 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="mt-8">
        <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">
          No work order found for this quote.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Work Order ID</div>
              <div className="font-medium">{workOrder.workOrderId}</div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(workOrder.status)}
              <span className="font-medium">{workOrder.status}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className="p-3">
          {/* <button
            onClick={() => setExpanded(!expanded)}
            className="flex justify-between items-center w-full mb-4"
          >
            <h3 className="text-lg font-semibold">Work Order Details</h3>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button> */}

          {expanded && (
            <div className="mt-4 space-y-8">
              {workOrder.status !== 'Completed' ? (
                <WorkOrderForm
                  quoteData={quoteData}
                  workOrderData={workOrder}
                  onUpdate={handleWorkOrderUpdate}
                />
              ) : (
                <div className="space-y-6">
                  {/* Completion Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Vehicle Type</h4>
                      <div className="text-sm text-gray-600">
                        {quoteData.vehicleType}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Completion Details</h4>
                      <div className="text-sm text-gray-600">
                        Completed by: {workOrder.completedUser?.firstName} on{' '}

                        {new Date(workOrder.completedAt!).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                        {new Date(workOrder.completedAt!).getDate() >= 1 && new Date(workOrder.completedAt!).getDate() <= 31 && ['st', 'nd', 'rd', 'th'][
                          (new Date(workOrder.completedAt!).getDate() % 10 > 3) ? 3 : new Date(workOrder.completedAt!).getDate() % 10 - 1
                        ]}, {new Date(workOrder.completedAt!).getFullYear()} at{' '}
                        {new Date(workOrder.completedAt!).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}

                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Registration Number</h4>
                      <div className="text-sm text-gray-600">
                        {quoteData.registrationNumber}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Service Location</h4>
                      <div className="text-sm text-gray-600">
                        {quoteData.serviceLocation}
                      </div>
                    </div>
                  </div>



                  {/* Completed Services */}
                  {workOrder.completedServices && workOrder.completedServices.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-4">Completed Services</h4>
                      <ServicesList services={workOrder.completedServices} />
                    </div>
                  )}

                  {/* Labor Details */}
                  {/* {workOrder.laborDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-4">Labor Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Hours:</span>
                          <span>{workOrder.laborDetails.totalHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hourly Rate:</span>
                          <span>${workOrder.laborDetails.hourlyRate}/hr</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total Labor Cost:</span>
                          <span>${workOrder.laborDetails.laborCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Time Entries */}
                  {workOrder.timeEntries && workOrder.timeEntries.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-4">Time Entries</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left">Date</th>
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">Hours</th>
                              <th className="px-4 py-2 text-left">Work Performed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workOrder.timeEntries.map((entry: { date: string; name: string; hours: number; workPerformed: string }, index: number) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-2">{entry.date}</td>
                                <td className="px-4 py-2">{entry.name}</td>
                                <td className="px-4 py-2">{entry.hours}</td>
                                <td className="px-4 py-2">{entry.workPerformed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4">Documents</h4>
                    <div className="space-y-4">
                      {quoteData.pdfUrl && (
                        <PDFViewer
                          pdfUrl={quoteData.pdfUrl}
                          title="View Quote PDF"
                        />
                      )}
                      {/* {workOrder.invoiceDetails?.url && (
                        <PDFViewer
                          pdfUrl={workOrder.invoiceDetails.url}
                          title="View Invoice PDF"
                        />
                      )} */}
                    </div>
                  </div>

                  {/* Comments */}
                  {workOrder.comments && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Comments</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{workOrder.comments}</p>
                    </div>
                  )}

                  {/* Images */}
                  {(workOrder.beforeImages?.length > 0 || workOrder.afterImages?.length > 0) && (
                    <div className="grid grid-cols-2 gap-8">
                      {workOrder.beforeImages?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-4">Before Images</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {workOrder.beforeImages.map((url: string, index: number) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Before ${index + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {workOrder.afterImages?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-4">After Images</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {workOrder.afterImages.map((url: string, index: number) => (
                              <img
                                key={index}
                                src={url}
                                alt={`After ${index + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderSection;