import React, { useState, useEffect } from 'react';
import { apiService } from '../APIServices/apiService';
import AircraftLookup from './AircraftLookup';
import AircraftDetails from './AircraftDetails';

interface RegistrationDropdownProps {
  value: string;
  onChange: (value: string, isInFleet: boolean, aircraftType?: string) => void;
  className?: string;
}

const RegistrationDropdown: React.FC<RegistrationDropdownProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [fleetAircraft, setFleetAircraft] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customRegistration, setCustomRegistration] = useState('');
  const [aircraftData, setAircraftData] = useState<any>(null);

  useEffect(() => {
    const fetchFleetAircraft = async () => {
      try {
        const response = await apiService.getFleetAircraft();
        if (response.error) {
          throw new Error(response.error);
        }
        if (response.data) {
          setFleetAircraft(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch fleet aircraft');
      } finally {
        setLoading(false);
      }
    };

    fetchFleetAircraft();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setShowOtherInput(selectedValue === 'other');
    setAircraftData(null);
    
    if (selectedValue === 'other') {
      setCustomRegistration('');
      onChange('', false); // Reset the value when switching to "Other"
    } else {
      const aircraft = fleetAircraft.find(aircraft => aircraft.tailNumber === selectedValue);
      const isInFleet = !!aircraft;
      onChange(selectedValue, isInFleet, aircraft?.type);
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomRegistration(value);
    onChange(value, false); // Custom registrations are always not in-fleet
  };

  const handleAircraftFound = (data: any) => {
    setAircraftData(data);
    // Pass aircraft model info to the parent component
    onChange(data.nNumber, false, `${data.manufacturer} ${data.model}`);
  };

  if (loading) {
    return (
      <select className={className} disabled>
        <option>Loading...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select className={className} disabled>
        <option>Error loading aircraft</option>
      </select>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={showOtherInput ? 'other' : value}
        onChange={handleSelectChange}
        className={className}
        required
      >
        <option value="">Select Registration Number</option>
        <optgroup label="In-Fleet Aircraft">
          {fleetAircraft.map((aircraft) => (
            <option key={aircraft._id} value={aircraft.tailNumber}>
              {aircraft.tailNumber} - {aircraft.type}
            </option>
          ))}
        </optgroup>
        <optgroup label="Other">
          <option value="other">Other Registration Number</option>
        </optgroup>
      </select>

      {showOtherInput && (
        <>
          <AircraftLookup
            value={customRegistration}
            onChange={handleCustomInputChange}
            onAircraftFound={handleAircraftFound}
            className={className}
          />
          
          {aircraftData && (
            <AircraftDetails 
              aircraftData={aircraftData} 
              onClose={() => setAircraftData(null)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationDropdown;