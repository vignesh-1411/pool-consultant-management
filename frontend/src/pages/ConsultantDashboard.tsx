// // src/pages/ConsultantDashboard.tsx
import ChatBot from '../components/ChatBot';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  FileText, 
  Calendar, 
  Target, 
  X,
  GraduationCap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Upload,
  Award,
  ExternalLink,
  Star,
  BookOpen,
  Zap,
  Activity,
  Brain,
  Sparkles
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import ResumeUpload from '../components/ResumeUpload';

interface DashboardStats {
  skills: { skill: string; proficiency: number }[]; // updated from string[]
  resumeStatus: 'updated' | 'pending';
  attendanceRate: number;
  opportunitiesCount: number;
  trainingProgress: 'not_started' | 'in_progress' | 'completed';
  workflowProgress: number;
}

interface TrainingRecommendation {
  skill: string;
  course_title: string;
  platform: string;
  link: string;
  reason: string;
}

const API_URL = import.meta.env.VITE_API_URL;

  interface Opportunity {
  id: number;
  title: string;
  client: string;
  description: string;
  }

const ConsultantDashboard: React.FC = () => {

  const [showOpportunitiesModal, setShowOpportunitiesModal] = useState(false);

  const opportunities: Opportunity[] = [
    {
      id: 1,
      title: 'Frontend Developer for E-commerce',
      client: 'Retail Innovators Inc.',
      description: 'We are looking for a skilled Frontend Developer with expertise in React and Tailwind CSS to build our next-generation e-commerce platform. This role involves developing responsive user interfaces and optimizing performance.',
    },
    {
      id: 3,
      title: 'Fullstack Engineer for Fintech Project',
      client: 'Fintech Nexus',
      description: 'Seeking a Fullstack Engineer proficient in Python (FastAPI) and TypeScript to work on a secure financial application. The role includes both backend API development and frontend integration.',
    },
  ];

  

  const [stats, setStats] = useState<DashboardStats>({
    skills: [],
    resumeStatus: 'updated',
    attendanceRate: 85,
    opportunitiesCount: 3,
    trainingProgress: 'in_progress',
    workflowProgress: 75
  });
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  


  interface Training {
  title: string;
  provider: string;
  completedDate: string;
}

const [completedTrainings, setCompletedTrainings] = useState<Training[]>([]);
const [showAllTrainings, setShowAllTrainings] = useState(false);
const visibleTrainings = showAllTrainings ? completedTrainings : completedTrainings.slice(0, 4);

useEffect(() => {
  const fetchCompletedTrainings = async () => {
    const userId = localStorage.getItem("user_id"); // get from storage

    try {
      const response = await axios.get(
        `${API_URL}/consultants/${userId}/completed-trainings`
      );

      // Ensure it's an array before setting
      const data = Array.isArray(response.data) ? response.data : [];
      setCompletedTrainings(data);
    } catch (error) {
      console.error("Error fetching completed trainings:", error);
      setCompletedTrainings([]); // fallback to prevent crash
    }
  };

  fetchCompletedTrainings();
}, []);


  


  

  
  
  const userId = localStorage.getItem("user_id");
  const resumeUrl = `${API_URL}/consultants/${userId}/resume`;

 
  useEffect(() => {
  if (!userId) return;
  fetchDashboardData();
  fetchSkills();
  fetchUserName();
  fetchTrainingRecommendations();
}, []);

// const [recommendations, setRecommendations] = useState([]);
useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`/consultants/${userId}/training-recommendations/`);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error("Error fetching training recommendations:", error);
    }
  };

  fetchRecommendations();
}, [userId]);

const fetchSkills = async () => {
  try {
    const res = await fetch(`${API_URL}/consultant/${userId}/skills`);
    const data = await res.json();

    const skillNames = data.map((item: { skill: string }) => item.skill);
    setStats(prev => ({
    ...prev,
    skills: data // data is already an array of { skill, proficiency }
    }));

  } catch (error) {
    console.error("Error fetching skills", error);
  }
};







  const fetchDashboardData = async () => {
  try {
    const res = await fetch(`${API_URL}/consultants/${userId}/dashboard`);
    const data = await res.json();

    setStats(prev => ({
      ...prev,
      resumeStatus: data.resumeStatus,
      attendanceRate: data.attendanceRate,
      opportunitiesCount: data.opportunitiesCount,
      trainingProgress: data.trainingProgress,
      workflowProgress: data.workflowProgress
    }));

    // setCompletedTrainings(data.completedTrainings || []);
  } catch (error) {
    console.error("Error fetching dashboard data", error);
  }
};

  

  

  const fetchTrainingRecommendations = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return;

  try {
    const response = await axios.get(`${API_URL}/consultants/${userId}/training-recommendations`);
    setRecommendations(response.data.recommendations); // assuming the response is { "recommendations": [ "Course A", "Course B", ... ] }
  } catch (error) {
    console.error("Failed to fetch training recommendations:", error);
  }
};
const handleCertificateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !userId) return;

  const formData = new FormData();
  formData.append("certificate", file);

  try {
    const response = await fetch(`${API_URL}/consultants/${userId}/upload-certificate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    alert("Certificate uploaded and parsed successfully!");
    console.log("Certificate upload response:", result);

    // Optional: Update state to reflect new completed trainings
    setCompletedTrainings(result);  // if response is array of trainings
  } catch (error) {
    console.error("Certificate upload error:", error);
    alert("Failed to upload certificate. Please try again.");
  }
};



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'updated':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const workflowSteps = [
    { name: 'Resume Updated', completed: stats.resumeStatus === 'updated' },
    { name: 'Attendance Reported', completed: stats.attendanceRate > 80 },
    { name: 'Opportunities Documented', completed: stats.opportunitiesCount > 0 },
    { name: 'Training Completed', completed: stats.trainingProgress === 'in_progress' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200';
    }
  };
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const fetchUserName = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/consultant/${userId}`);
    const data = await res.json();

    // Access name from profile
    const name = data.profile?.name || '';
    setUserName(name);
  } catch (error) {
    console.error("Error fetching user name:", error);
  }

  

};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome back{userName ? `, ${userName}` : ''}!
              </h1> 
              <p className="text-gray-600 mt-2 text-lg">Track your professional development and engagement status</p>
            </div>
          </div>
        </div>

        {/* Current Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                
                <div
                  // className="bg-white p-4 shadow rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => setShowSkillsModal(true)}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">Skills</h2>
                      <p className="text-sm text-gray-500">Click to view details</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.skills.slice(0, 2).map((item, index) => (
                      <span key={index} className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium border border-indigo-200">
                        {item.skill}
                      </span>
                    ))}
                    {stats.skills.length > 2 && (
                      <span className="text-xs bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200">
                        +{stats.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
            {showSkillsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-w-md mx-4 transform transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Skill Proficiency</h2>
                    </div>
                    <button 
                      onClick={() => setShowSkillsModal(false)} 
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                  <ul className="space-y-4 max-h-80 overflow-y-auto">
                    {stats.skills.map((item, index) => (
                      <li key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{item.skill}</span>
                          <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                            {item.proficiency}/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full shadow-sm transition-all duration-500"
                            style={{ width: `${(item.proficiency / 10) * 100}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Opportunities Modal */}
            {showOpportunitiesModal && (
              // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                {/* <div className="bg-white rounded-lg shadow-xl p-8 w-[1900px] h-[200px] overflow-y-auto"> */}
                <div className="bg-white p-8 rounded-2xl shadow-2xl 
                    w-[80vw] aspect-[16/9] 
                    max-w-[90vw] max-h-[90vh] 
                    overflow-y-auto 
                    transform transition-all duration-300">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Available Opportunities</h2>
                    <button onClick={() => setShowOpportunitiesModal(false)} className="text-gray-500 hover:text-gray-800">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Opportunities List */}
                  <div className="space-y-6">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{opportunity.title}</h3>
                          <span className="text-sm font-medium text-gray-500">{opportunity.client}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{opportunity.description}</p>
                        <div className="flex justify-end">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Submit/Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}



            
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Resume Status</h3>
                  <p className="text-sm text-gray-500">Document management</p>
                </div>
              </div>
              {getStatusIcon(stats.resumeStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 capitalize bg-gradient-to-r from-gray-100 to-slate-100 px-0 py-1.5 rounded-lg border border-gray-200">
                {stats.resumeStatus.replace('_', ' ')}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowResumeUpload(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    if (!userId) return;
                    window.open(`${API_URL}/consultants/${userId}/resume`, "_blank");
                  }}
                  className="text-green-600 hover:text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all duration-200"
                >
                  View
                </button>
              </div>
            </div>
          </div>
          

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Attendance</h3>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              {getStatusIcon(stats.attendanceRate > 80 ? 'completed' : 'pending')}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.attendanceRate}%
              </span>
              <div className="flex items-center space-x-2">
                {/* <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Excellent</span> */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">

             <button 
                onClick={() => setShowOpportunitiesModal(true)} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Opportunities</h3>
                      <p className="text-sm text-gray-500">During bench period</p>
                    </div>
                  </div>
                  {getStatusIcon(stats.opportunitiesCount > 0 ? 'completed' : 'pending')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {stats.opportunitiesCount}
                  </span>
                  <span className="text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-100 to-slate-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    not started
                  </span>
                </div>
              </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Training</h3>
                  <p className="text-sm text-gray-500">Progress status</p>
                </div>
              </div>
              {getStatusIcon(stats.trainingProgress)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold capitalize bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
                {stats.trainingProgress.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time Workflow Progress */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Workflow Progress</h2>
              <p className="text-gray-600">Track your completion status across key areas</p>
            </div>
          </div>
          <ProgressBar 
            steps={workflowSteps}
            currentProgress={stats.workflowProgress}
          />
        </div>

        {/* Training Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Completed Trainings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                
                  <h2 className="text-xl font-bold text-gray-900">Completed Training</h2>
                  

                  <p className="text-gray-600">Your learning achievements</p>
                  <div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Upload Certificate:</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCertificateUpload}
                      className="mt-2 block w-full text-sm text-white
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100"
                    />
                  </div>
                </div>
              </div>
              

            </div>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4 scroll-smooth">
              {completedTrainings.map((training, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        {training.title || "Untitled Course"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        by {training.provider || "Unknown Provider"}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Completed{" "}
                            {training.completedDate
                              ? new Date(training.completedDate).toLocaleDateString()
                              : "Unknown Date"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-center space-y-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Trainings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recommended Training</h2>
                  <p className="text-gray-600">Personalized for your growth</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {recommendations.map((training, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        {training.course_title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Platform: {training.platform} | Skill: {training.skill}
                      </p>
                      <p className="text-sm text-blue-700 italic bg-blue-100 p-3 rounded-lg border border-blue-200">
                        {training.reason}
                      </p>
                    </div>
                    <a
                      href={training.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span>View</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border border-indigo-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>AI Recommendations</span>
                <Sparkles className="h-6 w-6 text-indigo-500" />
              </h2>
              <p className="text-gray-600">Personalized insights to accelerate your career growth</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 shadow-sm"></div>
                <p className="text-gray-700 leading-relaxed">
                  Consider updating your resume with recent project experience to improve skill matching accuracy.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 shadow-sm"></div>
                <p className="text-gray-700 leading-relaxed">
                  Complete the pending React Advanced certification to enhance your frontend development profile.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 shadow-sm"></div>
                <p className="text-gray-700 leading-relaxed">
                  Your attendance rate is very low! Keep attending all meetings for better project allocation opportunities.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 shadow-sm"></div>
                <p className="text-gray-700 leading-relaxed">
                  Based on market trends, consider learning cloud technologies like AWS or Azure to increase your market value.
                </p>
              </div>
            </div>
          </div>
          {/* ChatBot */}
          <div className="fixed bottom-4 right-4 z-50">
            <ChatBot />
          </div>
        </div>

        {/* Resume Upload Modal */}
        {showResumeUpload && (
          <ResumeUpload onClose={() => setShowResumeUpload(false)} />
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;