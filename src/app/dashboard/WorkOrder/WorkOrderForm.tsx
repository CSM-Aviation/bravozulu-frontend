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
    <div className="space-y-8">
      {/* Vehicle Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
            <div className="mt-1">{quoteData?.vehicleType}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Registration Number</label>
            <div className="mt-1">{quoteData?.registrationNumber}</div>
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Time Entries</h3>
          <button
            type="button"
            onClick={addTimeEntry}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Entry
          </button>
        </div>
        <div className="space-y-4">
          {timeEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-start">
              <input
                type="date"
                value={entry.date}
                onChange={(e) => updateTimeEntry(index, 'date', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateTimeEntry(index, 'name', e.target.value)}
                placeholder="Name"
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={entry.startTime}
                onChange={(e) => updateTimeEntry(index, 'startTime', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={entry.endTime}
                onChange={(e) => updateTimeEntry(index, 'endTime', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={entry.hours}
                readOnly
                className="p-2 border rounded bg-gray-100"
              />
              <div className="flex items-center gap-2">
                {/* <input
                  type="text"
                  value={entry.workPerformed}
                  onChange={(e) => updateTimeEntry(index, 'workPerformed', e.target.value)}
                  placeholder="Work performed"
                  className="p-2 border rounded flex-grow"
                /> */}
                <select
                  value={entry.workPerformed}
                  onChange={(e) => updateTimeEntry(index, 'workPerformed', e.target.value)}
                  className="p-2 border rounded flex-grow"
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
                {timeEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeEntry(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      {/* <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Before Images</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
              <div className="flex flex-col items-center">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload images</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelection(e, 'before')}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              {beforeImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Before ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, 'before')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">After Images</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
              <div className="flex flex-col items-center">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload images</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelection(e, 'after')}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              {afterImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`After ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, 'after')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-8">
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
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
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