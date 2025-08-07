// // src/components/RegisterPage.tsx


import React, { useState } from 'react';
import { Mail, Lock, UserPlus, Briefcase, Tag, User, Shield, Building, Sparkles } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('consultant'); // Default role
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
   
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          department,
          skills: skills.split(',').map(s => s.trim()),
        }),
      });

      const data = await response.json();

       if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
      } else {
        // --- FIX HERE ---
        // Check if data.detail is an array of validation errors
        if (Array.isArray(data.detail)) {
          // Join the messages into a single string
          const errorMessages = data.detail.map((err:any) => err.msg).join('; ');
          setError(errorMessages || 'Registration failed due to validation errors.');
        } else {
          // If it's a simple string or an object with a message, display it
          setError(data.detail || data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Create an Account
          </h2>
          <p className="text-gray-600 text-lg flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>Join the Pool Consultant Management system</span>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </p>
        </div>
        
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl relative mb-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-500" />
                <span>Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-500" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-500" />
                <span>Confirm Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span>Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              >
                <option value="consultant">Consultant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center space-x-2">
                <Building className="h-4 w-4 text-green-500" />
                <span>Department</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                required
              >
                <option value="">Select Department</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Fullstack Development">Fullstack Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-2 text-gray-700 text-sm font-bold mb-3">
              <Tag className="h-4 w-4 text-orange-500" />
              <span>Skills (comma-separated)</span>
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
              placeholder="e.g., React, TypeScript, Python"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-200 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;