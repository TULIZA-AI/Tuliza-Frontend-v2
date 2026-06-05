import axios from 'axios';
import type {
  TriageRequest, TriageResponse,
  FacilityRequest, Facility,
  AftercareRequest, AftercareResponse
} from '../types';

// Retrieve the base URL dynamically based on environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tulizaApi = {
  /**
   * Checks backend health status and confirms model is loaded
   */
  checkHealth: async (): Promise<{ status: string; model_auc: number; model_recall: number }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  /**
   * step 1: Submit clinical information to run model inference
   */
  assessRisk: async (data: TriageRequest): Promise<TriageResponse> => {
    const response = await apiClient.post<TriageResponse>('/api/triage/assess', data);
    return response.data;
  },

  /**
   * Step 2: Retrieve a prioritized list of up to 4 nearby health facilities
   */
  findFacilities: async (data: FacilityRequest): Promise<Facility[]> => {
    const response = await apiClient.post<Facility[]>('/api/facilities/find', data);
    return response.data;
  },

  /**
   * Step 3: Fetch tailored emotional, physical, and emergency aftercare text
   */
  getAftercare: async (data: AftercareRequest): Promise<AftercareResponse> => {
    const response = await apiClient.post<AftercareResponse>('/api/aftercare/support', data);
    return response.data;
  },
};