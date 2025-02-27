'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Printer
} from 'lucide-react';
import { apiService, QuoteData } from '@/app/APIServices/apiService';
// import DateFilterComponent from '@/app/components/DateFilterComponent';
import PaginationComponent from '@/app/components/PaginationComponent';
import { exportQuotes, ExportFormat } from '@/app/utils/exportUtils';
import DateRangePicker from './DateRangePicker';

export default function Dashboard() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [, setDatePreset] = useState('Current month');

  // Sorting state
  const [sortBy, setSortBy] = useState<'customer' | 'vehicleType' | 'status' | 'createdAt' | 'total'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      setLoading(true);
      const response = await apiService.getQuotes();

      if (response.error) {
        router.push('/login');
        throw new Error(response.error);
      }

      if (response.data) {
        setQuotes(response.data);
        applyFilters(response.data, searchTerm, statusFilter, startDate, endDate);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchQuotes();
    setRefreshing(false);
  };

  // Apply all filters together
  const applyFilters = (
    data: QuoteData[],
    search: string,
    status: string,
    start: string,
    end: string
  ) => {
    let result = [...data];

    // Apply status filter
    if (status !== 'all') {
      result = result.filter(quote => quote.status === status);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(quote =>
        (quote.quoteId?.toLowerCase() || '').includes(searchLower) ||
        `${quote.firstName} ${quote.lastName}`.toLowerCase().includes(searchLower) ||
        (quote.email?.toLowerCase() || '').includes(searchLower) ||
        (quote.companyName?.toLowerCase() || '').includes(searchLower) ||
        (quote.vehicleType?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Apply date filter
    if (start && end) {
      const startDt = new Date(start);
      const endDt = new Date(end);
      endDt.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter(quote => {
        const createdDate = new Date(quote.createdAt);
        return createdDate >= startDt && createdDate <= endDt;
      });
    }

    // Apply sorting
    result = result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'customer':
          valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'vehicleType':
          valueA = a.vehicleType?.toLowerCase() || '';
          valueB = b.vehicleType?.toLowerCase() || '';
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'total':
          valueA = a.serviceDetails?.totalPrice || 0;
          valueB = b.serviceDetails?.totalPrice || 0;
          break;
        default:
          valueA = '';
          valueB = '';
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredQuotes(result);
    setCurrentPage(1);
  };

  // Update filters when search term or status changes
  useEffect(() => {
    applyFilters(quotes, searchTerm, statusFilter, startDate, endDate);
  }, [quotes, searchTerm, statusFilter, startDate, endDate, sortBy, sortDirection]);

  const handleDateFilterChange = (start: string, end: string, preset?: string) => {
    setStartDate(start);
    setEndDate(end);
    if (preset) {
      setDatePreset(preset);
    }
  };

  const getStatusIcon = (status: QuoteData['status']) => {
    switch (status) {
      case 'Need Response':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Quoted':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Completed':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: QuoteData['status']) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'Need Response':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-800';
        break;
      case 'Quoted':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'Approved':
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-800';
        break;
      case 'Completed':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  // Calculate pagination values
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Get current records for the page
  const currentRecords = useMemo(() => {
    return filteredQuotes.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [filteredQuotes, indexOfFirstRecord, indexOfLastRecord]);

  const totalPages = Math.ceil(filteredQuotes.length / recordsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRecordsPerPageChange = (newRecordsPerPage: number) => {
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleExport = (format: ExportFormat) => {
    exportQuotes(filteredQuotes, format);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
              <p className="text-gray-500 mt-1">Manage and track all quotes</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base text-black border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Need Response">Need Response</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="col-span-1 md:col-span-2">
                <DateRangePicker
                  onFilterChange={handleDateFilterChange}
                  initialPreset="Current month"
                />
              </div>

              {/* Search Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID, name, email..."
                    className="block w-full pl-10 pr-3 text-black py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results & Export Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Results</h2>
              <p className="text-sm text-gray-500">Found {filteredQuotes.length} quotes</p>
            </div>

            {/* Export Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                <Download className="mr-1.5 h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                <Download className="mr-1.5 h-4 w-4" />
                Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                <Download className="mr-1.5 h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('print')}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                <Printer className="mr-1.5 h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote ID
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      <div className="flex flex-col items-center justify-center">
                        {sortBy === 'customer' ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 text-gray-300 group-hover:text-gray-400" />
                            <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gray-400 -mt-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('vehicleType')}
                  >
                    <div className="flex items-center gap-1">
                      Vehicle Type
                      <div className="flex flex-col items-center justify-center">
                        {sortBy === 'vehicleType' ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 text-gray-300 group-hover:text-gray-400" />
                            <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gray-400 -mt-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <div className="flex flex-col items-center justify-center">
                        {sortBy === 'status' ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 text-gray-300 group-hover:text-gray-400" />
                            <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gray-400 -mt-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <div className="flex flex-col items-center justify-center">
                        {sortBy === 'createdAt' ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 text-gray-300 group-hover:text-gray-400" />
                            <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gray-400 -mt-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      <div className="flex flex-col items-center justify-center">
                        {sortBy === 'total' ? (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <>
                            <ChevronUp className="h-3 w-3 text-gray-300 group-hover:text-gray-400" />
                            <ChevronDown className="h-3 w-3 text-gray-300 group-hover:text-gray-400 -mt-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((quote) => (
                  <tr
                    key={quote._id}
                    onClick={() => router.push(`/dashboard/quotes/${quote._id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{quote.quoteId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.firstName} {quote.lastName}</div>
                      {quote.companyName && (
                        <div className="text-xs text-gray-500">
                          {quote.companyName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{quote.vehicleType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{new Date(quote.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quote.serviceDetails?.totalPrice ? (
                        <span className="text-sm font-medium text-gray-900">
                          ${quote.serviceDetails.totalPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                {currentRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No quotes found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredQuotes.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                recordsPerPage={recordsPerPage}
                onRecordsPerPageChange={handleRecordsPerPageChange}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}