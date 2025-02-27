
import { workOptions } from '@/app/components/TimeEntriesComponent';


export const TimeEntriesSummary = ({ timeEntries }: { timeEntries: any[] }) => {
    if (!timeEntries || timeEntries.length === 0) {
      return <div className="text-gray-500 italic text-center py-4">No time entries recorded</div>;
    }
  
    // Calculate total hours
    const totalHours = timeEntries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
  
    // Group entries by work type
    const workSummary = timeEntries.reduce((acc, entry) => {
      const workType = entry.workPerformed;
      if (!acc[workType]) {
        acc[workType] = 0;
      }
      acc[workType] += Number(entry.hours) || 0;
      return acc;
    }, {});
  
    return (
      <div className="space-y-6">
  
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-blue-800">Time Entries Detail</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Performed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeEntries.map((entry, index) => (
                  <tr key={index} className="text-black hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{entry.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">{entry.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {entry.startTime} - {entry.endTime}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{entry.hours.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {workOptions.find(opt => opt.value === entry.workPerformed)?.label || entry.workPerformed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-semibold text-blue-800">Time Summary</h4>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium">
              Total: {totalHours.toFixed(2)} hours
            </div>
          </div>
  
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(workSummary).map(([work, hours]) => (
                <div key={work} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md">
                  <span className="text-gray-700">
                    {workOptions.find(opt => opt.value === work)?.label || work}
                  </span>
                  <span className="font-medium text-blue-600">{(hours as number).toFixed(2)} hrs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
      </div>
    );
  };