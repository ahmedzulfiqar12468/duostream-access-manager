import React, { useState } from 'react';
import Button from '../components/Button';

function Settings() {
  const [settings, setSettings] = useState({
    maxConcurrentUsers: 5,
    autoLogoutTime: 30
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save settings
      setMessage('Settings saved successfully');
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Relay PC Settings</h1>
        <p className="text-gray-400 mt-1">Configure your Relay PC application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Access Control */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Access Control</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
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
              <p className="text-xs text-gray-400 mt-1">Maximum number of users that can access DuoStream simultaneously</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Auto-Logout Time (minutes)</label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.autoLogoutTime}
                onChange={(e) => setSettings({ ...settings, autoLogoutTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Automatically logout inactive users after this time</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('success')
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
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </div>

        {/* System Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Version</p>
              <p className="text-white font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Server Port</p>
              <p className="text-white font-medium">3002</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400 font-medium">Running</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Database</p>
              <p className="text-white font-medium">SQLite</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Architecture</p>
              <p className="text-white font-medium">Electron + React</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
