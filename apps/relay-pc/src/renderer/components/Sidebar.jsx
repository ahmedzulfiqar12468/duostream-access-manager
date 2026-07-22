import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Settings, Moon, Sun, LogOut, Wifi, WifiOff } from 'lucide-react';

function Sidebar({ toggleDarkMode, isDarkMode, hostConnected }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/host-connection', label: 'Host Connection', icon: '🔗' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold text-blue-400">DuoStream Relay</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Host Connection Status */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {hostConnected ? (
            <>
              <Wifi size={16} className="text-green-400" />
              {isOpen && <span className="text-sm text-green-400">Connected</span>}
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-400" />
              {isOpen && <span className="text-sm text-red-400">Disconnected</span>}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isOpen && <span>{isDarkMode ? 'Light' : 'Dark'}</span>}
        </button>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors">
          <LogOut size={20} />
          {isOpen && <span>Exit</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
