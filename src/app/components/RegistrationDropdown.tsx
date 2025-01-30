import React, { useState, useEffect } from 'react';
import { apiService } from '../APIServices/apiService';

interface RegistrationDropdownProps {
  value: string;
  onChange: (value: string, isInFleet: boolean) => void;
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
    
    if (selectedValue === 'other') {
      setCustomRegistration('');
      onChange('', false); // Reset the value when switching to "Other"
    } else {
      const isInFleet = fleetAircraft.some(
        aircraft => aircraft.tailNumber === selectedValue
      );
      onChange(selectedValue, isInFleet);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomRegistration(value);
    onChange(value, false); // Custom registrations are always not in-fleet
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
        <input
          type="text"
          value={customRegistration}
          onChange={handleCustomInputChange}
          placeholder="Enter Registration Number"
          className={className}
          required
        />
      )}
    </div>
  );
};

export default RegistrationDropdown;