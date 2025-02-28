import React from 'react';
import { X } from 'lucide-react';

interface AircraftDetailsProps {
  aircraftData: {
    nNumber: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    owner?: string;
    status?: string;
    registrationDate?: string;
    expirationDate?: string;
  };
  onClose: () => void;
}

const AircraftDetails: React.FC<AircraftDetailsProps> = ({ aircraftData, onClose }) => {
  if (!aircraftData.serialNumber) {
    return (
      <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <p className="text-red-600 font-medium">No Aircraft details found</p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg relative">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      
      <h4 className="text-lg font-semibold text-blue-800 mb-2">Aircraft Details</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <p><span className="font-medium">Registration:</span> {aircraftData.nNumber}</p>
          <p><span className="font-medium">Manufacturer:</span> {aircraftData.manufacturer}</p>
          <p><span className="font-medium">Model:</span> {aircraftData.model}</p>
          <p><span className="font-medium">Serial Number:</span> {aircraftData.serialNumber}</p>
        </div>
        
        <div className="space-y-1">
          {aircraftData.owner && (
            <p><span className="font-medium">Owner:</span> {aircraftData.owner}</p>
          )}
          {aircraftData.status && (
            <p><span className="font-medium">Status:</span> {aircraftData.status}</p>
          )}
          {aircraftData.registrationDate && (
            <p><span className="font-medium">Registration Date:</span> {aircraftData.registrationDate}</p>
          )}
          {aircraftData.expirationDate && (
            <p><span className="font-medium">Expiration Date:</span> {aircraftData.expirationDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AircraftDetails;