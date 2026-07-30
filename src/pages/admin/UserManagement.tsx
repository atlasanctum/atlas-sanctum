// @ts-nocheck
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Shield,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const UserManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    email: string;
    displayName: string;
    role: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    lastLogin: string | null;
    accountLocked: boolean;
    createdAt: string;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock data - in real app, this would come from API
  const users = [
    {
      id: "1",
      email: "john.doe@example.com",
      displayName: "John Doe",
      role: "investor",
      emailVerified: true,
      mfaEnabled: true,
      lastLogin: "2024-01-15T10:30:00Z",
      accountLocked: false,
      createdAt: "2023-06-15T08:00:00Z"
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      displayName: "Jane Smith",
      role: "individual",
      emailVerified: true,
      mfaEnabled: false,
      lastLogin: "2024-01-14T15:45:00Z",
      accountLocked: false,
      createdAt: "2023-08-22T12:30:00Z"
    },
    {
      id: "3",
      email: "admin@atlas-sanctum.com",
      displayName: "Admin User",
      role: "admin",
      emailVerified: true,
      mfaEnabled: true,
      lastLogin: "2024-01-15T09:15:00Z",
      accountLocked: false,
      createdAt: "2023-01-01T00:00:00Z"
    },
    {
      id: "4",
      email: "locked@example.com",
      displayName: "Locked User",
      role: "individual",
      emailVerified: false,
      mfaEnabled: false,
      lastLogin: null,
      accountLocked: true,
      createdAt: "2023-12-01T10:00:00Z"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && !user.accountLocked) ||
                         (statusFilter === "locked" && user.accountLocked) ||
                         (statusFilter === "unverified" && !user.emailVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = async (userData: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    accountLocked: boolean;
  }) => {
    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'User updated successfully!' });
      setIsEditDialogOpen(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      case 'investor': return 'default';
      default: return 'outline';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
            <Button className="mt-4 sm:mt-0 gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-foreground">{users.filter(u => !u.accountLocked).length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Locked Accounts</p>
                    <p className="text-2xl font-bold text-foreground">{users.filter(u => u.accountLocked).length}</p>
                  </div>
                  <ShieldX className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'admin').length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.displayName || 'No name'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.accountLocked ? (
                              <Badge variant="destructive">Locked</Badge>
                            ) : user.emailVerified ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Unverified</Badge>
                            )}
                            {user.mfaEnabled && <ShieldCheck className="w-4 h-4 text-green-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (open) setSelectedUser(user);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information and permissions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-role">Role</Label>
                                  <Select defaultValue={user.role}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="individual">Individual</SelectItem>
                                      <SelectItem value="investor">Investor</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={() => handleEditUser(user)} disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                  </Button>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagement;