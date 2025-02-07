import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { apiService } from '../APIServices/apiService';

interface PDFViewerProps {
    quoteId?: string;
    pdfUrl?: string;
    title?: string;
    className?: string;
}

const PDFViewer = ({ quoteId, pdfUrl: initialPdfUrl, title = "View PDF", className = "" }: PDFViewerProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfUrl, setPdfUrl] = useState(initialPdfUrl);

    const handleViewPDF = async () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
            return;
        }

        if (!quoteId) {
            setError('No PDF available');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiService.getQuotePDF(quoteId);
            if (response.error) {
                throw new Error(response.error);
            }
            if (response.data?.url) {
                window.open(response.data.url, '_blank');
                setPdfUrl(response.data.url);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handleViewPDF}
                disabled={loading || (!quoteId && !pdfUrl)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                    <FileText className="w-5 h-5 mr-2" />
                )}
                {title}
            </button>
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
};

export default PDFViewer;