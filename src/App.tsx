import React, { useState } from 'react';
import { ShieldAlert, Activity, HeartHandshake } from 'lucide-react';
import Triage from './pages/Triage';
import Facilities from './pages/Facilities';
import Aftercare from './pages/Aftercare';
import type { TriageRequest, TriageResponse } from './types';

// Simple Header Component
const Header = () => (
  <header className="bg-aphrc-dark text-white p-4 shadow-md sticky top-0 z-50">
    <div className="max-w-md mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Tuliza AI</h1>
        <p className="text-aphrc-green text-xs font-semibold uppercase">APHRC Clinical Navigator</p>
      </div>
      <ShieldAlert className="text-aphrc-green w-8 h-8" />
    </div>
  </header>
);

// Step Indicator Component
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-between items-center mb-6 px-4">
    {[
      { step: 1, label: 'Triage', icon: Activity },
      { step: 2, label: 'Routing', icon: ShieldAlert },
      { step: 3, label: 'Aftercare', icon: HeartHandshake }
    ].map((s) => {
      const active = currentStep >= s.step;
      return (
        <div key={s.step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${active ? 'bg-aphrc-green text-white' : 'bg-gray-200 text-gray-400'}`}>
            <s.icon size={20} />
          </div>
          <span className={`text-xs font-semibold ${active ? 'text-aphrc-dark' : 'text-gray-400'}`}>{s.label}</span>
        </div>
      );
    })}
  </div>
);

// THIS IS THE MAIN APP COMPONENT THAT WAS MISSING
export default function App() {
  const [step, setStep] = useState<number>(1);
  const [triageData, setTriageData] = useState<TriageRequest | null>(null);
  const [assessment, setAssessment] = useState<TriageResponse | null>(null);

  // Mock function to simulate API call
  const handleTriageSubmit = async (data: TriageRequest) => {
    setTriageData(data);
    // MOCK RESPONSE: Simulating a High Risk result for testing
    setAssessment({
      risk_score: 0.85,
      risk_level: 'HIGH',
      message: 'High risk of complications. Formal care is strongly advised.',
      action: 'REFER_NOW',
      next_step: 'Proceed to facility routing.'
    });
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-surface font-sans pb-10">
      <Header />
      <main className="max-w-md mx-auto pt-6 px-4">
        <StepIndicator currentStep={step} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {step === 1 && <Triage onSubmit={handleTriageSubmit} />}
          {step === 2 && assessment && triageData && (
            <Facilities 
              assessment={assessment} 
              triageData={triageData} 
              onNext={() => setStep(3)} 
              onBack={() => setStep(1)} 
            />
          )}
          {step === 3 && assessment && triageData && (
            <Aftercare 
              assessment={assessment} 
              triageData={triageData} 
              onReset={() => { setStep(1); setTriageData(null); setAssessment(null); }} 
            />
          )}
        </div>
      </main>
    </div>
  );
}