import axios from 'axios';
import type { TriageRequest, TriageResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Triage
export const assessRisk = (data: TriageRequest) =>
  api.post<TriageResponse>('/api/triage/assess', data);

// Facilities
export interface FacilityQuery {
  location: string;
  risk_level: string;
  slum_context: boolean;
}
export const findFacilities = (data: FacilityQuery) =>
  api.post('/api/facilities/find', data);

// Aftercare
export interface AftercareQuery {
  loss_type: string;
  gestational_age: number;
  risk_level: string;
  language: string;
}
export const getAftercare = (data: AftercareQuery) =>
  api.post('/api/aftercare/support', data);