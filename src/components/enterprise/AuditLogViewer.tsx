/**
 * Audit Log Viewer Component
 * 
 * Enterprise-grade audit log viewer with filtering, search, and export capabilities.
 * Provides comprehensive visibility into all system actions.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuditLogs } from '@/hooks/useAuditLogs';

interface AuditLog {
  id: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  errorMessage?: string;
  timestamp: Date;
}

interface AuditFilters {
  userId?: string;
  action?: string;
  resource?: string;
  status?: string;
  from?: Date;
  to?: Date;
}

export const AuditLogViewer = () => {
  const [filters, setFilters] = useState<AuditFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { data: logs, loading, error, refetch } = useAuditLogs(filters);

  // Filter logs by search query
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.resource.toLowerCase().includes(query) ||
      log.resourceId?.toLowerCase().includes(query) ||
      log.userId?.toLowerCase().includes(query) ||
      JSON.stringify(log.details).toLowerCase().includes(query)
    );
  });

  // Toggle row expansion
  const toggleRow = (logId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  // Toggle log selection
  const toggleSelection = (logId: string) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogs(newSelected);
  };

  // Select all logs
  const selectAll = () => {
    if (selectedLogs.size === filteredLogs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(filteredLogs.map(log => log.id)));
    }
  };

  // Export selected logs
  const exportLogs = async (format: 'csv' | 'json') => {
    const selectedData = filteredLogs.filter(log => selectedLogs.has(log.id));
    
    if (format === 'csv') {
      const csv = convertToCSV(selectedData);
      downloadFile(csv, `audit-logs-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(selectedData, null, 2);
      downloadFile(json, `audit-logs-${Date.now()}.json`, 'application/json');
    }
  };

  // Convert logs to CSV
  const convertToCSV = (data: AuditLog[]): string => {
    const headers = ['timestamp', 'user_id', 'action', 'resource', 'resource_id', 'status', 'ip_address'];
    const rows = data.map(log => [
      log.timestamp,
      log.userId || '',
      log.action,
      log.resource,
      log.resourceId || '',
      log.status,
      log.ipAddress || '',
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
  };

  // Download file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const config = {
      success: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
      failure: { color: 'bg-red-500/10 text-red-500', icon: XCircle },
      warning: { color: 'bg-amber-500/10 text-amber-500', icon: AlertTriangle },
    };
    const { color, icon: Icon } = config[status as keyof typeof config];

    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  // Truncate user agent
  const truncateUserAgent = (userAgent?: string) => {
    if (!userAgent) return '-';
    return userAgent.length > 50 ? `${userAgent.substring(0, 50)}...` : userAgent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive tracking of all system actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Filter Audit Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Action Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Action</label>
                  <Select
                    value={filters.action || 'all'}
                    onValueChange={(value) =>
                      setFilters({ ...filters, action: value === 'all' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      <SelectItem value="user.login">User Login</SelectItem>
                      <SelectItem value="user.logout">User Logout</SelectItem>
                      <SelectItem value="riu.create">RIU Create</SelectItem>
                      <SelectItem value="riu.update">RIU Update</SelectItem>
                      <SelectItem value="riu.delete">RIU Delete</SelectItem>
                      <SelectItem value="project.create">Project Create</SelectItem>
                      <SelectItem value="project.update">Project Update</SelectItem>
                      <SelectItem value="project.delete">Project Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resource Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Resource</label>
                  <Select
                    value={filters.resource || 'all'}
                    onValueChange={(value) =>
                      setFilters({ ...filters, resource: value === 'all' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All resources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All resources</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="riu">RIU</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="measurement">Measurement</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value === 'all' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failure">Failure</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={filters.from?.toISOString().split('T')[0] || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, from: e.target.value ? new Date(e.target.value) : undefined })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="date"
                      value={filters.to?.toISOString().split('T')[0] || ''}
                      onChange={(e) =>
                        setFilters({ ...filters, to: e.target.value ? new Date(e.target.value) : undefined })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="w-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      {selectedLogs.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
        >
          <span className="text-sm font-medium">
            {selectedLogs.size} log{selectedLogs.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLogs('csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLogs('json')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </motion.div>
      )}

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedLogs.size === filteredLogs.length && filteredLogs.length > 0}
                    onChange={selectAll}
                    className="cursor-pointer"
                  />
                </TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading audit logs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center text-red-500">
                      <AlertTriangle className="w-6 h-6 mr-2" />
                      <span>Failed to load audit logs</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No audit logs found matching your criteria
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedLogs.has(log.id)}
                          onChange={() => toggleSelection(log.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {log.action}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.resource}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{log.userId || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(log.id)}
                        >
                          {expandedRows.has(log.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(log.id) && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/30">
                          <div className="p-4 space-y-4">
                            {/* Details */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Details</h4>
                              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>

                            {/* User Agent */}
                            {log.userAgent && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2">User Agent</h4>
                                <p className="text-sm text-muted-foreground">
                                  {truncateUserAgent(log.userAgent)}
                                </p>
                              </div>
                            )}

                            {/* Error Message */}
                            {log.errorMessage && (
                              <div>
                                <h4 className="text-sm font-semibold mb-2 text-red-500">Error</h4>
                                <p className="text-sm text-red-500">{log.errorMessage}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredLogs.length} of {logs.length} audit logs</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
};
