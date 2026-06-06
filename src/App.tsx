import React, { useState } from 'react';
import { ShieldAlert, Activity, HeartHandshake } from 'lucide-react';
import Triage from './pages/Triage';
import Facilities from './pages/Facilities';
import Aftercare from './pages/Aftercare';
import { assessRisk } from './api/tuliza';
import type { TriageRequest, TriageResponse } from './types';

const Header = () => (
  <header className="bg-aphrc-dark text-white p-4 shadow-md sticky top-0 z-50">
    <div className="max-w-md mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Tuliza AI</h1>
        <p className="text-aphrc-green text-xs font-semibold uppercase">
          APHRC Clinical Navigator
        </p>
      </div>
      <ShieldAlert className="text-aphrc-green w-8 h-8" />
    </div>
  </header>
);

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-between items-center mb-6 px-4">
    {[
      { step: 1, label: 'Triage',    icon: Activity       },
      { step: 2, label: 'Routing',   icon: ShieldAlert    },
      { step: 3, label: 'Aftercare', icon: HeartHandshake },
    ].map((s) => {
      const active = currentStep >= s.step;
      return (
        <div key={s.step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                           mb-1 transition-colors
            ${active ? 'bg-aphrc-green text-white' : 'bg-gray-200 text-gray-400'}`}>
            <s.icon size={20} />
          </div>
          <span className={`text-xs font-semibold
            ${active ? 'text-aphrc-dark' : 'text-gray-400'}`}>
            {s.label}
          </span>
        </div>
      );
    })}
  </div>
);

export default function App() {
  const [step, setStep]           = useState<number>(1);
  const [triageData, setTriageData] = useState<TriageRequest | null>(null);
  const [assessment, setAssessment] = useState<TriageResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleTriageSubmit = async (data: TriageRequest) => {
    setLoading(true);
    setError(null);
    try {
      // Map frontend field names to backend field names
      const payload = {
        type_of_loss:    data.loss_type,
        gestational_age: data.gestational_age,
        place_of_loss:   data.place_of_incident || 'Within same DSA Slum',
        slum_resident:   data.slum_context ? 'Slum' : 'Non-slum',
      };
      const { data: result } = await assessRisk(payload as any);
      setTriageData(data);
      setAssessment(result);
      setStep(2);
    } catch (err) {
      setError('Could not reach backend. Make sure it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setTriageData(null);
    setAssessment(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface font-sans pb-10">
      <Header />
      <main className="max-w-md mx-auto pt-6 px-4">
        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200
                          rounded-lg text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {step === 1 && (
            <Triage onSubmit={handleTriageSubmit} />
          )}
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
              onReset={reset}
            />
          )}
        </div>
      </main>
    </div>
  );
}