export type LossType = 'Miscarriage' | 'Abortion' | 'Still Birth' | 'Refusal';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TriageRequest {
  loss_type:          LossType;
  gestational_age:    number;
  place_of_incident:  string;
  slum_context:       boolean;
}

export interface TriageResponse {
  risk_score:       number;
  risk_level:       RiskLevel;
  risk_percent:     number;
  seek_formal_care: boolean;
  message:          string;
  action:           string;
  next_step:        string;
}

export interface Facility {
  id:           number;
  name:         string;
  type:         string;
  level:        string;
  location:     string;
  distance_km:  number;
  pac_capacity: 'High' | 'Medium' | 'Low';
  phone:        string;
  services:     string[];
  stock_status: 'Available' | 'Limited' | 'Out';
}

export interface AftercareContent {
  language:          string;
  emotional_support: string;
  physical_guidance: string;
  warning_signs:     string[];
  follow_up:         string;
  resources:         string[];
}
export interface NLPResult {
  input_text:        string;
  urgency:           string;
  confidence:        number;
  symptoms_detected: { term: string; flag: string; clinical: string }[];
  nlp_label:         string;
  keyword_count:     number;
  recommendation:    string;
}