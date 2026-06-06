import React, { useState } from 'react';
import type { TriageRequest, LossType } from '../types';

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

export default function Triage({ onSubmit, loading = false }: Props) {
  const [formData, setFormData] = useState<TriageRequest>({
    loss_type:         'Miscarriage',
    gestational_age:   4,
    place_of_incident: 'Within same DSA Slum',
    slum_context:      true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = `w-full p-4 border border-gray-300 rounded-lg bg-white
    text-aphrc-dark focus:ring-2 focus:ring-aphrc-green
    focus:border-aphrc-green outline-none transition-all`;
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-aphrc-dark mb-4">Clinical Triage</h2>

      {/* Type of loss */}
      <div>
        <label className={labelClass}>Type of Loss</label>
        <select className={inputClass} value={formData.loss_type}
          onChange={(e) => setFormData({ ...formData, loss_type: e.target.value as LossType })}>
          <option value="Miscarriage">Miscarriage</option>
          <option value="Abortion">Abortion</option>
          <option value="Still Birth">Still Birth</option>
          <option value="Refusal">Refusal of care</option>
        </select>
      </div>

      {/* Gestational age */}
      <div>
        <label className={labelClass}>
          Gestational Age (Months) —{' '}
          <span className="text-aphrc-green">{formData.gestational_age} mo</span>
        </label>
        <input type="range" min="0.5" max="9" step="0.5"
          className="w-full accent-aphrc-green"
          value={formData.gestational_age}
          onChange={(e) => setFormData({
            ...formData, gestational_age: parseFloat(e.target.value)
          })}/>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5</span><span>9 months</span>
        </div>
      </div>

      {/* Place of incident */}
      <div>
        <label className={labelClass}>Where did the loss occur?</label>
        <select className={inputClass} value={formData.place_of_incident}
          onChange={(e) => setFormData({ ...formData, place_of_incident: e.target.value })}>
          {PLACES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Slum context */}
      <div className="flex items-center space-x-3 p-4 border border-gray-200
                      rounded-lg bg-gray-50">
        <input type="checkbox" id="slum_context"
          className="w-6 h-6 text-aphrc-green rounded focus:ring-aphrc-green"
          checked={formData.slum_context}
          onChange={(e) => setFormData({ ...formData, slum_context: e.target.checked })}/>
        <label htmlFor="slum_context" className="text-sm font-semibold
                                                  text-gray-700 leading-tight">
          Patient is located in a slum or informal settlement
        </label>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-aphrc-green disabled:bg-gray-300 text-white
                   font-bold text-lg p-4 rounded-lg shadow-md
                   hover:bg-aphrc-dark transition-colors mt-4">
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
          : 'Assess Risk Level'
        }
      </button>
    </form>
  );
}