'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarIcon, X } from 'lucide-react';

interface DateRange {
    from: Date | null;
    to: Date | null;
}

interface DateRangePickerCalendarProps {
    onFilterChange: (startDate: string, endDate: string, preset?: string) => void;
    initialPreset?: string;
}

const DateRangePickerCalendar: React.FC<DateRangePickerCalendarProps> = ({
    onFilterChange,
    initialPreset = 'Current month'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
    const [selectedPreset, setSelectedPreset] = useState<string>(initialPreset);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initialize with current month
    useEffect(() => {
        applyPreset(initialPreset);
    }, [initialPreset]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format dates
    const formatDisplayDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateValue = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    // Apply preset date ranges
    const applyPreset = (preset: string) => {
        const currentDate = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        switch (preset) {
            case 'All time':
                from = new Date(2000, 0, 1);
                to = new Date(2099, 11, 31);
                break;
            case 'Current month':
                from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'Current year':
                from = new Date(currentDate.getFullYear(), 0, 1);
                to = new Date(currentDate.getFullYear(), 11, 31);
                break;
            case 'Last 30 days':
                to = new Date();
                from = new Date();
                from.setDate(from.getDate() - 30);
                break;
            case 'Last 60 days':
                to = new Date();
                from = new Date();
                from.setDate(from.getDate() - 60);
                break;
            case 'Last 90 days':
                to = new Date();
                from = new Date();
                from.setDate(from.getDate() - 90);
                break;
            case 'Last month':
                from = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                to = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                break;
            case 'Custom':
                // Don't change the current selection for custom
                return;
            default:
                from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
        }

        setDateRange({ from, to });
        setSelectedPreset(preset);

        if (from && to) {
            onFilterChange(formatDateValue(from), formatDateValue(to), preset);
        }
    };

    // Calendar navigation functions
    const prevMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const nextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    // Date selection handlers
    const handleDateClick = (date: Date) => {
        if (!dateRange.from || (dateRange.from && dateRange.to)) {
            // Start a new selection
            setDateRange({ from: date, to: null });
        } else {
            // Complete the selection
            const from = dateRange.from;
            if (date < from) {
                setDateRange({ from: date, to: from });
            } else {
                setDateRange({ from, to: date });
            }

            // Notify parent component of the change
            setSelectedPreset('Custom');
            onFilterChange(formatDateValue(from < date ? from : date), formatDateValue(from < date ? date : from), 'Custom');
        }
    };

    const clearDates = () => {
        setDateRange({ from: null, to: null });
        setSelectedPreset('');
        onFilterChange('', '', '');
    };

    // Calendar rendering helpers
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const isInRange = (date: Date) => {
        if (!dateRange.from) return false;
        if (!dateRange.to) return date.getTime() === dateRange.from.getTime();

        return date >= dateRange.from && date <= dateRange.to;
    };

    const isStartOrEnd = (date: Date) => {
        return (
            (dateRange.from && date.getTime() === dateRange.from.getTime()) ||
            (dateRange.to && date.getTime() === dateRange.to.getTime())
        );
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = new Date().toDateString() === date.toDateString();
            const inRange = isInRange(date);
            const isEdge = isStartOrEnd(date);

            days.push(
                <button
                    key={`day-${day}`}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isToday ? 'border border-blue-500' : ''}
            ${inRange ? 'bg-blue-100' : ''}
            ${isEdge ? 'bg-blue-500 text-white' : ''}
            ${!inRange && !isEdge ? 'hover:bg-gray-100' : ''}
          `}
                    onClick={() => handleDateClick(date)}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const presets = [
        'Current month',
        'Last 30 days',
        'Last 60 days',
        'Last 90 days',
        'Current year',
        'Last month',
        'All time',
    ];

    return (
        <div className="relative text-black inline-block" ref={dropdownRef}>
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between px-3 py-2 min-w-[280px] border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">
                            {dateRange.from
                                ? `${formatDisplayDate(dateRange.from)} - ${formatDisplayDate(dateRange.to)}`
                                : 'Select date range'}
                        </span>
                    </div>
                    {dateRange.from && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearDates();
                            }}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[340px]">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h2 className="text-sm font-medium">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div
                                key={day}
                                className="h-8 text-center text-xs font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>

                    {/* Date Range Display */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                        <div className="text-sm">
                            <span className="font-medium">Selected Range:</span>{' '}
                            <span className="text-gray-600">
                                {dateRange.from ? (
                                    <>
                                        {formatDisplayDate(dateRange.from)} - {formatDisplayDate(dateRange.to)}
                                    </>
                                ) : (
                                    'No date selected'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium mb-2">Preset Ranges</h3>
                        <div className="flex flex-wrap gap-2">
                            {presets.map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => {
                                        applyPreset(preset);
                                        setIsOpen(false);
                                    }}
                                    className={`text-xs px-3 py-1 rounded-full border ${selectedPreset === preset
                                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                                            : 'border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePickerCalendar;