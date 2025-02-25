// components/ExportToolbar.tsx
'use client'

import React from 'react';
import { ExportFormat } from '../utils/exportUtils';

interface ExportToolbarProps {
    onExport: (format: ExportFormat) => void;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ onExport }) => {
    return (
        <div className="flex space-x-2 mb-4">
            <button
                onClick={() => onExport('csv')}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
                CSV
            </button>
            <button
                onClick={() => onExport('excel')}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
                Excel
            </button>
            <button
                onClick={() => onExport('pdf')}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
                PDF
            </button>
            <button
                onClick={() => onExport('print')}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
                Print
            </button>
        </div>
    );
};

export default ExportToolbar;