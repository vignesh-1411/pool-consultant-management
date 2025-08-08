import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Brain, 
  FileText, 
  Calendar, 
  Target, 
  GraduationCap,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Bot,
  Search,
  Download,
  Eye,
  Activity
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-105">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
              Pool Consultant Management System
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              An intelligent workforce management platform designed to streamline the administration of consultant pools. 
              By integrating AI-powered agents, it automates key processes, provides data-driven insights, and enhances 
              both consultant engagement and operational efficiency.
            </p>
            
            {/* <div className="flex items-center justify-center space-x-2 mb-12">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-gray-700">Powered by Google's Gemini AI Models</span>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div> */}
            
            <button
              onClick={handleGetStarted}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3 mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Key Features & Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools for both consultants and administrators
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Consultant Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-10 shadow-xl border border-blue-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">For Consultants</h3>
                  <p className="text-gray-600">Personalized dashboard and insights</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Real-Time Status Dashboard</h4>
                    <p className="text-gray-600">Track resume status, attendance, opportunities, and training progress</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Workflow Progress Bar</h4>
                    <p className="text-gray-600">Visual progress tracking for key action items and milestones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">AI-Powered Chatbot</h4>
                    <p className="text-gray-600">Get instant answers and personalized recommendations</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Admin Features */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-10 shadow-xl border border-green-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-16 w-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">For Administrators</h3>
                  <p className="text-gray-600">Comprehensive management console</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Advanced Search & Filters</h4>
                    <p className="text-gray-600">Find consultants by skills, department, status, and more</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Report Generation</h4>
                    <p className="text-gray-600">Generate detailed reports for individual consultants or departments</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Framework Monitoring</h4>
                    <p className="text-gray-600">View AI agent queues, latencies, and error rates in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* AI Agents Section */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900">AI-Powered Agent Framework</h2>
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized AI agents working together to automate and optimize consultant management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume Agent</h3>
              <p className="text-gray-600 mb-4">Analyzes resumes using Gemini AI to extract skills and generate proficiency ratings</p>
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-semibold">
                <CheckCircle className="h-4 w-4" />
                <span>Skill Vector Generation</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Agent</h3>
              <p className="text-gray-600 mb-4">Correlates meeting attendance data to generate comprehensive reports</p>
              <div className="flex items-center space-x-2 text-sm text-green-600 font-semibold">
                <CheckCircle className="h-4 w-4" />
                <span>Automated Tracking</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Opportunity Agent</h3>
              <p className="text-gray-600 mb-4">Tracks and documents opportunities to ensure consultant engagement</p>
              <div className="flex items-center space-x-2 text-sm text-purple-600 font-semibold">
                <CheckCircle className="h-4 w-4" />
                <span>Smart Matching</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Training Agent</h3>
              <p className="text-gray-600 mb-4">Records and analyzes training data to identify skill gaps and growth</p>
              <div className="flex items-center space-x-2 text-sm text-orange-600 font-semibold">
                <CheckCircle className="h-4 w-4" />
                <span>Certificate Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Technology Stack */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900">Powered by Advanced AI</h2>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology for maximum performance and reliability
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Google Gemini AI</h3>
                <p className="text-gray-600">Advanced language models for intelligent document analysis and insights</p>
              </div>
              
              <div className="text-center">
                <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Agent Framework</h3>
                <p className="text-gray-600">Specialized AI agents working in harmony for optimal performance</p>
              </div>
              
              <div className="text-center">
                <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Analytics</h3>
                <p className="text-gray-600">Live data processing and insights for immediate decision making</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Consultant Management?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join the future of intelligent workforce management with AI-powered automation, 
            real-time insights, and seamless collaboration.
          </p>
          
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-6 w-6" />
          </button>
          
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Pool Consultant Management</span>
          </div>
          <p className="text-gray-400">
            © 2025 Hexaware Technologies Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;