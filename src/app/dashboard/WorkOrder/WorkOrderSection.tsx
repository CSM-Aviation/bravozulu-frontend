import React, { useState, useEffect } from 'react';
import { apiService } from '../../APIServices/apiService';
import { Loader2, ClipboardCheck, Clock, AlertTriangle } from 'lucide-react';

interface WorkOrderSectionProps {
  quoteId: string;
  status: string;
}

const WorkOrderSection: React.FC<WorkOrderSectionProps> = ({ quoteId, status }) => {
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkOrder = async () => {
      if (status !== 'Approved') return;
      
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

  if (status !== 'Approved') {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Work Order</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Work Order</h2>
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
        <h2 className="text-lg font-semibold mb-4">Work Order</h2>
        <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">
          No work order found for this quote.
        </div>
      </div>
    );
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

  return (
    <div className="mt-8">
      {/* <h2 className="text-lg font-semibold mb-4">Work Order</h2> */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Work Order ID</label>
            <div className="mt-1 text-gray-900">{workOrder.workOrderId}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1 flex items-center gap-2">
              {getStatusIcon(workOrder.status)}
              <span>{workOrder.status}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Created At</label>
            <div className="mt-1 text-gray-900">
              {new Date(workOrder.createdAt).toLocaleDateString()}
            </div>
          </div>
          {workOrder.assignedTo && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Assigned To</label>
              <div className="mt-1 text-gray-900">{workOrder.assignedTo}</div>
            </div>
          )}
        </div>

        {workOrder.completionNotes && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Completion Notes</label>
            <div className="mt-1 text-gray-900 whitespace-pre-wrap">
              {workOrder.completionNotes}
            </div>
          </div>
        )}

        {workOrder.estimatedCompletionDate && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">
              Estimated Completion Date
            </label>
            <div className="mt-1 text-gray-900">
              {new Date(workOrder.estimatedCompletionDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderSection;