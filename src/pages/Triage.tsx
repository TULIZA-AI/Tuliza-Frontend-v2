import React, { useState } from 'react';
import type { TriageRequest, LossType } from '../types';

interface Props {
  onSubmit: (data: TriageRequest) => void;
}

export default function Triage({ onSubmit }: Props) {
  const [formData, setFormData] = useState<TriageRequest>({
    loss_type: 'Miscarriage',
    gestational_age: 4,
    place_of_incident: 'Home',
    slum_context: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-aphrc-dark focus:ring-2 focus:ring-aphrc-green focus:border-aphrc-green outline-none transition-all";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-aphrc-dark mb-4">Clinical Triage</h2>

      <div>
        <label className={labelClass}>Type of Loss</label>
        <select 
          className={inputClass}
          value={formData.loss_type}
          onChange={(e) => setFormData({ ...formData, loss_type: e.target.value as LossType })}
        >
          <option value="Miscarriage">Miscarriage</option>
          <option value="Abortion">Abortion</option>
          <option value="Still Birth">Still Birth</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Gestational Age (Weeks)</label>
        <input 
          type="number" 
          min="1" max="20"
          className={inputClass}
          value={formData.gestational_age}
          onChange={(e) => setFormData({ ...formData, gestational_age: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <input 
          type="checkbox" 
          id="slum_context"
          className="w-6 h-6 text-aphrc-green rounded focus:ring-aphrc-green"
          checked={formData.slum_context}
          onChange={(e) => setFormData({ ...formData, slum_context: e.target.checked })}
        />
        <label htmlFor="slum_context" className="text-sm font-semibold text-gray-700 leading-tight">
          Patient is located in a slum or informal settlement
        </label>
      </div>

      <button 
        type="submit" 
        className="w-full bg-aphrc-green text-white font-bold text-lg p-4 rounded-lg shadow-md hover:bg-aphrc-dark transition-colors mt-4"
      >
        Assess Risk Level
      </button>
    </form>
  );
}