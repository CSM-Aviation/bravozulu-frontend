import { CheckSquare } from "lucide-react";
import { Service } from "../APIServices/apiService";

export const ServicesList = ({ services }: { services: Service[] }) => {
    // Separate services by type
    const exteriorServices = services.filter((service: Service) => service.type === 'exterior');
    const interiorServices = services.filter((service: Service) => service.type === 'interior');
  
    if (services.length === 0) {
      return <div className="text-gray-500 italic text-center py-4">No services completed</div>;
    }
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exterior Services */}
          {exteriorServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-blue-800">Exterior Services</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {exteriorServices.map((service) => (
                  <div
                    key={service.name}
                    className="px-4 py-3 flex justify-between items-center"
                  >
                    <span className="text-gray-700">{service.displayName}</span>
                    <CheckSquare className="h-5 w-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Interior Services */}
          {interiorServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-blue-800">Interior Services</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {interiorServices.map((service) => (
                  <div
                    key={service.name}
                    className="px-4 py-3 flex justify-between items-center"
                  >
                    <span className="text-gray-700">{service.displayName}</span>
                    <CheckSquare className="h-5 w-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };