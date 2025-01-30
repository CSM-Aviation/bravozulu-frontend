import React from 'react';
import { QuotePricing } from '../APIServices/apiService';

interface PricingBreakdownProps {
  pricing: QuotePricing;
}

type ServiceNameMapType = {
  [key: string]: string;
  tripReady: string;
  basic: string;
  basicPlus: string;
  complete: string;
  wetWash: string;
  dryWash: string;
  waxing: string;
  brightwork: string;
  boots: string;
  gearWells: string;
  carpetExtraction: string;
  leatherReconditioning: string;
  stainRemoval: string;
};

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ pricing }) => {
  if (!pricing || (!pricing.breakdown.exterior.length && !pricing.breakdown.interior.length)) {
    return null;
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const serviceNameMap: ServiceNameMapType = {
    tripReady: 'Trip Ready',
    basic: 'Basic',
    basicPlus: 'Basic Plus',
    complete: 'Complete',
    wetWash: 'Wet Wash',
    dryWash: 'Dry Wash',
    waxing: 'Waxing/Buffing',
    brightwork: 'Brightwork Polishing',
    boots: 'Boot Treatment',
    gearWells: 'Gear Wells',
    carpetExtraction: 'Carpet Extraction',
    leatherReconditioning: 'Leather Reconditioning',
    stainRemoval: 'Stain Removal'
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Service Pricing Breakdown</h2>
      <div className="space-y-6">
        {pricing.breakdown.exterior.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Exterior Services</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {pricing.breakdown.exterior.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{serviceNameMap[item.service] || item.service}</span>
                  <span className="font-medium">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pricing.breakdown.interior.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Interior Services</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {pricing.breakdown.interior.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{serviceNameMap[item.service] || item.service}</span>
                  <span className="font-medium">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(pricing.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;