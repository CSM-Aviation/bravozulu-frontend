import React, { useState, useEffect } from 'react';
import { apiService } from '../../APIServices/apiService';
import { Loader2, ClipboardCheck, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import WorkOrderForm from './WorkOrderForm';

interface WorkOrderSectionProps {
  quoteId: string;
  status: string;
  quoteData: any;
}

const WorkOrderSection: React.FC<WorkOrderSectionProps> = ({ quoteId, status, quoteData }) => {
  const [workOrder, setWorkOrder] = useState<any>(null);
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
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch work order');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [quoteId, status]);

  const handleWorkOrderUpdate = async (updateData: any) => {
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
        <div className="p-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex justify-between items-center w-full mb-4"
          >
            <h3 className="text-lg font-semibold">Work Order Details</h3>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''
                }`}
            />
          </button>

          {expanded && (
            <div className="mt-4">
              {workOrder.status !== 'Completed' ? (
                <WorkOrderForm
                  quoteData={quoteData}
                  workOrderData={workOrder}
                  onUpdate={handleWorkOrderUpdate}
                />
              ) : (
                <div className="space-y-6">
                  {/* Display completed work order details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Completion Details</h4>
                    <div className="text-sm text-gray-600">
                      Completed on: {new Date(workOrder.completedAt).toLocaleDateString()}
                    </div>
                  </div>

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
                            {workOrder.timeEntries.map((entry: any, index: number) => (
                              <tr key={index}>
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