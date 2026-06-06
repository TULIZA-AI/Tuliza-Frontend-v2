import React, { useState } from 'react';
import { Mic, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyseSymptoms } from '../api/tuliza';
import type { TriageRequest, LossType, NLPResult } from '../types';

// Add NLPResult to your types.ts too — shown below

interface Props {
  onSubmit: (data: TriageRequest) => void;
  loading?: boolean;
}

const PLACES = [
  'Within same DSA Slum',
  'Nairobi non-slum',
  'Non-DSA Nairobi slum',
  'Other DSA Nairobi slum',
  'Other Urban area of Kenya',
  'Rural Kenya',
];

const RISK_COLORS: Record<string, string> = {
  HIGH:   'bg-red-50 border-red-300 text-red-700',
  MEDIUM: 'bg-amber-50 border-amber-300 text-amber-700',
  LOW:    'bg-green-50 border-green-300 text-green-700',
};

const RISK_ICONS: Record<string, React.ReactNode> = {
  HIGH:   <AlertTriangle size={16} className="text-red-500 shrink-0"/>,
  MEDIUM: <AlertTriangle size={16} className="text-amber-500 shrink-0"/>,
  LOW:    <CheckCircle   size={16} className="text-green-500 shrink-0"/>,
};

export default function Triage({ onSubmit, loading = false }: Props) {
  const [formData, setFormData] = useState<TriageRequest>({
    loss_type:         'Miscarriage',
    gestational_age:   4,
    place_of_incident: 'Within same DSA Slum',
    slum_context:      true,
  });

  // NLP state
  const [symptomText, setSymptomText]   = useState('');
  const [nlpResult, setNlpResult]       = useState<NLPResult | null>(null);
  const [nlpLoading, setNlpLoading]     = useState(false);
  const [nlpError, setNlpError]         = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!symptomText.trim()) return;
    setNlpLoading(true);
    setNlpError(null);
    try {
      const { data } = await analyseSymptoms(symptomText);
      setNlpResult(data);
    } catch {
      setNlpError('Could not analyse symptoms. Check backend connection.');
    } finally {
      setNlpLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = `w-full p-3.5 border border-gray-300 rounded-lg bg-white
    text-aphrc-dark focus:ring-2 focus:ring-aphrc-green
    focus:border-aphrc-green outline-none transition-all text-sm`;
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-aphrc-dark">Clinical Triage</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Assess care-seeking risk for early pregnancy loss
        </p>
      </div>

      {/* ── NLP SYMPTOM ANALYSER ───────────────────────────────────────── */}
      <div className="bg-aphrc-green/5 border border-aphrc-green/20
                      rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Mic size={16} className="text-aphrc-green"/>
          <span className="text-xs font-bold text-aphrc-dark uppercase tracking-wide">
            AI Symptom Analyser
          </span>
          <span className="text-xs bg-aphrc-green text-white px-2 py-0.5
                           rounded-full font-semibold">NLP</span>
        </div>

        <p className="text-xs text-gray-500">
          Describe the patient's symptoms in English or Swahili.
          Our AI will assess urgency instantly.
        </p>

        <textarea
          rows={3}
          placeholder={
            "e.g. heavy bleeding and fever since yesterday...\n" +
            "SW: ana damu nyingi na homa kali sana..."
          }
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg bg-white
                     text-sm text-gray-800 focus:border-aphrc-green
                     focus:outline-none resize-none transition-colors
                     placeholder:text-gray-300"
        />

        <button type="button" onClick={handleAnalyse}
          disabled={nlpLoading || !symptomText.trim()}
          className="w-full py-2.5 bg-aphrc-green hover:bg-aphrc-dark
                     disabled:bg-gray-100 disabled:text-gray-400
                     text-white text-sm font-bold rounded-lg transition-colors">
          {nlpLoading
            ? <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Analysing…
              </span>
            : 'Analyse Symptoms →'
          }
        </button>

        {nlpError && (
          <p className="text-xs text-red-600">{nlpError}</p>
        )}

        {/* NLP Result */}
        {nlpResult && (
          <div className={`rounded-xl border p-3 space-y-2
                           ${RISK_COLORS[nlpResult.urgency]}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {RISK_ICONS[nlpResult.urgency]}
                <span className="font-bold text-sm">
                  {nlpResult.urgency} URGENCY
                </span>
              </div>
              <span className="text-xs opacity-70">
                {nlpResult.confidence > 0
                  ? `${(nlpResult.confidence * 100).toFixed(0)}% confidence`
                  : 'keyword match'
                }
              </span>
            </div>

            <p className="text-xs leading-relaxed">
              {nlpResult.recommendation}
            </p>

            {nlpResult.symptoms_detected.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {nlpResult.symptoms_detected.map((s, i) => (
                  <span key={i}
                    className="text-xs bg-white/60 border border-current/20
                               px-2 py-0.5 rounded-full opacity-80">
                    {s.clinical}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100"/>
        <span className="text-xs text-gray-400 font-medium">
          Complete clinical details below
        </span>
        <div className="flex-1 h-px bg-gray-100"/>
      </div>

      {/* ── STRUCTURED FORM ───────────────────────────────────────────── */}

      {/* Type of loss */}
      <div>
        <label className={labelClass}>Type of Loss</label>
        <select className={inputClass} value={formData.loss_type}
          onChange={(e) =>
            setFormData({ ...formData, loss_type: e.target.value as LossType })}>
          <option value="Miscarriage">Miscarriage</option>
          <option value="Abortion">Abortion</option>
          <option value="Still Birth">Still Birth</option>
          <option value="Refusal">Refusal of care</option>
        </select>
      </div>

      {/* Gestational age */}
      <div>
        <label className={labelClass}>
          Gestational Age —{' '}
          <span className="text-aphrc-green font-bold">
            {formData.gestational_age} months
          </span>
        </label>
        <input type="range" min="0.5" max="9" step="0.5"
          className="w-full accent-aphrc-green"
          value={formData.gestational_age}
          onChange={(e) =>
            setFormData({ ...formData, gestational_age: parseFloat(e.target.value) })}/>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5</span><span>9 months</span>
        </div>
      </div>

      {/* Place of incident */}
      <div>
        <label className={labelClass}>Where did the loss occur?</label>
        <select className={inputClass} value={formData.place_of_incident}
          onChange={(e) =>
            setFormData({ ...formData, place_of_incident: e.target.value })}>
          {PLACES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Slum context */}
      <div className="flex items-center gap-3 p-3.5 border border-gray-200
                      rounded-lg bg-gray-50 cursor-pointer"
           onClick={() =>
             setFormData({ ...formData, slum_context: !formData.slum_context })}>
        <div className={`w-5 h-5 rounded border-2 flex items-center
                         justify-center shrink-0 transition-colors
          ${formData.slum_context
            ? 'bg-aphrc-green border-aphrc-green'
            : 'border-gray-300 bg-white'}`}>
          {formData.slum_context && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </div>
        <label className="text-sm font-semibold text-gray-700 cursor-pointer">
          Patient is in a slum or informal settlement
        </label>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-aphrc-green disabled:bg-gray-200 disabled:text-gray-400
                   text-white font-bold text-base p-4 rounded-xl shadow-sm
                   hover:bg-aphrc-dark transition-colors">
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Assessing…
            </span>
          : 'Assess Risk Level →'
        }
      </button>
    </form>
  );
}