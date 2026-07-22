import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function HostConnection({ onConnect }) {
  const [formData, setFormData] = useState({
    host_ip: '',
    host_port: 3001,
    password: '',
    relay_name: 'My Relay PC'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3002/api/connect-to-host', formData);
      setMessage('Connecting to Host PC...');
      setConnectionStatus('connecting');
      onConnect();

      // Simulate connection success after 2 seconds
      setTimeout(() => {
        setConnectionStatus('connected');
        setMessage('✅ Successfully connected to Host PC');
      }, 2000);
    } catch (error) {
      setMessage('❌ Failed to connect: ' + error.message);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Host PC Connection</h1>
        <p className="text-gray-400 mt-1">Connect this Relay PC to your Host PC via Tailscale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Connection Settings</h2>
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Host PC IP Address</label>
              <input
                type="text"
                value={formData.host_ip}
                onChange={(e) => setFormData({ ...formData, host_ip: e.target.value })}
                placeholder="100.x.x.x (Tailscale IP)"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Enter your Host PC's Tailscale IP address</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
              <input
                type="number"
                value={formData.host_port}
                onChange={(e) => setFormData({ ...formData, host_port: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 3001</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter Host PC master password"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Password configured on Host PC</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Relay PC Name</label>
              <input
                type="text"
                value={formData.relay_name}
                onChange={(e) => setFormData({ ...formData, relay_name: e.target.value })}
                placeholder="e.g., Living Room PC"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Identify this Relay PC on Host</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('✅')
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'
              }`}>
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Connecting...' : 'Connect to Host PC'}
            </Button>
          </form>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Connection Status</h2>

          {/* Status Indicator */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-gray-500'
              } animate-pulse`}></div>
              <span className="font-medium capitalize">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">To connect:</h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>Make sure your Host PC is running</li>
                <li>Ensure both PCs are on the same Tailscale network</li>
                <li>Enter the Host PC's Tailscale IP address</li>
                <li>Enter the master password set on Host PC</li>
                <li>Click "Connect to Host PC"</li>
              </ol>
            </div>

            {connectionStatus === 'connected' && (
              <div className="p-4 bg-green-900 border border-green-700 rounded-lg">
                <p className="text-green-200 text-sm">
                  ✅ Your Relay PC is now connected and ready to manage clients!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostConnection;
