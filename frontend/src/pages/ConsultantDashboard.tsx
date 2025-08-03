// // src/pages/ConsultantDashboard.tsx


import React, { useState, useEffect } from 'react';

import { 
  FileText, 
  Calendar, 
  Target, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Upload,
  Award,
  ExternalLink,
  Star,
  BookOpen
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import ResumeUpload from '../components/ResumeUpload';

interface DashboardStats {
  resumeStatus: 'updated' | 'pending';
  attendanceRate: number;
  opportunitiesCount: number;
  trainingProgress: 'not_started' | 'in_progress' | 'completed';
  workflowProgress: number;
}

interface TrainingRecommendation {
  title: string;
  provider: string;
  duration: string;
  rating: number;
  url: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

const ConsultantDashboard: React.FC = () => {

  const [stats, setStats] = useState<DashboardStats>({
    resumeStatus: 'updated',
    attendanceRate: 85,
    opportunitiesCount: 3,
    trainingProgress: 'in_progress',
    workflowProgress: 75
  });
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [completedTrainings, setCompletedTrainings] = useState([
    {
      title: 'Advanced React Patterns',
      provider: 'Udemy',
      completedDate: '2024-01-15',
      rating: 4.8,
      certificate: true
    },
    {
      title: 'TypeScript Masterclass',
      provider: 'Udemy',
      completedDate: '2023-12-10',
      rating: 4.9,
      certificate: true
    }
  ]);

  useEffect(() => {
    // Fetch training recommendations based on user skills
    fetchTrainingRecommendations();
  }, []);

  const fetchTrainingRecommendations = async () => {
    // Simulate API call to get personalized recommendations
    const mockRecommendations: TrainingRecommendation[] = [
      {
        title: 'Next.js Complete Guide',
        provider: 'Udemy',
        duration: '40 hours',
        rating: 4.7,
        url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/',
        reason: 'Based on your React expertise, this will enhance your full-stack capabilities',
        priority: 'high'
      },
      {
        title: 'AWS Solutions Architect',
        provider: 'Udemy',
        duration: '65 hours',
        rating: 4.6,
        url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/',
        reason: 'Add cloud architecture skills to complement your development expertise',
        priority: 'high'
      },
      {
        title: 'Docker & Kubernetes Complete Guide',
        provider: 'Udemy',
        duration: '35 hours',
        rating: 4.5,
        url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        reason: 'Master containerization and orchestration technologies',
        priority: 'medium'
      },
      {
        title: 'Python for Data Science',
        provider: 'Udemy',
        duration: '50 hours',
        rating: 4.7,
        url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
        reason: 'Expand into the high-demand field of data science',
        priority: 'high'
      }
    ];

    setRecommendations(mockRecommendations);
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
    { name: 'Training Completed', completed: stats.trainingProgress === 'completed' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back,</h1> 
        <p className="text-gray-600 mt-2">Track your professional development and engagement status</p>
      </div>

      {/* Current Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Resume Status</h3>
                <p className="text-sm text-gray-500">Last updated 2 days ago</p>
              </div>
            </div>
            {getStatusIcon(stats.resumeStatus)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {stats.resumeStatus.replace('_', ' ')}
            </span>
            <button
              onClick={() => setShowResumeUpload(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Update
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Attendance</h3>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
            {getStatusIcon(stats.attendanceRate > 80 ? 'completed' : 'pending')}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Opportunities</h3>
                <p className="text-sm text-gray-500">During bench period</p>
              </div>
            </div>
            {getStatusIcon(stats.opportunitiesCount > 0 ? 'completed' : 'pending')}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{stats.opportunitiesCount}</span>
            <span className="text-sm text-gray-500">documented</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Training</h3>
                <p className="text-sm text-gray-500">Progress status</p>
              </div>
            </div>
            {getStatusIcon(stats.trainingProgress)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {stats.trainingProgress.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">3/5 courses</span>
          </div>
        </div>
      </div>

      {/* Real-Time Workflow Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Workflow Progress</h2>
        <ProgressBar 
          steps={workflowSteps}
          currentProgress={stats.workflowProgress}
        />
      </div>

      {/* Training Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Completed Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Completed Training</h2>
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-4">
            {completedTrainings.map((training, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{training.title}</h4>
                    <p className="text-sm text-gray-600">by {training.provider}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Completed {new Date(training.completedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{training.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {training.certificate && (
                      <Award className="h-6 w-6 text-green-500 mb-1" />
                    )}
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended Training</h2>
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((training, index) => (
              <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{training.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(training.priority)}`}>
                        {training.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">by {training.provider}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{training.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{training.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 mt-2 italic">{training.reason}</p>
                  </div>
                  <a
                    href={training.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {recommendations.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Recommendations ({recommendations.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Consider updating your resume with recent project experience to improve skill matching accuracy.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Complete the pending React Advanced certification to enhance your frontend development profile.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Your attendance rate is excellent! Keep maintaining this consistency for better project allocation opportunities.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Based on market trends, consider learning cloud technologies like AWS or Azure to increase your market value.
            </p>
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <ResumeUpload onClose={() => setShowResumeUpload(false)} />
      )}
    </div>
  );
};

export default ConsultantDashboard;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, 
//   Calendar, 
//   Target, 
//   BookOpen, 
//   CheckCircle, 
//   Clock, 
//   AlertCircle, 
//   LogOut,
//   Waves,
//   FileText,
//   Users,
//   Award,
//   TrendingUp,
//   Activity,
//   Upload,
//   Edit3,
//   Eye,
//   Download
// } from 'lucide-react';

// interface ConsultantStatus {
//   resumeStatus: 'updated' | 'pending';
//   attendanceReport: {
//     completed: number;
//     missed: number;
//     total: number;
//   };
//   opportunities: {
//     provided: number;
//     completed: number;
//     pending: number;
//   };
//   trainingProgress: 'not_started' | 'in_progress' | 'completed';
//   workflowProgress: {
//     resumeUpdated: boolean;
//     attendanceReported: boolean;
//     opportunitiesDocumented: boolean;
//     trainingCompleted: boolean;
//   };
// }

// interface ConsultantProfile {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   joinDate: string;
//   rating: number;
//   completedJobs: number;
//   skills: string[];
// }

// function ConsultantDashboard() {
//   const navigate = useNavigate();
//   const [consultantData, setConsultantData] = useState<ConsultantProfile>({
//     id: '1',
//     name: 'Navanth Raja',
//     email: 'navanth.raja@poolconsult.com',
//     department: 'Pool Maintenance',
//     joinDate: '2024-01-15',
//     rating: 4.8,
//     completedJobs: 127,
//     skills: ['Chemical Balancing', 'Equipment Repair', 'Cleaning']
//   });

//   const [status, setStatus] = useState<ConsultantStatus>({
//     resumeStatus: 'pending',
//     attendanceReport: {
//       completed: 23,
//       missed: 2,
//       total: 25
//     },
//     opportunities: {
//       provided: 15,
//       completed: 12,
//       pending: 3
//     },
//     trainingProgress: 'in_progress',
//     workflowProgress: {
//       resumeUpdated: false,
//       attendanceReported: true,
//       opportunitiesDocumented: true,
//       trainingCompleted: false
//     }
//   });

//   const [loading, setLoading] = useState(false);

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const updateWorkflowItem = (item: keyof ConsultantStatus['workflowProgress']) => {
//     setStatus(prev => ({
//       ...prev,
//       workflowProgress: {
//         ...prev.workflowProgress,
//         [item]: !prev.workflowProgress[item]
//       }
//     }));
//   };

//   const updateResumeStatus = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setStatus(prev => ({
//         ...prev,
//         resumeStatus: 'updated',
//         workflowProgress: {
//           ...prev.workflowProgress,
//           resumeUpdated: true
//         }
//       }));
//       setLoading(false);
//     }, 1500);
//   };

//   const calculateWorkflowProgress = () => {
//     const completed = Object.values(status.workflowProgress).filter(Boolean).length;
//     return (completed / 4) * 100;
//   };

//   const getStatusColor = (statusType: string, value: any) => {
//     switch (statusType) {
//       case 'resume':
//         return value === 'updated' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
//       case 'training':
//         if (value === 'completed') return 'text-green-600 bg-green-100';
//         if (value === 'in_progress') return 'text-blue-600 bg-blue-100';
//         return 'text-gray-600 bg-gray-100';
//       default:
//         return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const workflowItems = [
//     {
//       key: 'resumeUpdated' as const,
//       label: 'Resume Updated',
//       icon: FileText,
//       description: 'Update your professional resume'
//     },
//     {
//       key: 'attendanceReported' as const,
//       label: 'Attendance Reported',
//       icon: Calendar,
//       description: 'Submit monthly attendance report'
//     },
//     {
//       key: 'opportunitiesDocumented' as const,
//       label: 'Opportunities Documented',
//       icon: Target,
//       description: 'Document client opportunities'
//     },
//     {
//       key: 'trainingCompleted' as const,
//       label: 'Training Completed',
//       icon: BookOpen,
//       description: 'Complete required training modules'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Waves className="w-8 h-8 text-blue-600 mr-3" />
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Consultant Dashboard</h1>
//                 <p className="text-sm text-gray-500">Welcome back, {consultantData.name}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Overview */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Profile Overview</h2>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Member since</p>
//                 <p className="font-medium text-gray-900">{new Date(consultantData.joinDate).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <User className="w-8 h-8 text-blue-600" />
//               </div>
//               <p className="text-sm text-gray-500">Department</p>
//               <p className="font-semibold text-gray-900">{consultantData.department}</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Award className="w-8 h-8 text-green-600" />
//               </div>
//               <p className="text-sm text-gray-500">Rating</p>
//               <p className="font-semibold text-gray-900">⭐ {consultantData.rating}</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <TrendingUp className="w-8 h-8 text-purple-600" />
//               </div>
//               <p className="text-sm text-gray-500">Completed Jobs</p>
//               <p className="font-semibold text-gray-900">{consultantData.completedJobs}</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Activity className="w-8 h-8 text-orange-600" />
//               </div>
//               <p className="text-sm text-gray-500">Skills</p>
//               <p className="font-semibold text-gray-900">{consultantData.skills.length} Skills</p>
//             </div>
//           </div>
//         </div>

//         {/* Current Status Dashboard */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Resume Update Status */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <FileText className="w-5 h-5 mr-2 text-blue-600" />
//                 Resume Status
//               </h3>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('resume', status.resumeStatus)}`}>
//                 {status.resumeStatus === 'updated' ? 'Updated' : 'Pending'}
//               </span>
//             </div>
            
//             <p className="text-gray-600 mb-4">
//               {status.resumeStatus === 'updated' 
//                 ? 'Your resume is up to date and ready for opportunities.'
//                 : 'Please update your resume to reflect your latest experience and skills.'
//               }
//             </p>
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={updateResumeStatus}
//                 disabled={loading || status.resumeStatus === 'updated'}
//                 className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
//                   status.resumeStatus === 'updated'
//                     ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {loading ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 ) : (
//                   <Upload className="w-4 h-4 mr-2" />
//                 )}
//                 {status.resumeStatus === 'updated' ? 'Updated' : 'Update Resume'}
//               </button>
              
//               <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
//                 <Eye className="w-4 h-4 mr-2" />
//                 View Current
//               </button>
//             </div>
//           </div>

//           {/* Attendance Report */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <Calendar className="w-5 h-5 mr-2 text-green-600" />
//               Attendance Report
//             </h3>
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Completed Sessions</span>
//                 <span className="font-semibold text-green-600">{status.attendanceReport.completed}</span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Missed Sessions</span>
//                 <span className="font-semibold text-red-600">{status.attendanceReport.missed}</span>
//               </div>
              
//               <div className="flex justify-between items-center border-t pt-3">
//                 <span className="text-gray-900 font-medium">Total Sessions</span>
//                 <span className="font-bold text-gray-900">{status.attendanceReport.total}</span>
//               </div>
              
//               <div className="mt-4">
//                 <div className="flex justify-between text-sm text-gray-600 mb-1">
//                   <span>Attendance Rate</span>
//                   <span>{Math.round((status.attendanceReport.completed / status.attendanceReport.total) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-green-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${(status.attendanceReport.completed / status.attendanceReport.total) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Opportunities Provided */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <Target className="w-5 h-5 mr-2 text-purple-600" />
//               Opportunities Provided
//             </h3>
            
//             <div className="grid grid-cols-3 gap-4">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-purple-600">{status.opportunities.provided}</p>
//                 <p className="text-sm text-gray-600">Total</p>
//               </div>
              
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-green-600">{status.opportunities.completed}</p>
//                 <p className="text-sm text-gray-600">Completed</p>
//               </div>
              
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-yellow-600">{status.opportunities.pending}</p>
//                 <p className="text-sm text-gray-600">Pending</p>
//               </div>
//             </div>
            
//             <div className="mt-4">
//               <div className="flex justify-between text-sm text-gray-600 mb-1">
//                 <span>Success Rate</span>
//                 <span>{Math.round((status.opportunities.completed / status.opportunities.provided) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-purple-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${(status.opportunities.completed / status.opportunities.provided) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           {/* Training Progress */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
//                 Training Progress
//               </h3>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('training', status.trainingProgress)}`}>
//                 {status.trainingProgress.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//               </span>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Current Module</span>
//                 <span className="font-medium text-gray-900">Advanced Pool Chemistry</span>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Modules Completed</span>
//                 <span className="font-medium text-gray-900">7 of 10</span>
//               </div>
              
//               <div className="mt-4">
//                 <div className="flex justify-between text-sm text-gray-600 mb-1">
//                   <span>Overall Progress</span>
//                   <span>70%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: '70%' }}></div>
//                 </div>
//               </div>
              
//               <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
//                 Continue Training
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Real-Time Workflow Progress */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-gray-900">Workflow Progress</h3>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Overall Completion</p>
//               <p className="text-2xl font-bold text-blue-600">{Math.round(calculateWorkflowProgress())}%</p>
//             </div>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${calculateWorkflowProgress()}%` }}
//               ></div>
//             </div>
//             <div className="flex justify-between text-xs text-gray-500 mt-1">
//               <span>0%</span>
//               <span>25%</span>
//               <span>50%</span>
//               <span>75%</span>
//               <span>100%</span>
//             </div>
//           </div>
          
//           {/* Workflow Items */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {workflowItems.map((item) => {
//               const isCompleted = status.workflowProgress[item.key];
//               const Icon = item.icon;
              
//               return (
//                 <div
//                   key={item.key}
//                   className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
//                     isCompleted
//                       ? 'border-green-500 bg-green-50'
//                       : 'border-gray-200 bg-white hover:border-gray-300'
//                   }`}
//                   onClick={() => updateWorkflowItem(item.key)}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       isCompleted ? 'bg-green-500' : 'bg-gray-200'
//                     }`}>
//                       {isCompleted ? (
//                         <CheckCircle className="w-6 h-6 text-white" />
//                       ) : (
//                         <Icon className="w-6 h-6 text-gray-600" />
//                       )}
//                     </div>
                    
//                     {isCompleted && (
//                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                         <CheckCircle className="w-4 h-4 text-white" />
//                       </div>
//                     )}
//                   </div>
                  
//                   <h4 className={`font-medium mb-2 ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
//                     {item.label}
//                   </h4>
                  
//                   <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
//                     {item.description}
//                   </p>
                  
//                   <div className="mt-3">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       isCompleted 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {isCompleted ? 'Completed' : 'Pending'}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
          
//           {/* Action Buttons */}
//           <div className="mt-8 flex justify-center space-x-4">
//             <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
//               <Download className="w-5 h-5 mr-2" />
//               Download Progress Report
//             </button>
            
//             <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//               <Edit3 className="w-5 h-5 mr-2" />
//               Update Information
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConsultantDashboard;
