import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import axios from 'axios';

function Dashboard({ connectedRelays, activeSessions }) {
  const [stats, setStats] = useState({
    relayConnections: 0,
    activeSessions: 0,
    totalAccounts: 0,
    systemHealth: 'Healthy'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const relaysRes = await axios.get('http://localhost:3001/api/relay-connections');
        const sessionsRes = await axios.get('http://localhost:3001/api/sessions');
        const accountsRes = await axios.get('http://localhost:3001/api/accounts');
        const healthRes = await axios.get('http://localhost:3001/api/health');

        setStats({
          relayConnections: relaysRes.data.filter(r => r.status === 'active').length,
          activeSessions: sessionsRes.data.length,
          totalAccounts: accountsRes.data.length,
          systemHealth: healthRes.data.status === 'healthy' ? 'Healthy' : 'Unhealthy'
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
        <p className="text-gray-400">Monitor your DuoStream access management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="🔌"
          label="Connected Relays"
          value={stats.relayConnections}
          color="blue"
        />
        <StatCard
          icon="🔗"
          label="Active Sessions"
          value={stats.activeSessions}
          color="green"
        />
        <StatCard
          icon="👥"
          label="Total Accounts"
          value={stats.totalAccounts}
          color="purple"
        />
        <StatCard
          icon="✅"
          label="System Status"
          value={stats.systemHealth}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">Relay PC Connected</span>
            <span className="text-green-400 text-sm">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">New Session Started</span>
            <span className="text-blue-400 text-sm">5 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300">Account Created</span>
            <span className="text-blue-400 text-sm">15 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
