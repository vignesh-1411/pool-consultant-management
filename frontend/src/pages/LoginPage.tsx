

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Waves } from 'lucide-react';
import { loginUser } from '../services/authService';
import type { LoginFormData } from '../types';
import axios from 'axios'; // Register call will use this

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: '' as 'admin' | 'consultant',
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  // const [errors, setErrors] = useState<{ [key in keyof LoginFormData]?: string }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    // if (!formData.role) {
    //   newErrors.role = 'Please select a role';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await loginUser(formData);

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_id', response.user_id.toString());


      const dashboardPath =
        response.role === 'admin' ? '/admin/dashboard' : '/consultant/dashboard';

      navigate(dashboardPath);
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pool Consultant Management
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="space-y-3">
                {['admin', 'consultant'].map(role => (
                  <label
                    key={role}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      formData.role === role
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.role === role ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {formData.role === role && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="text-gray-800 capitalize">{role}</div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-sm text-red-600 mt-2">{errors.role}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                {/* ... your login form ... */}
                <p className="mt-4 text-center text-gray-600">
                  Don't have an account?{' '}
                  <a href="/register" className="text-blue-600 hover:underline"> 
                    Register here
                  </a>
                </p>
              </div>
          
        </div>
          <div className="mt-6 text-center text-sm text-gray-600">
            Need help? Contact your system administrator.
          </div>
          

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 Pool Consultant Management. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;





