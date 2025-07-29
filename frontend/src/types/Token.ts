// types/Token.ts
// src/types/Token.ts
// This file defines the Token type for auth

// src/types/Token.ts
export type UserRole = "admin" | "consultant";

export interface Token {
  access_token: string;
  token_type: string;
  user_id: number;
  role: UserRole;
}

