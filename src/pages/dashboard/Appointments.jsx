import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Video, Zap,
  CheckCircle, ChevronLeft, ChevronRight,
  User, Mail, MessageSquare, MoreHorizontal,
  Trash2, Plus, ExternalLink, ShieldCheck, Phone, BookOpen, Clock3, X, Link
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import { appointmentsAPI } from '../../services/api';
export default function Appointments() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState('upcoming');
  const [showCalendly, setShowCalendly] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [newNote, setNewNote] = useState('');

  const { data: resp, isLoading } = useQuery({
    queryKey: ['appointments', activeView],
    queryFn: async () => {
      // For now fetching all appointments for admin
      const res = await appointmentsAPI.getAll();
      return res.data;
    }
  });

  const appointments = resp?.data || [];

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await appointmentsAPI.update(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      setSelectedApp(null);
      setMeetingLink('');
    }
  });

  const handleApprove = (app) => {
    updateMutation.mutate({
      id: app._id,
      data: { status: 'confirmed', meetingLink }
    });
  };

  return (
    <>
      <div className="space-y-16 pb-32">
        {/* OS Branding Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className=""
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
      bg-blue-600/10 border border-blue-500/20 text-xs font-bold 
      uppercase tracking-wider text-blue-400 mb-5 font-display">
              <Clock3 size={14} /> Live Sync Active
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl 
      font-black text-white mb-5 font-display uppercase 
      tracking-tight leading-[0.9]">
              Booking <span className="gradient-text-blue">Engine</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-400 italic 
      font-medium leading-relaxed">
              Direct access to the technical stack for project kick-offs,
              code reviews, and strategy sessions.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button 
              onClick={() => {
                const name = prompt('Client Name:');
                const email = prompt('Client Email:');
                const date = prompt('Date (YYYY-MM-DD):');
                const timeSlot = prompt('Time Slot (e.g. 10:00 AM):');
                const type = prompt('Type (discovery-call/consultation/project-review):', 'discovery-call');
                if (name && email && date && timeSlot) {
                  appointmentsAPI.createManual({ name, email, date, timeSlot, type }).then(() => {
                    toast.success('Booking created!');
                    queryClient.invalidateQueries(['appointments']);
                  }).catch(err => toast.error('Failed to create booking'));
                }
              }}
              className="h-12 px-8 rounded-[16px] bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-glow-blue/20 flex items-center gap-3 hover:bg-blue-500 transition-all border-none"
            >
              <Plus size={18} /> Manual Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-16">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {showCalendly ? (
                <motion.div
                  key="calendly"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="glass-card-premium h-[700px] border-white/5 bg-white/[0.02] relative overflow-hidden flex flex-col items-center justify-center p-20 text-center"
                >
                  <div className="absolute top-6 left-12 flex items-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> External Engine Integrated
                  </div>
                  <div className="max-w-md space-y-10">
                    <div className="w-24 h-24 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-500 animate-float">
                      <Calendar size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-widest font-display">Schedule via Calendly</h3>
                    <p className="text-gray-500 italic italic leading-relaxed">Your developer's availability is synced. Select a slot to confirm your next technical sprint session.</p>

                    {/* Mock Calendly Link Action */}
                    <button
                      onClick={() => setShowCalendly(false)}
                      className="btn-primary w-full h-16 justify-center"
                    >
                      Open Scheduler <ExternalLink size={20} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {appointments.length === 0 && !isLoading && (
                    <div className="glass-card p-10 text-center text-gray-500 border-white/5">
                      No appointments found.
                    </div>
                  )}
                  {appointments.map((app, i) => {
                    const d = new Date(app.date);
                    const month = d.toLocaleString('default', { month: 'short' });
                    const day = d.getDate();

                    return (
                      <motion.div
                        key={app._id}
                        onClick={() => { setSelectedApp(app); setMeetingLink(app.meetingLink || ''); }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 flex flex-col md:flex-row items-center gap-12 border-white/5 hover:bg-white/[0.04] group relative overflow-hidden cursor-pointer"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.03] blur-[60px] pointer-events-none" />

                        <div className="w-32 h-32 rounded-[32px] bg-white/[0.03] border-2 border-white/5 flex flex-col items-center justify-center shrink-0 group-hover:border-blue-500/30 transition-all">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">{month}</p>
                          <p className="text-5xl font-black text-white font-display leading-none">{day}</p>
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-2xl font-black text-white font-display uppercase tracking-widest leading-none shrink-0 group-hover:text-blue-500 transition-colors">{app.type.replace('-', ' ')}</h3>
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${app.status === 'confirmed' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                              {app.status}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-8 border-t border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-3"><Clock3 size={16} className="text-blue-500" /> {app.timeSlot}</div>
                            <div className="flex items-center gap-3"><User size={16} className="text-blue-500" /> {app.name || app.clientId?.name}</div>
                            {app.email && <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /> {app.email}</div>}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* <button
                    onClick={() => setShowCalendly(true)}
                    className="w-full glass-card border-dashed border-2 border-white/10 p-12 flex flex-col items-center gap-6 hover:border-blue-500/50 transition-all bg-white/[0.02]"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <Plus size={32} />
                    </div>
                    <p className="text-xs font-black text-white uppercase tracking-[0.3em]">Initialize New Session Protocol</p>
                  </button> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <aside className="lg:col-span-4 space-y-12">
            <div className="glass-card p-12 bg-white/[0.02] border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
              <ShieldCheck size={48} className="text-blue-500 mb-8 transform group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-black text-white mb-6 uppercase tracking-widest font-display leading-none">Security Verified</h4>
              <p className="text-sm font-medium text-gray-500 italic leading-relaxed mb-10">
                All strategy calls are encrypted and held on secure infrastructure. Session recordings are accessible within your OS after 2 hours.
              </p>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                    <CheckCircle size={14} className="text-green-500/50" /> Protocol-Grade {i === 1 ? 'Encryption' : 'Auth'}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-premium p-12 border-blue-500/10 text-center">
              <BookOpen size={40} className="text-gray-700 mx-auto mb-8" />
              <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-6">Development Resources</h5>
              <div className="space-y-3">
                {['API Docs', 'Client Workflow', 'SLA Agreement'].map(doc => (
                  <button key={doc} className="w-full h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                    {doc} <ChevronRight size={14} className="ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </aside> */}
        </div>
      </div>

      {/* ✅ Modal OUTSIDE */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden p-8"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-widest font-display">
                    Meeting Details
                  </h3>
                  <div className="text-gray-500 mt-2 flex items-center gap-2">
                    <Clock3 size={16} />
                    {new Date(selectedApp.date).toLocaleDateString()} at {selectedApp.timeSlot}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className="space-y-6">

                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-6 border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase mb-2">
                      Client Name
                    </p>
                    <p className="text-white flex items-center gap-2">
                      <User size={16} className="text-blue-500" />
                      {selectedApp.name || selectedApp.clientId?.name}
                    </p>
                  </div>

                  <div className="glass-card p-6 border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase mb-2">
                      Email
                    </p>
                    <p className="text-white flex items-center gap-2 truncate">
                      <Mail size={16} className="text-blue-500" />
                      {selectedApp.email}
                    </p>
                  </div>

                  <div className="glass-card p-6 border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase mb-2">
                      Type & Status
                    </p>
                    <p className="text-white capitalize">
                      {selectedApp.type?.replace('-', ' ')} -{" "}
                      <span className={selectedApp.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'}>
                        {selectedApp.status}
                      </span>
                    </p>
                  </div>

                  <div className="glass-card p-6 border-white/5 col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase mb-4">
                      Protocol Log / Notes
                    </p>
                    <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedApp.notes && selectedApp.notes.length > 0 ? (
                        selectedApp.notes.map((n, idx) => (
                          <div key={idx} className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <p className="text-sm text-gray-300">{n.text}</p>
                            <p className="text-[9px] text-gray-600 mt-2 uppercase font-black">
                              {new Date(n.date).toLocaleString()} • {n.author || 'Admin'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic text-sm text-center py-4">No notes on record.</p>
                      )}
                    </div>
                    {user?.role === 'admin' && (
                      <div className="mt-4 flex gap-2">
                        <input 
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add internal note..."
                          className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                        />
                        <button 
                          onClick={() => {
                            if (!newNote) return;
                            appointmentsAPI.addNote(selectedApp._id, newNote).then((res) => {
                              toast.success('Note added');
                              setNewNote('');
                              setSelectedApp(res.data.data);
                              queryClient.invalidateQueries(['appointments']);
                            });
                          }}
                          className="h-10 px-4 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg text-white"
                        >
                          ADD
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ADMIN PANEL */}
                {user?.role === 'admin' && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="Meeting link..."
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white"
                    />

                    <button
                      onClick={() => handleApprove(selectedApp)}
                      className="btn-primary w-full mt-4 h-12"
                    >
                      {selectedApp.status === 'confirmed'
                        ? 'Update Link'
                        : 'Approve & Send'}
                    </button>
                  </div>
                )}

                {/* CLIENT VIEW */}
                {selectedApp.meetingLink && user?.role !== 'admin' && (
                  <a
                    href={selectedApp.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full flex justify-center h-12"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

  );
}
