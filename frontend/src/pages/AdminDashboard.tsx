import ChatBot from '../components/ChatBot';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Eye,
  Settings,
  Plus,
  UserPlus,
  BookOpen,
  Target,
  Mail,
  ExternalLink,
  TrendingUp,
  Activity,
  Award,
  Zap
} from 'lucide-react';

interface Skill {
  id: number;
  skill: string;
  proficiency?: number;
  user_id: number;
}

interface Consultant {
  id: string;
  name: string;
  email: string;
  department: string;
  skills: Skill[];
  status: 'active' | 'bench' | 'training';
  resumeStatus: 'updated' | 'pending';
  attendanceRate: number;
  opportunities: number;
  trainingProgress: number;
}

interface Opportunity {
  id: string;
  title: string;
  client: string;
  requiredSkills: string[];
  status: 'open' | 'assigned' | 'closed';
  matchingConsultants?: number;
}

interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  category: string;
  enrolledCount: number;
}
const API_URL = import.meta.env.VITE_API_URL;


const AdminDashboard: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState('consultants');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<'consultant' | 'opportunity' | 'course'>('consultant');

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/consultants`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        // Transform backend data to frontend format
        const formattedConsultants = data.map((consultant: any) => ({
          id: consultant.id.toString(),
          name: consultant.name,
          email: consultant.email,
          department: consultant.department || 'Unassigned',
          skills: consultant.skills || [],
          status: consultant.status as 'active' | 'bench' | 'training',
          resumeStatus: consultant.resume_status as 'updated' | 'pending',
          attendanceRate: calculateAttendanceRate(consultant.attendance_records),
          opportunities: 0, // You'll need to fetch this separately
          trainingProgress: mapTrainingProgress(consultant.training_status)
        }));
        
        setConsultants(formattedConsultants);
      } catch (error) {
        console.error("Failed to fetch consultants", error);
      }
    };

    // Helper functions
    const calculateAttendanceRate = (records: any[]) => {
      if (!records || records.length === 0) return 0;
      const presentDays = records.filter(r => r.status === 'present').length;
      return Math.round((presentDays / records.length) * 100);
    };

    const mapTrainingProgress = (status: string) => {
      switch(status) {
        case 'completed': return 100;
        case 'in_progress': return 50;
        default: return 0;
      }
    };

    fetchConsultants();
  }, []);

  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Frontend Developer - E-commerce',
      client: 'TechCorp Inc',
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      status: 'open',
      matchingConsultants: 5
    },
    {
      id: '2',
      title: 'Python Backend Developer',
      client: 'FinanceFlow',
      requiredSkills: ['Python', 'FastAPI', 'PostgreSQL'],
      status: 'assigned',
      matchingConsultants: 3
    }
  ];

  const trainingCourses: TrainingCourse[] = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      provider: 'Udemy',
      duration: '40 hours',
      category: 'Frontend',
      enrolledCount: 12
    },
    {
      id: '2',
      title: 'AWS Solutions Architect',
      provider: 'Udemy',
      duration: '65 hours',
      category: 'Cloud',
      enrolledCount: 8
    }
  ];

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || consultant.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || consultant.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200',
      bench: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200',
      training: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200',
      open: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200',
      assigned: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200',
      closed: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200'
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]} shadow-sm`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCreateNew = (type: 'consultant' | 'opportunity' | 'course') => {
    setModalType(type);
    setShowCreateModal(true);
  };

  const handleNotifyConsultant = (consultantEmail: string, opportunityTitle: string) => {
    const subject = encodeURIComponent(`New Opportunity: ${opportunityTitle}`);
    const body = encodeURIComponent(`Dear Consultant,\n\nWe have a new opportunity that matches your skills: ${opportunityTitle}\n\nPlease review and let us know your interest.\n\nBest regards,\nHexaware Team`);
    const mailtoUrl = `mailto:${consultantEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  const downloadConsultantReport = async (consultantId: string, consultantName: string) => {
    try {
      const response = await fetch(
        `${API_URL}/consultants/${consultantId}/report`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${consultantName}_report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report');
    }
  };

  const renderConsultantsTab = () => (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultant Management</h2>
          <p className="text-gray-600">Manage and monitor consultant profiles, skills, and performance</p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Search Consultants</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
          
          <div className="lg:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="all">All Departments</option>
              <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Fullstack Development">Fullstack Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Finance">Finance</option>
            </select>
          </div>
          
          <div className="lg:w-40">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="bench">Bench</option>
              <option value="training">Training</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Consultants Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Consultant Directory</h3>
          <p className="text-sm text-gray-600 mt-1">{filteredConsultants.length} consultants found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Consultant Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Training Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredConsultants.map((consultant, index) => (
                <tr key={consultant.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {consultant.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 mb-1">{consultant.name}</div>
                        <div className="text-sm text-gray-500 mb-2">{consultant.email}</div>
                        <div className="flex flex-wrap gap-1">
                          {consultant.skills.slice(0, 2).map((skillObj) => (
                            <span key={skillObj.id} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-lg font-medium border border-blue-200">
                              {skillObj.skill}
                            </span>
                          ))}
                          {consultant.skills.length > 2 && (
                            <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs rounded-lg font-medium border border-gray-200">
                              +{consultant.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultant.department}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {getStatusBadge(consultant.status)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${
                      consultant.resumeStatus === 'updated' 
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200' 
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200'
                    }`}>
                      {consultant.resumeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                          <div 
                            className={`h-2.5 rounded-full shadow-sm ${
                              consultant.attendanceRate >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              consultant.attendanceRate >= 75 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                              'bg-gradient-to-r from-red-400 to-rose-500'
                            }`}
                            style={{ width: `${consultant.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-0">{consultant.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full shadow-sm" 
                            style={{ width: `${consultant.trainingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-0">{consultant.trainingProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => downloadConsultantReport(consultant.id, consultant.name)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
                        title="Download Report"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOpportunitiesTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Management</h2>
          <p className="text-gray-600">Track and manage client opportunities and consultant matching</p>
        </div>
        <button
          onClick={() => handleCreateNew('opportunity')}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Create Opportunity</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Opportunities</h3>
          <p className="text-sm text-gray-600 mt-1">{opportunities.length} opportunities available</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Opportunity Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Required Skills
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Matches
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                          <Target className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{opportunity.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{opportunity.client}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requiredSkills.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-lg font-medium border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {getStatusBadge(opportunity.status)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{opportunity.matchingConsultants}</span>
                      <span className="text-sm text-gray-500">consultants</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:shadow-md">
                        <Target className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleNotifyConsultant('consultant@example.com', opportunity.title)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Management</h2>
          <p className="text-gray-600">Manage training courses and track consultant progress</p>
        </div>
        <button
          onClick={() => handleCreateNew('course')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">Add Course</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Training Courses</h3>
          <p className="text-sm text-gray-600 mt-1">{trainingCourses.length} courses available</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {trainingCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                          <BookOpen className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.provider}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{course.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs rounded-lg font-medium border border-gray-200">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{course.enrolledCount}</span>
                      <span className="text-sm text-gray-500">consultants</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:shadow-md">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200 group-hover:shadow-md">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Console
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Complete user management and system administration</p>
            </div>
          </div>
        </div>

        {/* Enhanced System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Consultants</p>
                <p className="text-3xl font-bold text-gray-900">{consultants.length}</p>
                {/* <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12% this month</span>
                </div> */}
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">On Bench</p>
                <p className="text-3xl font-bold text-gray-900">
                  {consultants.filter(c => c.status === 'bench').length}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">Available for projects</span>
                </div>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Open Opportunities</p>
                <p className="text-3xl font-bold text-gray-900">
                  {opportunities.filter(o => o.status === 'open').length}
                </p>
                <div className="flex items-center mt-2">
                  <Zap className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Ready to assign</span>
                </div>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Training Courses</p>
                <p className="text-3xl font-bold text-gray-900">{trainingCourses.length}</p>
                <div className="flex items-center mt-2">
                  <Award className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">Active programs</span>
                </div>
              </div>
              <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'consultants', label: 'Consultants', icon: Users, color: 'blue' },
                { id: 'opportunities', label: 'Opportunities', icon: Target, color: 'green' },
                { id: 'training', label: 'Training', icon: BookOpen, color: 'purple' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-6 px-1 border-b-3 font-semibold text-sm flex items-center space-x-3 transition-all duration-200 ${
                      isActive
                        ? `border-${tab.color}-500 text-${tab.color}-600`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'consultants' && renderConsultantsTab()}
            {activeTab === 'opportunities' && renderOpportunitiesTab()}
            {activeTab === 'training' && renderTrainingTab()}
          </div>
        </div>

{/* ChatBot */}
          <div className="fixed bottom-4 right-4 z-50">
            <ChatBot />
          </div>
        {/* Enhanced Agent Framework Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Agentic Framework Status</h2>
              <p className="text-gray-600">Real-time system performance metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Resume Agent Uptime</div>
              {/* <div className="text-xs text-green-600">Excellent performance</div> */}
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">45ms</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Avg Response Time</div>
              {/* <div className="text-xs text-blue-600">Lightning fast</div> */}
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Active Queues</div>
              {/* <div className="text-xs text-purple-600">Processing smoothly</div> */}
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">0.2%</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Error Rate</div>
              <div className="text-xs text-red-600">Minimal errors</div>
            </div>
          </div>
        </div>

        {/* Enhanced Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Create New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {modalType === 'consultant' && 'Add a new consultant to the system with login credentials.'}
                {modalType === 'opportunity' && 'Create a new opportunity and find matching consultants.'}
                {modalType === 'course' && 'Add a new training course with details and URL.'}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;