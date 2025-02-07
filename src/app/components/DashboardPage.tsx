'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { apiService, QuoteData } from '../APIServices/apiService';

// interface QuoteData {
//   _id: string;
//   quoteId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   vehicleType: string;
//   status: 'Need Response' | 'Quoted' | 'Approved' | 'Completed';
//   createdAt: string;
// }

export default function Dashboard() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchQuotes();
  }, [router]);

  const fetchQuotes = async () => {
    try {
      const response = await apiService.getQuotes();
      
      if (response.error) {
        router.push('/login');
        throw new Error(response.error);
      }

      if (response.data) {
        setQuotes(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: QuoteData['status']) => {
    switch (status) {
      case 'Need Response':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Quoted':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Completed':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      (quote.quoteId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      `${quote.firstName || ''} ${quote.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Quote Management</h1>
        </div>

        {/* Search and Filter - Adjusted for better mobile/tablet layout */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotes..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjE4MTgxOCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_.75rem_center]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Need Response">Need Response</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Quotes List - Adjusted table styling */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Quote ID
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote._id}
                    onClick={() => router.push(`/dashboard/quotes/${quote._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm md:text-base font-medium text-gray-900">
                      {quote.quoteId}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-600">
                      {quote.firstName} {quote.lastName}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-600">
                      {quote.vehicleType}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(quote.status)}
                        <span className="text-sm md:text-base text-gray-600">{quote.status}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-600">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

