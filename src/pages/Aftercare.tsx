import React, { useState } from 'react';
import { AlertCircle, RotateCcw, Languages } from 'lucide-react';
import type { TriageResponse, TriageRequest } from '../types';

interface Props {
  assessment: TriageResponse;
  triageData: TriageRequest;
  onReset: () => void;
}

export default function Aftercare({ assessment, onReset }: Props) {
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  // Mocked content - this will come from your FastAPI backend
  const content = {
    en: {
      emotional: "Losing a pregnancy is difficult. Please know that this is not your fault and support is available.",
      danger: ["Heavy vaginal bleeding (soaking a pad in an hour)", "Severe abdominal pain or cramping", "Fever or chills", "Foul-smelling discharge", "Dizziness or fainting"],
      followUp: assessment.risk_level === 'HIGH' ? "SEEK CARE AT A HEALTH FACILITY TODAY." : "Monitor symptoms closely and visit a clinic if they worsen."
    },
    sw: {
      emotional: "Kupoteza ujauzito ni jambo gumu. Tafadhali jua kwamba hili si kosa lako na msaada upo.",
      danger: ["Kutokwa na damu nyingi (kulowesha pedi kwa saa moja)", "Maumivu makali ya tumbo", "Homa au baridi", "Uchafu wenye harufu mbaya", "Kizunguzungu au kuzimia"],
      followUp: assessment.risk_level === 'HIGH' ? "TAFUTA MATIBABU KATIKA KITUO CHA AFYA LEO." : "Fuatilia dalili kwa karibu na utembelee kliniki zikizidi."
    }
  };

  const activeContent = content[lang];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-aphrc-dark">Aftercare Support</h2>
        <button 
          onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md text-sm font-bold text-aphrc-dark hover:bg-gray-200"
        >
          <Languages size={18} />
          {lang === 'en' ? 'Switch to Swahili' : 'Badili kwa Kiingereza'}
        </button>
      </div>

      <div className="bg-aphrc-green/10 border border-aphrc-green/30 p-4 rounded-lg">
        <p className="text-gray-800 font-medium leading-relaxed">{activeContent.emotional}</p>
      </div>

      <div>
        <h3 className="font-bold text-risk-high flex items-center gap-2 mb-3">
          <AlertCircle size={20} /> Danger Signs (Dalili za Hatari)
        </h3>
        <ul className="space-y-2">
          {activeContent.danger.map((sign, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700 bg-red-50 p-3 rounded-md border border-red-100">
              <span className="text-risk-high font-bold">•</span> {sign}
            </li>
          ))}
        </ul>
      </div>

      <div className={`p-4 rounded-lg font-bold text-center ${assessment.risk_level === 'HIGH' ? 'bg-risk-high text-white animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
        {activeContent.followUp}
      </div>

      <button 
        onClick={onReset} 
        className="w-full mt-6 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-bold p-4 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <RotateCcw size={20} /> Start New Assessment
      </button>
    </div>
  );
}