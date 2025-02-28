// utils/exportUtils.ts

import { QuoteData } from "../APIServices/apiService";

// Type for export options
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'print';

// Helper function to format date
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (error) {
        console.error(error);
        return dateString;
    }
};

// Helper function to convert quotes to CSV format
export const convertToCSV = (quotes: QuoteData[]): string => {
    if (quotes.length === 0) {
        return '';
    }

    // Define headers based on the structure of QuoteData
    const headers = [
        'Quote ID',
        'Customer Name',
        'Email',
        'Phone',
        'Vehicle Type',
        'Status',
        'Date',
        'Total Amount'
    ];

    const rows = quotes.map(quote => [
        quote.quoteId || '',
        `${quote.firstName} ${quote.lastName}`,
        quote.email,
        quote.phoneNumber,
        quote.vehicleType,
        quote.status,
        formatDate(quote.createdAt),
        quote.serviceDetails?.totalPrice ? `$${quote.serviceDetails.totalPrice.toFixed(2)}` : 'N/A'
    ]);

    // Convert to CSV format
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
            // Escape commas and quotes in cell values
            const cellStr = String(cell);
            return cellStr.includes(',') || cellStr.includes('"')
                ? `"${cellStr.replace(/"/g, '""')}"`
                : cellStr;
        }).join(','))
    ].join('\n');

    return csvContent;
};

// Function to download CSV
export const downloadCSV = (quotes: QuoteData[]): void => {
    const csvContent = convertToCSV(quotes);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `quotes_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);

    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Function to prepare data for Excel export
export const downloadExcel = async (quotes: QuoteData[]): Promise<void> => {
    try {
        // We'll use the CSV approach for simplicity since we don't have a library dependency
        // In a real implementation, you might want to use a library like xlsx or exceljs
        const csvContent = convertToCSV(quotes);
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `quotes_export_${new Date().toISOString().slice(0, 10)}.xls`);
        document.body.appendChild(link);

        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Failed to export to Excel. Please try again.');
    }
};

// Basic PDF export using browser print
export const downloadPDF = (quotes: QuoteData[]): void => {
    // For PDF, we'll create a simple HTML table and use the browser's print functionality
    // For a production app, you might want to use a library like jspdf or pdfmake

    const htmlContent = `
    <html>
      <head>
        <title>Quotes Export</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Quotes Export - ${new Date().toLocaleDateString()}</h1>
        <table>
          <thead>
            <tr>
              <th>Quote ID</th>
              <th>Customer</th>
              <th>Vehicle Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quotes.map(quote => `
              <tr>
                <td>${quote.quoteId || ''}</td>
                <td>${quote.firstName} ${quote.lastName}</td>
                <td>${quote.vehicleType}</td>
                <td>${quote.status}</td>
                <td>${formatDate(quote.createdAt)}</td>
                <td>${quote.serviceDetails?.totalPrice ? `$${quote.serviceDetails.totalPrice.toFixed(2)}` : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        // Add a slight delay to allow the content to load
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    } else {
        alert('Please allow pop-ups to export PDF');
    }
};

// Print function - similar to PDF but explicitly for printing
export const printQuotes = (quotes: QuoteData[]): void => {
    downloadPDF(quotes); // Reuse the PDF function as it uses print
};

// Main export function that handles all formats
export const exportQuotes = (quotes: QuoteData[], format: ExportFormat): void => {
    switch (format) {
        case 'csv':
            downloadCSV(quotes);
            break;
        case 'excel':
            downloadExcel(quotes);
            break;
        case 'pdf':
            downloadPDF(quotes);
            break;
        case 'print':
            printQuotes(quotes);
            break;
        default:
            console.error('Unsupported export format');
    }
};