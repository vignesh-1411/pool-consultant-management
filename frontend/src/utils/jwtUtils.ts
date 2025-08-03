export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};


// import jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import works correctly



interface TokenPayload {
  email: string;
  role: 'admin' | 'consultant';
  user_id: number;
  exp: number;
}

export function getTokenPayload(): TokenPayload | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    
    const payload: TokenPayload = jwtDecode<TokenPayload>(token);
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
