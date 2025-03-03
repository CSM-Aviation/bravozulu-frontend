// Updated TimeEntriesComponent.tsx with auto-save functionality
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Trash2, Edit, Save, X } from 'lucide-react';

// Time entry interface
export interface TimeEntry {
    id?: string;
    date: string;
    name: string;
    startTime: string;
    endTime: string;
    hours: number;
    workPerformed: string;
    workType?: string;
}

// Work options based on service types
export const workOptions = [
    { value: 'tripReady-Exterior', label: 'Trip Ready - Exterior' },
    { value: 'basic-Exterior', label: 'Basic - Exterior' },
    { value: 'wetWash-Exterior', label: 'Wet Wash - Exterior' },
    { value: 'dryWash-Exterior', label: 'Dry Wash - Exterior' },
    { value: 'waxing-Exterior', label: 'Waxing/Buffing - Exterior' },
    { value: 'brightwork-Exterior', label: 'Brightwork Polishing - Exterior' },
    { value: 'boots-Exterior', label: 'Boots - Exterior' },
    { value: 'gearWells-Exterior', label: 'Gear Wells - Exterior' },
    { value: 'tripReady-Interior', label: 'Trip Ready - Interior' },
    { value: 'basic-Interior', label: 'Basic - Interior' },
    { value: 'basicPlus-Interior', label: 'Basic Plus - Interior' },
    { value: 'complete-Interior', label: 'Complete - Interior' },
    { value: 'carpetExtraction-Interior', label: 'Carpet Extraction - Interior' },
    { value: 'leatherReconditioning-Interior', label: 'Leather Reconditioning - Interior' },
    { value: 'stainRemoval-Interior', label: 'Stain Removal - Interior' }
];

interface TimeEntriesProps {
    entries: TimeEntry[];
    onChange: (entries: TimeEntry[]) => void;
    autoSave?: boolean;
    autoSaveDelay?: number;
}

const TimeEntriesComponent: React.FC<TimeEntriesProps> = ({
    entries = [],
    onChange,
    autoSave = true,
    autoSaveDelay = 1000 // Default delay of 1 second
}) => {
    // State for the entry being edited
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    // State for the entry form values
    const [formValues, setFormValues] = useState<TimeEntry | null>(null);
    // State for validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});
    // State for saving status
    const [, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    // State to track if we need to save changes
    const [pendingChanges, setPendingChanges] = useState(false);

    // Generate a unique ID for new entries
    const generateId = () => `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Ensure all entries have IDs
    const entriesWithIds = entries.map(entry => ({
        ...entry,
        id: entry.id || generateId()
    }));

    // Auto-save function
    const autoSaveChanges = useCallback(() => {
        if (!pendingChanges || !autoSave) return;

        // Reset pending changes flag
        setPendingChanges(false);
        setSaveStatus('saving');

        // Notify parent component of changes
        onChange(entriesWithIds);

        // Show saved status
        setTimeout(() => {
            setSaveStatus('saved');
            // Reset status after a brief delay
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 300);
    }, [pendingChanges, entriesWithIds, onChange, autoSave]);

    // Set up auto-save timer
    useEffect(() => {
        if (!autoSave) return;

        const timer = setTimeout(() => {
            autoSaveChanges();
        }, autoSaveDelay);

        return () => clearTimeout(timer);
    }, [pendingChanges, autoSave, autoSaveDelay, autoSaveChanges]);

    // Add a new time entry
    const addTimeEntry = () => {
        const newEntry: TimeEntry = {
            id: generateId(),
            date: new Date().toISOString().split('T')[0],
            name: '',
            startTime: '',
            endTime: '',
            hours: 0,
            workPerformed: ''
        };

        setEditingEntry(newEntry.id ?? null);
        setFormValues(newEntry);

        const updatedEntries = [...entriesWithIds, newEntry];
        onChange(updatedEntries);
        setPendingChanges(true);
    };

    // Start editing an entry
    const startEditing = (entry: TimeEntry) => {
        setEditingEntry(entry.id ?? null);
        setFormValues({ ...entry });
    };

    // Cancel editing and revert changes
    const cancelEditing = (entry: TimeEntry, isNew: boolean) => {
        setEditingEntry(null);
        setFormValues(null);
        setErrors({});

        // If this is a new entry that was being edited, remove it
        if (isNew && Object.values(entry).some(val => val === '' || val === 0)) {
            const updatedEntries = entriesWithIds.filter(e => e.id !== entry.id);
            onChange(updatedEntries);
            setPendingChanges(true);
        }
    };

    // Remove a time entry
    const removeTimeEntry = (id: string) => {
        const updatedEntries = entriesWithIds.filter(entry => entry.id !== id);
        onChange(updatedEntries);
        setPendingChanges(true);

        if (editingEntry === id) {
            setEditingEntry(null);
            setFormValues(null);
        }
    };

    // Update form values
    const updateFormField = (field: keyof TimeEntry, value: string | number) => {
        if (!formValues) return;

        const updatedValues = { ...formValues, [field]: value };

        // Calculate hours if start and end times are set
        if ((field === 'startTime' || field === 'endTime') && updatedValues.startTime && updatedValues.endTime) {
            try {
                const start = new Date(`2000-01-01T${updatedValues.startTime}`);
                const end = new Date(`2000-01-01T${updatedValues.endTime}`);

                // Check if end time is after start time
                if (end > start) {
                    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    updatedValues.hours = parseFloat(diff.toFixed(2));
                    // Clear error if it was set
                    if (errors.time) {
                        setErrors(prev => ({ ...prev, time: '' }));
                    }
                } else if (end < start) {
                    // Set error if end time is before start time
                    setErrors(prev => ({ ...prev, time: 'End time must be after start time' }));
                }
            } catch (e) {
                console.error("Error calculating hours:", e);
            }
        }

        setFormValues(updatedValues);
    };

    // Save the edited entry
    const saveEntry = (id: string) => {
        if (!formValues) return;

        // Validate form values
        const newErrors: Record<string, string> = {};
        if (!formValues.date) newErrors.date = 'Date is required';
        if (!formValues.name.trim()) newErrors.name = 'Name is required';
        if (!formValues.workPerformed) newErrors.workPerformed = 'Work performed is required';
        if (!formValues.startTime) newErrors.startTime = 'Start time is required';
        if (!formValues.endTime) newErrors.endTime = 'End time is required';

        // Check if end time is after start time
        if (formValues.startTime && formValues.endTime) {
            const start = new Date(`2000-01-01T${formValues.startTime}`);
            const end = new Date(`2000-01-01T${formValues.endTime}`);
            if (end <= start) newErrors.time = 'End time must be after start time';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Update the entry in the list
        const updatedEntries = entriesWithIds.map(entry => {
            if (entry.id === id) {
                return { ...formValues, id };
            }
            return entry;
        });

        onChange(updatedEntries);
        setPendingChanges(true);
        setEditingEntry(null);
        setFormValues(null);
        setErrors({});
    };

    // Auto-save active entry when values change
    useEffect(() => {
        if (autoSave && formValues && editingEntry) {
            const noTimeErrors = !(errors.time);

            if (noTimeErrors) {
                const debounceTimer = setTimeout(() => {
                    // Update the entry in the list
                    const updatedEntries = entriesWithIds.map(entry => {
                        if (entry.id === editingEntry) {
                            return { ...formValues, id: editingEntry };
                        }
                        return entry;
                    });

                    onChange(updatedEntries);
                    setPendingChanges(true);

                    // Show brief saving indicator
                    setSaveStatus('saving');
                    setTimeout(() => {
                        setSaveStatus('saved');
                        setTimeout(() => setSaveStatus('idle'), 2000);
                    }, 300);
                }, autoSaveDelay);

                return () => clearTimeout(debounceTimer);
            }
        }
    }, [formValues, editingEntry, autoSave, autoSaveDelay, entriesWithIds, onChange, errors.time]);

    // Get total hours for all entries
    const totalHours = entriesWithIds.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 w-full relative">
            {/* Auto-save status indicator */}
            {/* {autoSave && saveStatus !== 'idle' && (
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm ${saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
                    saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {saveStatus === 'saving' ? 'Saving...' :
                        saveStatus === 'saved' ? 'Saved!' :
                            'Error saving'}
                </div>
            )} */}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center text-gray-800">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Time Entries
                </h3>
                <button
                    type="button"
                    onClick={addTimeEntry}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Entry</span>
                </button>
            </div>

            {entriesWithIds.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No time entries yet. Click `&ldquo;`Add Entry`&ldquo;` to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Technician</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Start Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">End Time</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Hours</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Work Performed</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entriesWithIds.map((entry) => {
                                const isEditing = editingEntry === entry.id;
                                const isNewEntry = isEditing && !entry.name && !entry.workPerformed;

                                return (
                                    <tr
                                        key={entry.id}
                                        className={`border-b text-black border-gray-200 ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    >
                                        {isEditing ? (
                                            // Edit mode
                                            <>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="date"
                                                        value={formValues?.date || ''}
                                                        onChange={(e) => updateFormField('date', e.target.value)}
                                                        className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={formValues?.name || ''}
                                                        onChange={(e) => updateFormField('name', e.target.value)}
                                                        placeholder="Technician name"
                                                        className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="time"
                                                        value={formValues?.startTime || ''}
                                                        onChange={(e) => updateFormField('startTime', e.target.value)}
                                                        className={`w-full p-2 border rounded-md ${errors.startTime || errors.time ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.startTime && <div className="text-red-500 text-xs mt-1">{errors.startTime}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="time"
                                                        value={formValues?.endTime || ''}
                                                        onChange={(e) => updateFormField('endTime', e.target.value)}
                                                        className={`w-full p-2 border rounded-md ${errors.endTime || errors.time ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.endTime && <div className="text-red-500 text-xs mt-1">{errors.endTime}</div>}
                                                    {errors.time && <div className="text-red-500 text-xs mt-1">{errors.time}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={formValues?.hours || 0}
                                                        readOnly
                                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={formValues?.workPerformed || ''}
                                                        onChange={(e) => updateFormField('workPerformed', e.target.value)}
                                                        className={`w-full p-2 border rounded-md ${errors.workPerformed ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    >
                                                        <option value="">Select work</option>
                                                        <optgroup label="Exterior Services">
                                                            {workOptions.filter(opt => opt.value.includes('Exterior')).map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="Interior Services">
                                                            {workOptions.filter(opt => opt.value.includes('Interior')).map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    </select>
                                                    {errors.workPerformed && <div className="text-red-500 text-xs mt-1">{errors.workPerformed}</div>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => saveEntry(entry.id!)}
                                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                                                            title="Save entry"
                                                        >
                                                            <Save className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => cancelEditing(entry, isNewEntry)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // View mode
                                            <>
                                                <td className="px-4 py-3">{entry.date}</td>
                                                <td className="px-4 py-3">{entry.name}</td>
                                                <td className="px-4 py-3">{entry.startTime}</td>
                                                <td className="px-4 py-3">{entry.endTime}</td>
                                                <td className="px-4 py-3">{entry.hours.toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    {workOptions.find(opt => opt.value === entry.workPerformed)?.label || entry.workPerformed}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditing(entry)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Edit entry"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTimeEntry(entry.id!)}
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Remove entry"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {entriesWithIds.length > 0 && (
                <div className="mt-6 pt-4 flex justify-between items-center border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        {entriesWithIds.length} {entriesWithIds.length === 1 ? 'entry' : 'entries'}
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-md">
                        <span className="font-medium text-gray-700">
                            Total Hours: <span className="text-blue-600 font-bold">{totalHours.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* {entriesWithIds.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Work Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Exterior', 'Interior'].map(type => {
                            const typeEntries = entriesWithIds.filter(entry =>
                                entry.workPerformed && entry.workPerformed.includes(type)
                            );

                            if (typeEntries.length === 0) return null;

                            // Group by specific work and calculate total hours for each
                            const workGroups: Record<string, number> = {};
                            typeEntries.forEach(entry => {
                                const workLabel = workOptions.find(opt => opt.value === entry.workPerformed)?.label || entry.workPerformed;
                                workGroups[workLabel] = (workGroups[workLabel] || 0) + entry.hours;
                            });

                            return (
                                <div key={type} className="bg-gray-50 text-black p-4 rounded-lg">
                                    <h5 className="font-medium text-gray-700 mb-2">{type} Work</h5>
                                    <ul className="space-y-1">
                                        {Object.entries(workGroups).map(([work, hours]) => (
                                            <li key={work} className="flex justify-between">
                                                <span>{work}</span>
                                                <span className="font-medium">{hours.toFixed(2)} hrs</span>
                                            </li>
                                        ))}
                                        <li className="pt-2 mt-2 border-t border-gray-200 font-semibold flex justify-between">
                                            <span>Total {type}</span>
                                            <span>{typeEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2)} hrs</span>
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )} */}

            
        </div>
    );
};

export default TimeEntriesComponent;