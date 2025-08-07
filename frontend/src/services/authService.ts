import axios from 'axios';
import type { LoginFormData, AuthResponse, RegisterFormData } from '../types';

// const API_URL = 'http://127.0.0.1:8000'; // Change if needed

// export const loginUser = async (formData: LoginFormData): Promise<AuthResponse> => {
//   const response = await axios.post(`${API_URL}/login`, formData);
//   return response.data;
// };
const API_URL = 'http://localhost:8000';
export const loginUser = async (data: LoginFormData):Promise<AuthResponse> => {
  
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
    console.log('✅ Backend response:', response.data);
    

    return response.data;
  } catch (err: any) {
    console.error('❌ Login error:', err.response?.data || err.message);
    console.log("Sending login data:", data);
    throw err;
  }
};

export const registerUser = async (data: RegisterFormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (err: any) {
    console.error('❌ Registration error:', err.response?.data || err.message);
    throw err;
  }
};


