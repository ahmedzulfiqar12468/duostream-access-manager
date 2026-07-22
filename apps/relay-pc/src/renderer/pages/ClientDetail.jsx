import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [timeLimits, setTimeLimits] = useState({
    daily_limit: 480,
    weekly_limit: 2400,
    monthly_limit: 10080
  });
  const [schedules, setSchedules] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '22:00'
  });

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/clients/${id}`);
      setClient(response.data.client);
      setTimeLimits(response.data.timeLimits);
      setSchedules(response.data.schedules || []);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTimeLimits = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:3002/api/clients/${id}/time-limits`, timeLimits);
      alert('Time limits updated successfully');
    } catch (error) {
      console.error('Error saving time limits:', error);
      alert('Error saving time limits');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`http://localhost:3002/api/clients/${id}/schedule`, newSchedule);
      setNewSchedule({ day_of_week: 0, start_time: '09:00', end_time: '22:00' });
      fetchClientData();
      alert('Schedule added successfully');
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Error adding schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Clients</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{client?.account_name}</h1>
        <p className="text-gray-400 mt-1">Manage time limits and connection schedules</p>
      </div>

      {/* Client Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-white font-medium mt-1 capitalize">{client?.status}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Access Token</p>
            <p className="text-white font-mono text-sm mt-1 break-all">{client?.user_token}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Created</p>
            <p className="text-white font-medium mt-1">{new Date(client?.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Last Updated</p>
            <p className="text-white font-medium mt-1">{new Date(client?.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Time Limits */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Time Limits (in minutes)</h2>
        <form onSubmit={handleSaveTimeLimits} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Daily Limit</label>
              <input
                type="number"
                min="0"
                value={timeLimits.daily_limit}
                onChange={(e) => setTimeLimits({ ...timeLimits, daily_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{timeLimits.daily_limit} min / day</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weekly Limit</label>
              <input
                type="number"
                min="0"
                value={timeLimits.weekly_limit}
                onChange={(e) => setTimeLimits({ ...timeLimits, weekly_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{timeLimits.weekly_limit} min / week</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Limit</label>
              <input
                type="number"
                min="0"
                value={timeLimits.monthly_limit}
                onChange={(e) => setTimeLimits({ ...timeLimits, monthly_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{timeLimits.monthly_limit} min / month</p>
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Time Limits'}
          </Button>
        </form>
      </div>

      {/* Connection Schedules */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Connection Schedules</h2>
        <form onSubmit={handleAddSchedule} className="mb-6 p-4 bg-gray-700 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Day of Week</label>
              <select
                value={newSchedule.day_of_week}
                onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {days.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
              <input
                type="time"
                value={newSchedule.start_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
              <input
                type="time"
                value={newSchedule.end_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="flex items-center space-x-2">
            <Plus size={18} />
            <span>{saving ? 'Adding...' : 'Add Schedule'}</span>
          </Button>
        </form>

        {schedules.length > 0 ? (
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">
                  {days[schedule.day_of_week]}: {schedule.start_time} - {schedule.end_time}
                </span>
                <button className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No schedules set. Add one to allow connections only at specific times.</p>
        )}
      </div>
    </div>
  );
}

export default ClientDetail;
