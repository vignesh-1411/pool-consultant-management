export interface LoginFormData {
  email: string;
  password: string;
  role: 'admin' | 'consultant';
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'consultant';
  department: string;
  skills: string[]; // or comma-separated string you split before sending
}


export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  role: 'admin' | 'consultant';
}
