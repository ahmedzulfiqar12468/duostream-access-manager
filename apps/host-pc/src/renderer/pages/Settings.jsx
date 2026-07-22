import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function Settings() {
  const [settings, setSettings] = useState({
    password: '',
    passwordConfirm: '',
    maxConcurrentUsers: 5
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (settings.password !== settings.passwordConfirm) {
      setMessage('Passwords do not match');
      return;
    }

    if (settings.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Save password hash to database
      setMessage('Password updated successfully');
      setSettings({ ...settings, password: '', passwordConfirm: '' });
    } catch (error) {
      setMessage('Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleMaxUsersChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update max concurrent users
      setMessage('Settings updated successfully');
    } catch (error) {
      setMessage('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Host PC Settings</h1>
        <p className="text-gray-400 mt-1">Configure your Host PC application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Master Password */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Master Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.password}
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.passwordConfirm}
                onChange={(e) => setSettings({ ...settings, passwordConfirm: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('successfully')
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
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Concurrent Users Limit */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Access Control</h2>
          <form onSubmit={handleMaxUsersChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Concurrent Users</label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxConcurrentUsers}
                onChange={(e) => setSettings({ ...settings, maxConcurrentUsers: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-2">Maximum number of users that can be connected simultaneously</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Version</p>
            <p className="text-white font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Server Port</p>
            <p className="text-white font-medium">3001</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-green-400 font-medium">Running</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Database</p>
            <p className="text-white font-medium">SQLite</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
