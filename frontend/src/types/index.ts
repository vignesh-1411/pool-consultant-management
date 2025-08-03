export interface LoginFormData {
  email: string;
  password: string;
  role: 'admin' | 'consultant';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  role: 'admin' | 'consultant';
}
