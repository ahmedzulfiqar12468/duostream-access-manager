import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import axios from 'axios';

function Dashboard({ hostConnected }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    approvedClients: 0,
    activeSessions: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clientsRes = await axios.get('http://localhost:3002/api/clients');
        const sessionsRes = await axios.get('http://localhost:3002/api/sessions');

        setStats({
          totalClients: clientsRes.data.length,
          approvedClients: clientsRes.data.filter(c => c.status === 'approved').length,
          activeSessions: sessionsRes.data.length,
          pendingApprovals: clientsRes.data.filter(c => c.status === 'pending').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage client access and permissions</p>
      </div>

      {/* Status Alert */}
      {!hostConnected && (
        <div className="mb-8 p-4 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-200">⚠️ Not connected to Host PC. Go to <strong>Host Connection</strong> to connect.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="👥"
          label="Total Clients"
          value={stats.totalClients}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Approved Clients"
          value={stats.approvedClients}
          color="green"
        />
        <StatCard
          icon="🔗"
          label="Active Sessions"
          value={stats.activeSessions}
          color="purple"
        />
        <StatCard
          icon="⏳"
          label="Pending Approvals"
          value={stats.pendingApprovals}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {stats.pendingApprovals > 0 ? (
              <p className="text-gray-400">You have {stats.pendingApprovals} pending client approval(s)</p>
            ) : (
              <p className="text-gray-400">No pending approvals</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Relay Status</span>
              <span className="text-green-400 font-medium">Running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Host Connection</span>
              <span className={`font-medium ${
                hostConnected ? 'text-green-400' : 'text-red-400'
              }`}>
                {hostConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
