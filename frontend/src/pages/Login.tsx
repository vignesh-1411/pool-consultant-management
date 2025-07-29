// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Token, UserRole } from "../types/Token";

const Login = () => {
  const { login } = useAuth(); // custom login handler from AuthContext
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }

      const rawData = await response.json();

      // Optional safety: Validate role is correct
      const validRoles = ["admin", "consultant"] as const;

      if (!validRoles.includes(rawData.role)) {
        throw new Error("Invalid role from server");
      }

      // Now tell TypeScript it's safe
      const role = rawData.role as UserRole;

      const data: Token = {
        access_token: rawData.access_token,
        token_type: rawData.token_type,
        user_id: Number(rawData.user_id),
        role, 
      };

      login(data.access_token, data.user_id,data.role);

      // const data: Token = await response.json();
      // login(data.access_token, data.role, data.user_id); // Save token & user info to context
      navigate("/dashboard"); // Redirect on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
