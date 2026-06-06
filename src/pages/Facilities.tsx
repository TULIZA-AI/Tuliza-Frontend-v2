import React, { useEffect, useState } from 'react';
import { MapPin, Phone, AlertTriangle } from 'lucide-react';
import { findFacilities } from '../api/tuliza';
import type { TriageResponse, TriageRequest, Facility } from '../types';

interface Props {
  assessment: TriageResponse;
  triageData: TriageRequest;
  onNext:     () => void;
  onBack:     () => void;
}

export default function Facilities({ assessment, triageData, onNext, onBack }: Props) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await findFacilities({
          location:     triageData.place_of_incident || 'Nairobi non-slum',
          risk_level:   assessment.risk_level,
          slum_context: triageData.slum_context,
        });
        setFacilities(data.facilities);
      } catch {
        setError('Could not load facilities.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const riskStyles = {
    HIGH:   'bg-red-50 text-red-700 border-red-400',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-400',
    LOW:    'bg-green-50 text-green-700 border-green-400',
  };

  const stockColors: Record<string, string> = {
    Available: 'bg-green-100 text-green-700',
    Limited:   'bg-yellow-100 text-yellow-700',
    Out:       'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Risk banner */}
      <div className={`p-4 border-l-4 rounded-r-lg ${riskStyles[assessment.risk_level]}`}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={20}/>
          <h3 className="font-bold uppercase tracking-widest">
            {assessment.risk_level} RISK
          </h3>
        </div>
        <p className="text-sm font-medium mb-2">{assessment.message}</p>
        <div className="bg-white/80 p-2 rounded text-sm font-bold shadow-sm inline-block">
          Action: {assessment.action.replace(/_/g, ' ')}
        </div>
      </div>

      <h2 className="text-xl font-bold text-aphrc-dark border-b pb-2">
        Recommended Facilities
      </h2>

      {loading && (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-aphrc-green"
               viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm text-center py-4">{error}</p>
      )}

      <div className="space-y-4">
        {facilities.map((f) => (
          <div key={f.id}
               className="border border-gray-200 rounded-lg p-4 bg-white
                          shadow-sm hover:border-aphrc-green transition-colors">
            <h3 className="font-bold text-lg text-aphrc-dark">{f.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{f.type} · {f.level}</p>

            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-400"/> {f.distance_km} km
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold
                ${stockColors[f.stock_status] || 'bg-gray-100 text-gray-600'}`}>
                {f.stock_status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1
                               rounded font-semibold">
                PAC: {f.pac_capacity}
              </span>
              {f.services.slice(0, 2).map((s) => (
                <span key={s} className="bg-gray-50 text-gray-600 text-xs
                                         px-2 py-1 rounded border border-gray-100">
                  {s}
                </span>
              ))}
            </div>

            <a href={`tel:${f.phone}`}
               className="w-full mt-4 flex items-center justify-center gap-2
                          bg-gray-100 hover:bg-gray-200 text-aphrc-dark
                          font-semibold py-3 rounded-md transition-colors">
              <Phone size={16}/> {f.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onBack}
                className="w-1/3 p-4 bg-gray-100 text-gray-700
                           font-bold rounded-lg">
          Back
        </button>
        <button onClick={onNext}
                className="w-2/3 p-4 bg-aphrc-dark text-white font-bold
                           rounded-lg shadow-md hover:bg-black">
          View Aftercare →
        </button>
      </div>
    </div>
  );
}