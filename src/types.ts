// 1. Core Enumerations matching backend validation
export type LossType = 'Miscarriage' | 'Abortion' | 'Still Birth' | 'Refusal';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionType = 'REFER_NOW' | 'SCHEDULE_FOLLOWUP' | 'PROVIDE_INFO';
export type Language = 'en' | 'sw';

// 2. Request / Response Interfaces for Triage Assessment
export interface TriageRequest {
  loss_type: LossType;
  gestational_age: number; // Checked via backend validation (must be <= 9 or relevant weeks)
  place_of_incident: string;
  slum_context: boolean;
}

export interface TriageResponse {
  risk_score: number;       // Value between 0.0 and 1.0 (1 - P(formal care))
  risk_level: RiskLevel;
  message: string;
  action: ActionType;
  next_step: string;
}

// 3. Request / Response Interfaces for Facility Routing
export interface FacilityRequest {
  location: string;
  risk_level: RiskLevel;
  slum_context: boolean;
}

export interface Facility {
  id: string;
  name: string;
  distance_km: number;
  pac_capacity: 'High' | 'Medium' | 'Low';
  stock_status: 'Full' | 'Medium' | 'Low' | 'Out';
  available_services: string[];
  contact_number?: string;
  latitude?: number;
  longitude?: number;
  score?: number;
}

// 4. Request / Response Interfaces for Aftercare Module
export interface AftercareRequest {
  loss_type: LossType;
  risk_level: RiskLevel;
  language: Language;
}

export interface AftercareResponse {
  language: Language;
  emotional_support: string;
  physical_guidance: string;
  warning_signs: string[];   // Array of clinical danger signs
  follow_up_instructions: string;
  support_resources: string[];
}