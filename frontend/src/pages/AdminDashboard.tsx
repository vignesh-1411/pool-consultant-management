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
  ExternalLink
} from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  email: string;
  department: string;
  skills: string[];
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
    const response = await fetch('http://localhost:8000/admin/consultants', {
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

  // const consultants: Consultant[] = [
  //   {
  //     id: '1',
  //     name: 'John Doe',
  //     email: 'john.doe@hexaware.com',
  //     department: 'Frontend Development',
  //     skills: ['React', 'TypeScript', 'Node.js'],
  //     status: 'bench',
  //     resumeStatus: 'updated',
  //     attendanceRate: 95,
  //     opportunities: 3,
  //     trainingProgress: 75
  //   },
  //   {
  //     id: '2',
  //     name: 'Jane Smith',
  //     email: 'jane.smith@hexaware.com',
  //     department: 'Backend Development',
  //     skills: ['Python', 'FastAPI', 'PostgreSQL'],
  //     status: 'active',
  //     resumeStatus: 'pending',
  //     attendanceRate: 88,
  //     opportunities: 1,
  //     trainingProgress: 60
  //   },
  //   {
  //     id: '3',
  //     name: 'Mike Johnson',
  //     email: 'mike.johnson@hexaware.com',
  //     department: 'Data Science',
  //     skills: ['Python', 'Machine Learning', 'TensorFlow'],
  //     status: 'training',
  //     resumeStatus: 'updated',
  //     attendanceRate: 92,
  //     opportunities: 2,
  //     trainingProgress: 90
  //   }
  // ];

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

  // if (loading) {
  // return <div className="text-center text-gray-600">Loading consultants...</div>;
  // }


  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'all' || consultant.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || consultant.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      bench: 'bg-yellow-100 text-yellow-800',
      training: 'bg-blue-100 text-blue-800',
      open: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
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
      `http://localhost:8000/consultants/${consultantId}/report`,
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
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Consultant Management</h2>
        {/* <button
          onClick={() => handleCreateNew('consultant')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Consultant</span>
        </button> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Data Science">Data Science</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="bench">Bench</option>
            <option value="training">Training</option>
          </select>
        </div>
      </div>

      {/* Consultants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Training
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            
              {filteredConsultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{consultant.name}</div>
                      <div className="text-sm text-gray-500">{consultant.email}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {consultant.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {consultant.skills.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{consultant.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultant.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(consultant.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consultant.resumeStatus === 'updated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {consultant.resumeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultant.attendanceRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${consultant.trainingProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{consultant.trainingProgress}%</span>
                  </td>
            
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                    <button 
                      onClick={() => downloadConsultantReport(consultant.id, consultant.name)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download Report"
                      >
                      <Download className="h-4 w-4" />
                   </button>
                    <button className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Opportunity Management</h2>
        <button
          onClick={() => handleCreateNew('opportunity')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Opportunity</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matches
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.client}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {opportunity.requiredSkills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(opportunity.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.matchingConsultants} consultants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Target className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleNotifyConsultant('consultant@example.com', opportunity.title)}
                        className="text-green-600 hover:text-green-900"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Training Management</h2>
        <button
          onClick={() => handleCreateNew('course')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainingCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.enrolledCount} consultants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
        <p className="text-gray-600 mt-2">Complete user management and system administration</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consultants</p>
              <p className="text-2xl font-bold text-gray-900">{consultants.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Bench</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultants.filter(c => c.status === 'bench').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.filter(o => o.status === 'open').length}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Courses</p>
              <p className="text-2xl font-bold text-gray-900">{trainingCourses.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'consultants', label: 'Consultants', icon: Users },
              { id: 'opportunities', label: 'Opportunities', icon: Target },
              { id: 'training', label: 'Training', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'consultants' && renderConsultantsTab()}
          {activeTab === 'opportunities' && renderOpportunitiesTab()}
          {activeTab === 'training' && renderTrainingTab()}
        </div>
      </div>

      {/* Agent Framework Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Agentic Framework Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Resume Agent Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">45ms</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Active Queues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">0.2%</div>
            <div className="text-sm text-gray-600">Error Rate</div>
          </div>
        </div>
      </div>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Create New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <p className="text-gray-600 mb-4">
              {modalType === 'consultant' && 'Add a new consultant to the system with login credentials.'}
              {modalType === 'opportunity' && 'Create a new opportunity and find matching consultants.'}
              {modalType === 'course' && 'Add a new training course with details and URL.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;