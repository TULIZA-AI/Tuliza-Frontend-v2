import React from 'react';
import { MapPin, Phone, AlertTriangle } from 'lucide-react';
import type { TriageResponse, TriageRequest, Facility } from '../types';

// 1. This is the exact interface TypeScript is looking for!
interface Props {
  assessment: TriageResponse;
  triageData: TriageRequest;
  onNext: () => void;
  onBack: () => void;
}

// Mock Data
const mockFacilities: Facility[] = [
  { id: '1', name: 'Kibera South Health Centre', distance_km: 1.2, pac_capacity: 'High', stock_status: 'Full', available_services: ['PAC', 'Emergency'] },
  { id: '2', name: 'Pumwani Maternity Hospital', distance_km: 3.5, pac_capacity: 'High', stock_status: 'Medium', available_services: ['PAC', 'Surgery'] }
];

// 2. Make sure : Props is attached here, and all 4 props are inside the brackets
export default function Facilities({ assessment, triageData, onNext, onBack }: Props) {
  
  // Dynamic styling based on APHRC clinical risk colors
  const riskStyles = {
    HIGH: "bg-risk-high/10 text-risk-high border-risk-high",
    MEDIUM: "bg-risk-medium/10 text-risk-medium border-risk-medium",
    LOW: "bg-risk-low/10 text-risk-low border-risk-low",
  };

  return (
    <div className="space-y-6">
      {/* Risk Badge Component */}
      <div className={`p-4 border-l-4 rounded-r-lg ${riskStyles[assessment.risk_level]}`}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={20} />
          <h3 className="font-bold uppercase tracking-widest">{assessment.risk_level} RISK</h3>
        </div>
        <p className="text-sm font-medium mb-3">{assessment.message}</p>
        <div className="bg-white/80 p-2 rounded text-sm font-bold shadow-sm inline-block">
          Action: {assessment.action.replace('_', ' ')}
        </div>
      </div>

      <h2 className="text-xl font-bold text-aphrc-dark border-b pb-2">Recommended Facilities</h2>
      
      <div className="space-y-4">
        {mockFacilities.map((facility) => (
          <div key={facility.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-aphrc-green transition-colors">
            <h3 className="font-bold text-lg text-aphrc-dark">{facility.name}</h3>
            
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400"/> {facility.distance_km} km away</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${facility.stock_status === 'Full' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                Stock: {facility.stock_status}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-semibold">PAC: {facility.pac_capacity}</span>
            </div>

            {assessment.risk_level === 'HIGH' && (
              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-aphrc-dark font-semibold py-3 rounded-md transition-colors">
                <Phone size={18} /> Call Facility
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="w-1/3 p-4 bg-gray-100 text-gray-700 font-bold rounded-lg">Back</button>
        <button onClick={onNext} className="w-2/3 p-4 bg-aphrc-dark text-white font-bold rounded-lg shadow-md hover:bg-black">View Aftercare</button>
      </div>
    </div>
  );
}