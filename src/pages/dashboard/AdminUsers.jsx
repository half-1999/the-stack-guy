import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter,
  MoreHorizontal, Trash2, Shield, User,
  Mail, Phone, Clock, CheckCircle,
  Zap, ArrowRight, ExternalLink, Globe,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function AdminUsers() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const resp = await authAPI.getUsers();
      return resp.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => authAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  if (!isAdmin) return <div className="p-20 text-center">Unauthorized.</div>;
  if (isLoading) return <LoadingScreen />;

  const filteredUsers = users?.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Client <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Manage your network of business owners, partners, and administrators.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => {
              const name = prompt('Name:');
              const email = prompt('Email:');
              const password = prompt('Password (min 6 chars):');
              const role = prompt('Role (admin/client/student):', 'client');
              if (name && email && password && role) {
                authAPI.createUser({ name, email, password, role }).then(() => {
                  toast.success('User created!');
                  queryClient.invalidateQueries(['admin-users']);
                }).catch(err => toast.error(err.response?.data?.error || 'Failed to create user'));
              }
            }}
            className="btn-primary h-12 text-xs no-underline font-black uppercase tracking-widest px-8 shadow-glow-blue/20"
          >
            <UserPlus size={16} className="mr-2" /> Add User
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsBox label="Total Users" val={users?.length || 0} icon={Users} color="blue" />
        <StatsBox label="Active Clients" val={users?.filter(u => u.role === 'client').length || 0} icon={User} color="green" />
        <StatsBox label="Students" val={users?.filter(u => u.role === 'student').length || 0} icon={Zap} color="orange" />
        <StatsBox label="Administrators" val={users?.filter(u => u.role === 'admin').length || 0} icon={Shield} color="cyan" />
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden border-2 border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a11] border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">User / Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Role & Tier</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Phone / Business</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Joined Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="group hover:bg-white/2 transition-colors">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] flex items-center justify-center text-white text-xs font-black uppercase shadow-glow-blue/5 border border-white/5">
                        {u.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tighter">{u.name}</p>
                        <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                      <span className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-2 max-w-fit ${
                        u.role === 'admin' ? 'text-[#3b82f6] bg-blue-500/10 border-blue-500/20 shadow-glow-blue/5' : 
                        u.role === 'student' ? 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-glow-orange/5' :
                        'text-[#6b7280] bg-white/5 border-white/5'
                        }`}>
                        {u.role === 'admin' ? <Shield size={10} /> : u.role === 'student' ? <Zap size={10} /> : <User size={10} />}
                        {u.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-sm font-bold text-white">{u.phone || 'No Phone'}</p>
                    <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest italic">{u.company || 'Not Provided'}</p>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-sm text-white font-bold">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest italic">2026</p>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <button 
                        title="Edit User"
                        onClick={() => {
                          const name = prompt('New Name (leave blank to keep current):', u.name);
                          const role = prompt('New Role (admin/client/student):', u.role);
                          if (name || role) {
                            authAPI.updateUser(u._id, { name: name || u.name, role: role || u.role }).then(() => {
                              toast.success('User updated!');
                              queryClient.invalidateQueries(['admin-users']);
                            }).catch(err => toast.error('Update failed'));
                          }
                        }}
                        className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all"
                      >
                        <User size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this user?')) deleteMutation.mutate(u._id)
                        }}
                        className="h-10 w-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-[#9ca3af] hover:text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center opacity-30 italic text-sm text-[#4b5563]">
                    No users matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Account Growth Insight */}
      <div className="p-10 glass-card bg-gradient-to-r from-green-600/10 to-transparent border-green-500/10 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] opacity-30 rounded-full" />
        <div className="flex gap-8 items-center relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-green-500/10 flex items-center justify-center text-[#39ff14] border border-[#39ff14]/20 shadow-glow-green/10">
            <Globe size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-widest leading-none">New Global Partners</h4>
            <p className="text-sm font-medium text-[#9ca3af] italic">
              Our system has successfully auto-onboarded {users?.filter(u => u.role === 'client').length || 0} clients across Tier-2 cities in the last 30 days.
            </p>
          </div>
        </div>
        <button className="btn-secondary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 border-white/5 text-white">Generate User Report</button>
      </div>
    </div>
  );
}

function StatsBox({ label, val, icon: Icon, color }) {
  const colors = {
    blue: 'text-[#3b82f6] bg-blue-500/10 border-blue-500/20 shadow-glow-blue/5',
    green: 'text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/20 shadow-glow-green/5',
    cyan: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20 shadow-glow-cyan/5',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-glow-orange/5'
  };

  return (
    <div className={`glass-card p-8 border-2 transition-transform hover:scale-105 ${colors[color]}`}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
        <Icon size={16} className="opacity-40" />
      </div>
      <h4 className="text-4xl font-black font-display tracking-wider leading-none text-white">{val}</h4>
    </div>
  );
}
