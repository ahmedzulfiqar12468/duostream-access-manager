import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circle } from 'lucide-react';

function RelayConnections() {
  const [relays, setRelays] = useState([]);

  useEffect(() => {
    fetchRelays();
    const interval = setInterval(fetchRelays, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRelays = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/relay-connections');
      setRelays(response.data);
    } catch (error) {
      console.error('Error fetching relays:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Relay PC Connections</h1>
        <p className="text-gray-400 mt-1">Monitor connected relay PCs via Tailscale</p>
      </div>

      {/* Relays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relays.map((relay) => (
          <div key={relay.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{relay.relay_name}</h3>
                <p className="text-gray-400 text-sm font-mono">{relay.relay_ip}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Circle
                  size={12}
                  className={`${
                    relay.status === 'active'
                      ? 'fill-green-500 text-green-500'
                      : 'fill-gray-600 text-gray-600'
                  }`}
                />
                <span className={`text-xs font-medium ${
                  relay.status === 'active' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {relay.status === 'active' ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Last Connected:</span>
                <span className="text-gray-300">
                  {relay.last_connected ? new Date(relay.last_connected).toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Created:</span>
                <span className="text-gray-300">{new Date(relay.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {relays.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No relay connections found</p>
          <p className="text-sm mt-2">Relay PCs will appear here when they connect via Tailscale</p>
        </div>
      )}
    </div>
  );
}

export default RelayConnections;
