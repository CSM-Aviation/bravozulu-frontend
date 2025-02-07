import React, { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { apiService, QuoteData, Service, WorkOrder, WorkOrderUpdateData } from '../../APIServices/apiService';
import ImageUploadSection from '@/app/components/ImageUploadSection';
import { useUser } from '@/app/contexts/UserContext';

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
const aircraftExteriorOptions = [
  { value: 'tripReady', label: 'Trip Ready' },
  { value: 'basic', label: 'Basic' },
  { value: 'wetWash', label: 'Wet Wash' },
  { value: 'dryWash', label: 'Dry Wash' },
  { value: 'waxing', label: 'Waxing/Buffing' },
  { value: 'brightwork', label: 'Brightwork Polishing' },
  { value: 'boots', label: 'Boots' },
  { value: 'gearWells', label: 'Gear Wells' }
];

const aircraftInteriorOptions = [
  { value: 'tripReady', label: 'Trip Ready' },
  { value: 'basic', label: 'Basic' },
  { value: 'basicPlus', label: 'Basic +' },
  { value: 'complete', label: 'Complete' },
  { value: 'carpetExtraction', label: 'Carpet Extraction' },
  { value: 'leatherReconditioning', label: 'Leather Reconditioning' },
  { value: 'stainRemoval', label: 'Stain Removal' }
];

const autoVesselExteriorOptions = [
  { value: 'tripReady', label: 'Trip Ready' },
  { value: 'basic', label: 'Basic' },
  { value: 'complete', label: 'Complete' },
  { value: 'wheelRestoration', label: 'Wheel Restoration' },
  { value: 'headlightRestoration', label: 'Headlight Restoration' },
  { value: 'ecoWax', label: 'Eco Wax' }
];

const autoVesselInteriorOptions = [
  { value: 'tripReady', label: 'Trip Ready' },
  { value: 'basic', label: 'Basic' },
  { value: 'complete', label: 'Complete' },
  { value: 'carpetExtraction', label: 'Carpet Extraction' },
  { value: 'leatherReconditioning', label: 'Leather Reconditioning' },
  { value: 'stainRemoval', label: 'Stain Removal' }
];
const ServiceChecklistSection = ({
  vehicleType,
  quoteServices,
  selectedExteriorServices,
  selectedInteriorServices,
  onExteriorServicesChange,
  onInteriorServicesChange
}: {
  vehicleType: string;
  quoteServices: { services: Array<Service> };
  selectedExteriorServices: string[];
  selectedInteriorServices: string[];
  onExteriorServicesChange: (services: string[]) => void;
  onInteriorServicesChange: (services: string[]) => void;
}) => {
  const isAircraft = vehicleType === 'Aircraft';
  const exteriorOptions = isAircraft ? aircraftExteriorOptions : autoVesselExteriorOptions;
  const interiorOptions = isAircraft ? aircraftInteriorOptions : autoVesselInteriorOptions;

  // Initialize with quote services
  useEffect(() => {
    if (quoteServices?.services) {
      const exteriorServices = quoteServices.services
        .filter(service => service.type === 'exterior')
        .map(service => service.name);
      const interiorServices = quoteServices.services
        .filter(service => service.type === 'interior')
        .map(service => service.name);

      onExteriorServicesChange(exteriorServices);
      onInteriorServicesChange(interiorServices);
    }
  }, [quoteServices, onExteriorServicesChange, onInteriorServicesChange]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Services Checklist</h3>
      <div className="grid grid-cols-2 gap-8">
        {/* Exterior Services */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Exterior Services</h4>
          <div className="space-y-2">
            {exteriorOptions.map((service) => (
              <label key={service.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedExteriorServices.includes(service.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onExteriorServicesChange([...selectedExteriorServices, service.value]);
                    } else {
                      onExteriorServicesChange(
                        selectedExteriorServices.filter(s => s !== service.value)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{service.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Interior Services */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Interior Services</h4>
          <div className="space-y-2">
            {interiorOptions.map((service) => (
              <label key={service.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedInteriorServices.includes(service.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onInteriorServicesChange([...selectedInteriorServices, service.value]);
                    } else {
                      onInteriorServicesChange(
                        selectedInteriorServices.filter(s => s !== service.value)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{service.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



const WorkOrderForm = ({ quoteData, workOrderData, onUpdate }: WorkOrderFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      date: new Date().toISOString().split('T')[0],
      name: '',
      startTime: '',
      endTime: '',
      hours: 0,
      workPerformed: ''
    }
  ]);
  const [beforeImages, setBeforeImages] = useState<File[]>([]);
  const [afterImages, setAfterImages] = useState<File[]>([]);
  const [comments, setComments] = useState('');
  const [selectedExteriorServices, setSelectedExteriorServices] = useState<string[]>([]);
  const [selectedInteriorServices, setSelectedInteriorServices] = useState<string[]>([]);
  const { user } = useUser();


  // Initialize selected services from quote
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

      // Upload images
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

  const addTimeEntry = () => {
    setTimeEntries(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      name: '',
      startTime: '',
      endTime: '',
      hours: 0,
      workPerformed: ''
    }]);
  };

  const removeTimeEntry = (index: number) => {
    setTimeEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeEntry = (index: number, field: keyof TimeEntry, value: string | number) => {
    setTimeEntries(prev => prev.map((entry, i) => {
      if (i === index) {
        const updatedEntry = { ...entry, [field]: value };

        // Calculate hours if start and end times are set
        if (field === 'startTime' || field === 'endTime') {
          if (updatedEntry.startTime && updatedEntry.endTime) {
            const start = new Date(`2000-01-01T${updatedEntry.startTime}`);
            const end = new Date(`2000-01-01T${updatedEntry.endTime}`);
            const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            updatedEntry.hours = Math.max(0, Math.round(diff * 100) / 100);
          }
        }

        return updatedEntry;
      }
      return entry;
    }));
  };

  const handleSubmit = async () => {
    if (!workOrderData?._id) return;


    // Validate required fields
    if (timeEntries.some(entry => !entry.name || !entry.workPerformed)) {
      setError('Please complete all time entry fields');
      // return;
    }
    console.log(error)

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


      // Handle image uploads
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
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
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

      {/* Time Entries */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Time Entries</h3>
          <button
            type="button"
            onClick={addTimeEntry}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Entry</span>
          </button>
        </div>
        <div className="space-y-6">
          {timeEntries.map((entry, index) => (
            <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateTimeEntry(index, 'date', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => updateTimeEntry(index, 'name', e.target.value)}
                    placeholder="Technician name"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Start Time</label>
                  <input
                    type="time"
                    value={entry.startTime}
                    onChange={(e) => updateTimeEntry(index, 'startTime', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">End Time</label>
                  <input
                    type="time"
                    value={entry.endTime}
                    onChange={(e) => updateTimeEntry(index, 'endTime', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Hours</label>
                  <input
                    type="number"
                    value={entry.hours}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">Work Performed</label>
                  <select
                    value={entry.workPerformed}
                    onChange={(e) => updateTimeEntry(index, 'workPerformed', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    required
                  >
                    <option value="">Select Work Performed</option>
                    <optgroup label="Exterior Services">
                      {aircraftExteriorOptions.map(option => (
                        <option key={`exterior-${option.value}`} value={`${option.label}-Exterior`}>
                          {option.label} - Exterior
                        </option>
                      ))}
                      {autoVesselExteriorOptions.map(option => (
                        <option key={`exterior-auto-${option.value}`} value={`${option.label}-Exterior`}>
                          {option.label} - Exterior
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Interior Services">
                      {aircraftInteriorOptions.map(option => (
                        <option key={`interior-${option.value}`} value={`${option.label}-Interior`}>
                          {option.label} - Interior
                        </option>
                      ))}
                      {autoVesselInteriorOptions.map(option => (
                        <option key={`interior-auto-${option.value}`} value={`${option.label}-Interior`}>
                          {option.label} - Interior
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
              {timeEntries.length > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTimeEntry(index)}
                    className="text-red-500 hover:text-red-600 flex items-center text-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove Entry
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Add any additional comments or notes..."
        />
      </div>

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
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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