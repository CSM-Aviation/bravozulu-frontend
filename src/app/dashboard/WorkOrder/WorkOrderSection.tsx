import React, { useState, useEffect } from 'react';
import { apiService, QuoteData, WorkOrder } from '../../APIServices/apiService';
import { Loader2, ClipboardCheck, Clock, AlertTriangle, Calendar, MapPin, CheckSquare, MessageSquare} from 'lucide-react';
import WorkOrderForm from './WorkOrderForm';
import PDFViewer from '@/app/components/PDFViewer';
import { TimeEntriesSummary } from '@/app/components/TimeEntriesSummary';
import { ServicesList } from '@/app/components/ServicesListView';
import { ImageGallery } from '@/app/components/ImageGalleryView';

interface WorkOrderSectionProps {
  quoteId: string;
  status: string;
  quoteData: QuoteData;
}





const WorkOrderSection: React.FC<WorkOrderSectionProps> = ({ quoteId, status, quoteData }) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setExpanded] = useState(true);

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
          setExpanded(true);
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
      setWorkOrder(updateData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update work order');
    }
  };

  if (status !== 'Approved' && status !== 'Completed') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading work order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-500 rounded-lg shadow-md flex items-center">
        <AlertTriangle className="w-6 h-6 mr-3" />
        <div>
          <h3 className="font-medium">Error Loading Work Order</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow-md flex items-center">
        <AlertTriangle className="w-6 h-6 mr-3" />
        <div>
          <h3 className="font-medium">No Work Order Found</h3>
          <p>There is no work order associated with this quote.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {workOrder.status !== 'Completed' ? (
        <WorkOrderForm
          quoteData={quoteData}
          workOrderData={workOrder}
          onUpdate={handleWorkOrderUpdate}
        />
      ) : (
        <div className="space-y-6">
          {/* Header Card with Status & Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center">
                <ClipboardCheck className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Work Order #{workOrder.workOrderId}</h3>
                  <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Completed</span></p>
                </div>
              </div>

              <PDFViewer
                pdfUrl={workOrder.wordorderDocument?.url}
                title="View Work Order"
                className="ml-auto"
              />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Vehicle Information</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="text-black font-medium">{quoteData.vehicleType}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Registration:</span>
                          <span className="text-black font-medium">{quoteData.registrationNumber}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-black font-medium">{quoteData.serviceLocation}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Completion Details</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Completed By:</span>
                          <span className="text-black font-medium">{workOrder.completedUser?.firstName || 'N/A'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-black font-medium">
                            {workOrder.completedAt
                              ? new Date(workOrder.completedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                              : 'N/A'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="text-black font-medium">
                            {workOrder.completedAt
                              ? new Date(workOrder.completedAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })
                              : 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Services */}
          {workOrder.completedServices && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
                  Completed Services
                </h3>
              </div>
              <div className="p-6">
                <ServicesList services={workOrder.completedServices} />
              </div>
            </div>
          )}

          {/* Time Entries */}
          {workOrder.timeEntries && workOrder.timeEntries.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Time Tracking
                </h3>
              </div>
              <div className="p-6">
                <TimeEntriesSummary timeEntries={workOrder.timeEntries} />
              </div>
            </div>
          )}

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageGallery
              images={workOrder.beforeImages || []}
              title="Before Images"
            />
            <ImageGallery
              images={workOrder.afterImages || []}
              title="After Images"
            />
          </div>

          {/* Comments */}
          {workOrder.comments && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                  Comments
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700">{workOrder.comments}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkOrderSection;