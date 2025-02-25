import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { apiService } from '../APIServices/apiService';

interface AircraftLookupProps {
    onAircraftFound: (aircraftData: any) => void;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const AircraftLookup: React.FC<AircraftLookupProps> = ({
    onAircraftFound,
    value,
    onChange,
    className = ''
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);

    const handleSearch = async () => {
        if (!value || value.trim() === '') {
            setError('Please enter a registration number');
            return;
        }

        setLoading(true);
        setError('');
        setSearchClicked(true);

        try {
            // Remove any non-alphanumeric characters and convert to uppercase
            const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

            const response = await apiService.getAircraftByNNumber(formattedValue);

            if (response.error) {
                setError(response.error);
            } else if (response.data) {
                onAircraftFound(response.data);
            }
        } catch (err) {
            setError('Failed to retrieve aircraft details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter Registration Number"
                    className={`${className} flex-grow`}
                    required
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
            </div>

            {error && searchClicked && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default AircraftLookup;