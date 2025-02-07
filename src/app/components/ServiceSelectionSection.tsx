import React from 'react';

interface ServiceOption {
  value: string;
  label: string;
}

interface ServiceSelectionSectionProps {
  vehicleType: 'Aircraft' | 'Automobile' | 'Vessel';
  selectedExterior: string[];
  selectedInterior: string[];
  onExteriorChange: (selected: string[]) => void;
  onInteriorChange: (selected: string[]) => void;
  serviceType?: string;
}

interface ServiceCheckboxGroupProps {
  title: string;
  options: ServiceOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const ServiceCheckboxGroup: React.FC<ServiceCheckboxGroupProps> = ({ title, options, selected, onChange }) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-gray-700">{title}</h3>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, option.value]);
              } else {
                onChange(selected.filter(item => item !== option.value));
              }
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

interface ServiceSelectionSectionProps {
  vehicleType: 'Aircraft' | 'Automobile' | 'Vessel';
  selectedExterior: string[];
  selectedInterior: string[];
  onExteriorChange: (selected: string[]) => void;
  onInteriorChange: (selected: string[]) => void;
  serviceType?: string;
}

const ServiceSelectionSection: React.FC<ServiceSelectionSectionProps> = ({
  vehicleType,
  selectedExterior,
  selectedInterior,
  onExteriorChange,
  onInteriorChange,
  serviceType
}) => {
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
    { value: 'stainRemoval', label: 'Stain Removal' },
    { value: 'other', label: 'Other (specify)' }
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

  const isAircraft = vehicleType === 'Aircraft';
  const exteriorOptions = isAircraft ? aircraftExteriorOptions : autoVesselExteriorOptions;
  const interiorOptions = isAircraft ? aircraftInteriorOptions : autoVesselInteriorOptions;

  const showExterior = serviceType === 'exterior' || serviceType === 'both';
  const showInterior = serviceType === 'interior' || serviceType === 'both';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showExterior && (
          <ServiceCheckboxGroup
            title={`${vehicleType} Exterior Services`}
            options={exteriorOptions}
            selected={selectedExterior}
            onChange={onExteriorChange}
          />
        )}
        {showInterior && (
          <ServiceCheckboxGroup
            title={`${vehicleType} Interior Services`}
            options={interiorOptions}
            selected={selectedInterior}
            onChange={onInteriorChange}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceSelectionSection;