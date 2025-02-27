import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { apiService, QuoteData, Service, WorkOrder, WorkOrderUpdateData } from '../../APIServices/apiService';
import ImageUploadSection from '@/app/components/ImageUploadSection';
import { useUser } from '@/app/contexts/UserContext';
import TimeEntriesComponent from '@/app/components/TimeEntriesComponent';
import { aircraftExteriorOptions, aircraftInteriorOptions, ServiceChecklistSection } from '@/app/components/ServiceChecklistSection';

interface TimeEntry {
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  hours: number;
  workPerformed: string;
}

interface WorkOrderFormProps {
  quoteData: QuoteData;
  workOrderData: WorkOrder;
  onUpdate: (data: WorkOrder) => void;
}

// Service options from ServiceSelectionSection




const WorkOrderForm = ({ quoteData, workOrderData, onUpdate }: WorkOrderFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [beforeImages, setBeforeImages] = useState<File[]>([]);
  const [afterImages, setAfterImages] = useState<File[]>([]);
  const [comments, setComments] = useState('');
  const [selectedExteriorServices, setSelectedExteriorServices] = useState<string[]>([]);
  const [selectedInteriorServices, setSelectedInteriorServices] = useState<string[]>([]);
  const { user } = useUser();

  // Initialize form data from workOrderData if available
  useEffect(() => {
    if (workOrderData) {
      // Initialize time entries
      if (workOrderData.timeEntries && workOrderData.timeEntries.length > 0) {
        setTimeEntries(workOrderData.timeEntries);
      } else {
        // Add a default empty time entry if none exists
        // setTimeEntries([{
        //   date: new Date().toISOString().split('T')[0],
        //   name: '',
        //   startTime: '',
        //   endTime: '',
        //   hours: 0,
        //   workPerformed: ''
        // }]);
      }

      // Initialize comments
      if (workOrderData.comments) {
        setComments(workOrderData.comments);
      }
    }
  }, [workOrderData]);

  // Initialize selected services from quote or work order
  useEffect(() => {
    if (workOrderData?.completedServices) {
      const exterior = workOrderData.completedServices
        .filter((service: { type: string; name: string; }) => service.type === 'exterior')
        .map((service: { name: string; }) => service.name);
      const interior = workOrderData.completedServices
        .filter((service: { type: string; name: string; }) => service.type === 'interior')
        .map((service: { name: string; }) => service.name);

      setSelectedExteriorServices(exterior);
      setSelectedInteriorServices(interior);
    } else if (quoteData?.serviceDetails?.services) {
      const exterior = quoteData.serviceDetails.services
        .filter((service: Service) => service.type === 'exterior')
        .map((service: Service) => service.name);
      const interior = quoteData.serviceDetails.services
        .filter((service: Service) => service.type === 'interior')
        .map((service: Service) => service.name);

      setSelectedExteriorServices(exterior);
      setSelectedInteriorServices(interior);
    }
  }, [quoteData, workOrderData]);

  const handleImageUpload = async (images: File[], type: 'before' | 'after') => {
    if (!workOrderData?._id) return;

    try {
      // Create a copy of the files array to avoid potential mutability issues
      const imagesToUpload = Array.from(images);

      // Add loading state for images
      if (type === 'before') {
        setBeforeImages(prev => [...prev, ...imagesToUpload]);
      } else {
        setAfterImages(prev => [...prev, ...imagesToUpload]);
      }

      // // Upload images to server
      // const response = await apiService.uploadWorkOrderImages(workOrderData._id, imagesToUpload, type);

      // if (response.error) {
      //   // Remove the images from state if upload failed
      //   if (type === 'before') {
      //     setBeforeImages(prev => prev.filter(img => !imagesToUpload.includes(img)));
      //   } else {
      //     setAfterImages(prev => prev.filter(img => !imagesToUpload.includes(img)));
      //   }
      //   throw new Error(response.error);
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    }
  };

  const removeImage = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setAfterImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTimeEntriesChange = (updatedEntries: TimeEntry[]) => {
    setTimeEntries(updatedEntries);
  };

  const handleSubmit = async () => {
    if (!workOrderData?._id) return;

    // Validate required fields
    if (timeEntries.some(entry => !entry.name || !entry.workPerformed)) {
      setError('Please complete all time entry fields');
      return;
    }

    if (selectedExteriorServices.length === 0 && selectedInteriorServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Combine exterior and interior services
      const allSelectedServices: Service[] = [
        ...selectedExteriorServices.map(name => ({
          name,
          type: 'exterior' as const,
          displayName: aircraftExteriorOptions.find(opt => opt.value === name)?.label || name,
          status: 'completed' as const,
          price: quoteData?.serviceDetails?.services.find(
            (s: Service) => s.name === name && s.type === 'exterior'
          )?.price
        })),
        ...selectedInteriorServices.map(name => ({
          name,
          type: 'interior' as const,
          displayName: aircraftInteriorOptions.find(opt => opt.value === name)?.label || name,
          status: 'completed' as const,
          price: quoteData?.serviceDetails?.services.find(
            (s: Service) => s.name === name && s.type === 'interior'
          )?.price
        }))
      ];

      // First, submit the form data
      const formData: WorkOrderUpdateData = {
        timeEntries: timeEntries.map(entry => ({
          ...entry,
          hours: Number(entry.hours) || 0
        })),
        comments,
        completedServices: allSelectedServices,
        status: 'Completed',
        completedAt: new Date().toISOString(),
        completedUser: user ?? undefined
      };

      const workOrderResponse = await apiService.updateWorkOrder(
        workOrderData._id,
        formData
      );

      if (workOrderResponse.error) {
        throw new Error(workOrderResponse.error);
      }

      // Handle image uploads if any
      if (beforeImages.length > 0) {
        await apiService.uploadWorkOrderImages(
          workOrderData._id,
          Array.from(beforeImages),
          'before'
        );
      }

      if (afterImages.length > 0) {
        await apiService.uploadWorkOrderImages(
          workOrderData._id,
          Array.from(afterImages),
          'after'
        );
      }

      // Fetch updated work order data
      const refreshedData = await apiService.getWorkOrderByQuoteId(workOrderData.quoteId);
      if (refreshedData.error) {
        throw new Error(refreshedData.error);
      }

      if (refreshedData.data) {
        onUpdate(refreshedData.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit work order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Vehicle Information */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Vehicle Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
            <div className="mt-1 text-gray-900 font-medium">{quoteData?.vehicleType}</div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600">Registration Number</label>
            <div className="mt-1 text-gray-900 font-medium">{quoteData?.registrationNumber}</div>
          </div>
        </div>
      </div>

      {/* Services Checklist */}
      <ServiceChecklistSection
        vehicleType={quoteData?.vehicleType}
        quoteServices={quoteData?.serviceDetails}
        selectedExteriorServices={selectedExteriorServices}
        selectedInteriorServices={selectedInteriorServices}
        onExteriorServicesChange={setSelectedExteriorServices}
        onInteriorServicesChange={setSelectedInteriorServices}
      />

      {/* Time Entries Component */}
      <TimeEntriesComponent
        entries={timeEntries}
        onChange={handleTimeEntriesChange}
        autoSave={true}  // Enable auto-save
        autoSaveDelay={1500}  // Set delay to 1.5 seconds for a good UX balance
      />

      {/* Image Upload Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <ImageUploadSection
          title="Before Images"
          images={beforeImages}
          onImagesAdded={(files) => handleImageUpload(files, 'before')}
          onImageRemoved={(index) => removeImage(index, 'before')}
        />
        <ImageUploadSection
          title="After Images"
          images={afterImages}
          onImagesAdded={(files) => handleImageUpload(files, 'after')}
          onImageRemoved={(index) => removeImage(index, 'after')}
        />
      </div>

      {/* Comments */}
      <div className="bg-gray-50 text-black p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Add any additional comments or notes..."
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center">
          <X className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 w-full md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Saving...
            </>
          ) : (
            'Complete Work Order'
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkOrderForm; 