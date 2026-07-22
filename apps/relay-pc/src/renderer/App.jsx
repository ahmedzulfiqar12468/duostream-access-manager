import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import HostConnection from './pages/HostConnection';
import Settings from './pages/Settings';
import ClientDetail from './pages/ClientDetail';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hostConnected, setHostConnected] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={`flex h-screen bg-gray-900 text-gray-100 ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} hostConnected={hostConnected} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard hostConnected={hostConnected} />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/host-connection" element={<HostConnection onConnect={() => setHostConnected(true)} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
