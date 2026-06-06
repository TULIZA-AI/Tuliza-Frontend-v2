import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw, Languages } from 'lucide-react';
import { getAftercare } from '../api/tuliza';
import type { TriageResponse, TriageRequest, AftercareContent } from '../types';

interface Props {
  assessment: TriageResponse;
  triageData: TriageRequest;
  onReset:    () => void;
}

export default function Aftercare({ assessment, triageData, onReset }: Props) {
  const [lang, setLang]       = useState<'en' | 'sw'>('en');
  const [data, setData]       = useState<AftercareContent | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (l: 'en' | 'sw') => {
    setLoading(true);
    try {
      const { data: res } = await getAftercare({
        loss_type:       triageData.loss_type,
        gestational_age: triageData.gestational_age,
        risk_level:      assessment.risk_level,
        language:        l,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(lang); }, [lang]);

  if (loading) return (
    <div className="flex justify-center py-12">
      <svg className="animate-spin h-8 w-8 text-aphrc-green"
           viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-aphrc-dark">Aftercare Support</h2>
        <button onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2
                     rounded-md text-sm font-bold text-aphrc-dark hover:bg-gray-200">
          <Languages size={18}/>
          {lang === 'en' ? 'Swahili' : 'English'}
        </button>
      </div>

      {data && (
        <>
          {/* Emotional support */}
          <div className="bg-aphrc-green/10 border border-aphrc-green/30
                          p-4 rounded-lg">
            <p className="text-gray-800 font-medium leading-relaxed">
              {data.emotional_support}
            </p>
          </div>

          {/* Physical care */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2 text-sm uppercase tracking-wide">
              🩺 Physical Care
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              {data.physical_guidance}
            </p>
          </div>

          {/* Danger signs */}
          <div>
            <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
              <AlertCircle size={20}/> Danger Signs
            </h3>
            <ul className="space-y-2">
              {data.warning_signs.map((sign, i) => (
                <li key={i}
                    className="flex gap-2 text-sm text-gray-700 bg-red-50
                               p-3 rounded-md border border-red-100">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow-up */}
          <div className={`p-4 rounded-lg font-bold text-center
            ${assessment.risk_level === 'HIGH'
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-gray-100 text-gray-800'}`}>
            {data.follow_up}
          </div>

          {/* Resources */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <h3 className="font-bold text-gray-700 text-sm uppercase
                           tracking-wide mb-2">📞 Support Resources</h3>
            <ul className="space-y-1">
              {data.resources.map((r, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-aphrc-green shrink-0">→</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <button onClick={onReset}
        className="w-full mt-4 flex items-center justify-center gap-2
                   border-2 border-gray-200 text-gray-600 font-bold p-4
                   rounded-lg hover:bg-gray-50 transition-colors">
        <RotateCcw size={20}/> Start New Assessment
      </button>
    </div>
  );
}