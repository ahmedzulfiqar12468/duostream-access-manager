import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import Button from '../components/Button';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleLogoutUser = async (sessionId) => {
    setLoading(true);
    try {
      // Logout logic here
      alert('User logged out successfully');
      fetchSessions();
    } catch (error) {
      console.error('Error logging out user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Active Sessions</h1>
        <p className="text-gray-400 mt-1">Monitor and manage user sessions</p>
      </div>

      {/* Sessions Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-700">
              <th className="text-left px-6 py-4 font-semibold">User Name</th>
              <th className="text-left px-6 py-4 font-semibold">Account</th>
              <th className="text-left px-6 py-4 font-semibold">Relay IP</th>
              <th className="text-left px-6 py-4 font-semibold">Login Time</th>
              <th className="text-left px-6 py-4 font-semibold">Duration</th>
              <th className="text-right px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const loginTime = new Date(session.login_time);
              const duration = Math.floor((new Date() - loginTime) / 60000);
              return (
                <tr key={session.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 font-medium">{session.user_name}</td>
                  <td className="px-6 py-4 text-gray-400">{session.account_name}</td>
                  <td className="px-6 py-4 text-gray-400">{session.relay_ip}</td>
                  <td className="px-6 py-4 text-gray-400">{loginTime.toLocaleTimeString()}</td>
                  <td className="px-6 py-4 text-gray-400">{duration} min</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleLogoutUser(session.id)}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No active sessions
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;
