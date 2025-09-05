'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, MessageSquare, Video, Check, X, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'rescheduled';
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomPassword?: string;
  createdAt: string;
  adminNotes?: any[];
  lastActivity?: string;
}

interface AppointmentStats {
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  inProgress: number;
  rescheduled: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    inProgress: 0,
    rescheduled: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments/admin');
      
      if (!response.ok) {
        console.error('Failed to fetch appointments');
        return;
      }
      
      const data = await response.json();
      setAppointments(data.appointments || []);
      setStats(data.stats || {
        total: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
        inProgress: 0,
        rescheduled: 0
      });
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/appointments/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          appointmentId,
          data: { status: newStatus }
        })
      });

      if (response.ok) {
        await loadAppointments();
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addAdminNote = async (appointmentId: string, note: string) => {
    try {
      const response = await fetch('/api/appointments/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_note',
          appointmentId,
          data: { note }
        })
      });

      if (response.ok) {
        await loadAppointments();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      const response = await fetch(`/api/appointments/admin?id=${appointmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadAppointments();
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rescheduled':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredAppointments = statusFilter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointment Management</h1>
          <p className="text-gray-600">Manage consultations and Zoom meetings</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.rescheduled}</div>
          <div className="text-sm text-gray-600">Rescheduled</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({appointments.length})
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'confirmed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmed ({stats.confirmed})
        </button>
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'in_progress' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'completed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{appointment.name}</h3>
                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {appointment.date ? format(new Date(appointment.date), 'MMM d, yyyy') : 'No date'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {appointment.time || 'No time'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {appointment.email}
                    </div>
                  </div>
                  
                  {appointment.service && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Service:</strong> {appointment.service}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {appointment.zoomJoinUrl && (
                    <a
                      href={appointment.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Video className="w-4 h-4" />
                      Zoom
                    </a>
                  )}
                  <button
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppointment(appointment);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Client Name</label>
                  <div className="text-gray-800">{selectedAppointment.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
                  <div className="text-gray-800">{selectedAppointment.company || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-gray-800">{selectedAppointment.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <div className="text-gray-800">{selectedAppointment.phone || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <div className="text-gray-800">
                    {selectedAppointment.date 
                      ? format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy')
                      : 'No date set'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                  <div className="text-gray-800">{selectedAppointment.time || 'No time set'}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Service</label>
                <div className="text-gray-800">{selectedAppointment.service}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <div className="flex gap-2">
                  <select
                    value={selectedAppointment.status}
                    onChange={(e) => updateAppointmentStatus(selectedAppointment.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              {selectedAppointment.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-800">
                    {selectedAppointment.message}
                  </div>
                </div>
              )}
              
              {selectedAppointment.zoomJoinUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-800 font-semibold mb-2">Zoom Meeting Details</h4>
                  <div className="space-y-1 text-sm">
                    {selectedAppointment.zoomMeetingId && (
                      <div>
                        <span className="text-gray-600">Meeting ID: </span>
                        <span className="text-gray-800">{selectedAppointment.zoomMeetingId}</span>
                      </div>
                    )}
                    {selectedAppointment.zoomPassword && (
                      <div>
                        <span className="text-gray-600">Password: </span>
                        <span className="text-gray-800">{selectedAppointment.zoomPassword}</span>
                      </div>
                    )}
                    <div>
                      <a 
                        href={selectedAppointment.zoomJoinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {selectedAppointment.zoomJoinUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedAppointment.adminNotes && selectedAppointment.adminNotes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Admin Notes</label>
                  <div className="space-y-2">
                    {selectedAppointment.adminNotes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <div className="text-gray-800">{note.note}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedAppointment.zoomJoinUrl && (
                  <a
                    href={selectedAppointment.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Zoom Meeting
                  </a>
                )}
                <button
                  onClick={() => deleteAppointment(selectedAppointment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}