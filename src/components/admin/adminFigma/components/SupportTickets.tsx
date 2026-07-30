import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  user: string;
  email: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created: Date;
  lastUpdated: Date;
  messages: number;
}

const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'AI Model not deploying correctly',
    user: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    category: 'Technical',
    priority: 'high',
    status: 'in_progress',
    created: new Date(Date.now() - 2 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 30 * 60000),
    messages: 5,
  },
  {
    id: 'TKT-002',
    subject: 'Question about DAO voting process',
    user: 'Michael Chen',
    email: 'michael.c@example.com',
    category: 'General',
    priority: 'medium',
    status: 'open',
    created: new Date(Date.now() - 5 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 5 * 60 * 60000),
    messages: 1,
  },
  {
    id: 'TKT-003',
    subject: 'Unable to access financial reports',
    user: 'Emma Williams',
    email: 'emma.w@example.com',
    category: 'Access',
    priority: 'urgent',
    status: 'open',
    created: new Date(Date.now() - 30 * 60000),
    lastUpdated: new Date(Date.now() - 30 * 60000),
    messages: 2,
  },
  {
    id: 'TKT-004',
    subject: 'Feature request: Custom dashboard widgets',
    user: 'David Martinez',
    email: 'david.m@example.com',
    category: 'Feature Request',
    priority: 'low',
    status: 'open',
    created: new Date(Date.now() - 24 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 12 * 60 * 60000),
    messages: 3,
  },
  {
    id: 'TKT-005',
    subject: 'Blockchain sync issue resolved',
    user: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    category: 'Technical',
    priority: 'high',
    status: 'resolved',
    created: new Date(Date.now() - 48 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 6 * 60 * 60000),
    messages: 8,
  },
];

export function SupportTickets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showNewTicket, setShowNewTicket] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'in_progress':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Support Tickets
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage customer support requests and inquiries
            </p>
          </div>
          
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tickets</p>
          <p className="text-xl sm:text-2xl">{tickets.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Open</p>
          <p className="text-xl sm:text-2xl text-blue-600">
            {tickets.filter(t => t.status === 'open').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-xl sm:text-2xl text-purple-600">
            {tickets.filter(t => t.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-xl sm:text-2xl text-emerald-600">
            {tickets.filter(t => t.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Subject</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">User</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Priority</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600">Messages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ticket.id}</code>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">{ticket.category}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{ticket.user}</p>
                  <p className="text-xs text-gray-500">{ticket.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs border capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm capitalize">{ticket.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{formatDate(ticket.lastUpdated)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{ticket.messages}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tickets Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ticket.id}</code>
                  <span className={`px-2 py-1 rounded text-xs border capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm mb-1">{ticket.subject}</p>
                <p className="text-xs text-gray-500">{ticket.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm">{ticket.user}</p>
                <p className="text-xs text-gray-500">{ticket.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <span className="text-xs capitalize">{ticket.status.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{ticket.messages}</span>
                </div>
                <span>{formatDate(ticket.lastUpdated)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl mb-4">Create New Ticket</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option>Technical</option>
                    <option>General</option>
                    <option>Access</option>
                    <option>Feature Request</option>
                    <option>Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Priority</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={6}
                  placeholder="Detailed description of the issue..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
