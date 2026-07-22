import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from 'axios';
import { Plus, Copy, Check, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ account_name: '' });
  const [loading, setLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3002/api/clients', formData);
      setFormData({ account_name: '' });
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900 text-green-200';
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'rejected':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Clients</h1>
          <p className="text-gray-400 mt-1">Create and manage client access tokens</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-700">
              <th className="text-left px-6 py-4 font-semibold">Account Name</th>
              <th className="text-left px-6 py-4 font-semibold">Access Token</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Created</th>
              <th className="text-right px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 font-medium">{client.account_name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {client.user_token.slice(0, 8)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(client.user_token)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Copy token"
                    >
                      {copiedToken === client.user_token ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(client.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/clients/${client.id}`}>
                    <Button variant="secondary" size="sm" className="inline-flex items-center space-x-1">
                      <Eye size={16} />
                      <span>Manage</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No clients created yet. Add one to get started!
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Client"
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <form onSubmit={handleAddClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Account Name</label>
            <input
              type="text"
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              placeholder="e.g., John's Gaming Account"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">A unique name to identify this client</p>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Clients;
