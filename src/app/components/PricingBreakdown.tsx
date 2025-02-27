import React from 'react';
import { QuoteServices } from '../APIServices/apiService';



interface PricingBreakdownProps {
  serviceDetails?: QuoteServices;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ serviceDetails }) => {
  if (!serviceDetails || !serviceDetails.services.length) {
    return null;
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  // Group services by type
  const exteriorServices = serviceDetails.services.filter(service => service.type === 'exterior');
  const interiorServices = serviceDetails.services.filter(service => service.type === 'interior');

  return (
    <div className="mt-8">
      <h2 className="text-lg text-black font-semibold mb-4">Service Pricing Breakdown</h2>
      <div className="space-y-6">
        {exteriorServices.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Exterior Services</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {exteriorServices.map((item, index) => (
                <div key={index} className="flex text-black justify-between text-sm">
                  <span>{item.displayName}</span>
                  <span className="font-medium">{formatPrice(item.price || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {interiorServices.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Interior Services</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {interiorServices.map((item, index) => (
                <div key={index} className="flex text-black justify-between text-sm">
                  <span>{item.displayName}</span>
                  <span className="font-medium">{formatPrice(item.price || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {serviceDetails.totalPrice !== undefined && (
          <div className="border-t text-black pt-4 mt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(serviceDetails.totalPrice)}</span>
            </div>
          </div>
        )}

        {serviceDetails.specialRequests && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Special Requests</h3>
            <div className="bg-gray-50 text-black rounded-lg p-4 text-sm">
              {serviceDetails.specialRequests}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingBreakdown;