import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Sessions from './pages/Sessions';
import Settings from './pages/Settings';
import RelayConnections from './pages/RelayConnections';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [connectedRelays, setConnectedRelays] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={`flex h-screen bg-gray-900 text-gray-100 ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard connectedRelays={connectedRelays} activeSessions={activeSessions} />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/relay-connections" element={<RelayConnections />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
