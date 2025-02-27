import { useEffect } from "react";
import { Service } from "../APIServices/apiService";


export const aircraftExteriorOptions = [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'wetWash', label: 'Wet Wash' },
    { value: 'dryWash', label: 'Dry Wash' },
    { value: 'waxing', label: 'Waxing/Buffing' },
    { value: 'brightwork', label: 'Brightwork Polishing' },
    { value: 'boots', label: 'Boots' },
    { value: 'gearWells', label: 'Gear Wells' }
  ];
  
  export const aircraftInteriorOptions = [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'basicPlus', label: 'Basic +' },
    { value: 'complete', label: 'Complete' },
    { value: 'carpetExtraction', label: 'Carpet Extraction' },
    { value: 'leatherReconditioning', label: 'Leather Reconditioning' },
    { value: 'stainRemoval', label: 'Stain Removal' }
  ];

  export  const autoVesselExteriorOptions = [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'complete', label: 'Complete' },
    { value: 'wheelRestoration', label: 'Wheel Restoration' },
    { value: 'headlightRestoration', label: 'Headlight Restoration' },
    { value: 'ecoWax', label: 'Eco Wax' }
  ];
  
  export  const autoVesselInteriorOptions = [
    { value: 'tripReady', label: 'Trip Ready' },
    { value: 'basic', label: 'Basic' },
    { value: 'complete', label: 'Complete' },
    { value: 'carpetExtraction', label: 'Carpet Extraction' },
    { value: 'leatherReconditioning', label: 'Leather Reconditioning' },
    { value: 'stainRemoval', label: 'Stain Removal' }
  ];

  export const ServiceChecklistSection = ({
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