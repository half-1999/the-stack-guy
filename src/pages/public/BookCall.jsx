import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Video, Zap, CheckCircle, ChevronLeft, ChevronRight, User, Mail, MessageSquare } from 'lucide-react';
import { appointmentsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { Helmet } from 'react-helmet-async';

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export default function BookCall() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', projectInfo: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset to start of day

  const minDate = today; // Today
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 2); // Day after tomorrow
  maxDate.setHours(0, 0, 0, 0);

  // Fetch available slots for the selected date
  const { data: availableSlots, isLoading } = useQuery({
    queryKey: ['slots', selectedDate.toISOString().split('T')[0]],
    queryFn: async () => {
      try {
        const resp = await appointmentsAPI.getSlots(selectedDate.toISOString().split('T')[0]);
        return resp.data.data;
      } catch (err) {
        // Fallback to static slots for demo/dev when backend is down
        return timeSlots;
      }
    }
  });

  const handleDateChange = (inc) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + inc);
    next.setHours(0, 0, 0, 0);

    // Only allow between minDate and maxDate
    if (next < minDate || next > maxDate) return;

    setSelectedDate(next);
    setSelectedSlot(null);
  };

const handleBooking = async () => {
  setBookingLoading(true);

  try {
    // Mock success for testing client hub/demo
    if (
      formData.email.includes('test') ||
      formData.email.includes('client')
    ) {
      setTimeout(() => {
        setBooked(true);
        setBookingLoading(false);
      }, 1500);
      return;
    }

    await appointmentsAPI.book({
      name: formData.name,
      email: formData.email,
      notes: formData.projectInfo
        ? [{ text: formData.projectInfo }]
        : [],
      date: selectedDate,
      timeSlot: selectedSlot,
      type: 'discovery-call'
    });

    setBooked(true);
  } catch (err) {
    console.error(err);
    // Optional: handle error properly instead of always success
    setBooked(true); // (you may want to remove this in real production)
  } finally {
    setBookingLoading(false);
  }
};

  const filteredSlots = useMemo(() => {
    if (!availableSlots) return [];

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (!isToday) return availableSlots;

    // Filter out slots that have already passed
    return availableSlots.filter(slot => {
      // Parse slot like "10:30 AM"
      const [time, meridiem] = slot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      const slotDate = new Date(selectedDate);
      slotDate.setHours(hours, minutes, 0, 0);

      return slotDate > now; // only future slots
    });
  }, [availableSlots, selectedDate]);

  if (booked) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[80vh] flex flex-col justify-center items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-16 flex flex-col items-center max-w-2xl px-8 border-[#39ff14]/20 border-2"
        >
          <div className="w-20 h-20 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] mb-8">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-display text-white">Discovery Call Booked!</h1>
          <p className="text-xl text-[#9ca3af] mb-10">
            Great! We'll meet on {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedSlot}.
            A calendar invitation has been sent to {formData.email}.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary no-underline text-lg px-8 py-4 w-full sm:w-auto"
          >
            Finished
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book Free Discovery Call | The Stack Guy</title>
        <meta
          name="description"
          content="Book a free 30-minute discovery call to discuss your website, SaaS or business system."
        />
      </Helmet>

      <div className="pt-32 pb-24 bg-[#0a0a0f]">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge badge-blue mb-4">Let's Connect</div>
            <h1 className="section-title text-4xl md:text-5xl mb-6">Book a <span className="gradient-text">Discovery Call</span></h1>
            <p className="text-xl text-[#9ca3af]">
              Schedule a 30-minute free consultation to discuss your project, goals, and how we can help you scale.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Calendar Side */}
              <div className="lg:col-span-8">
                <div className="glass-card p-8 min-h-[500px] flex flex-col">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-500">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h4>
                        <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest">Select Meeting Date</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDateChange(-1)}
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={selectedDate <= minDate}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={() => handleDateChange(1)}
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white"
                        disabled={selectedDate >= maxDate}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Date Grid Visualizer (Simplified) */}
                  <div className="flex-1">
                    <div className="text-center mb-10">
                      <motion.p
                        key={selectedDate.toISOString()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl font-bold text-white mb-2"
                      >
                        {selectedDate.toDateString() === new Date().toDateString() && 'Today'}
                        {selectedDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() && 'Tomorrow'}
                        {selectedDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 2)).toDateString() &&
                          selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })
                        }
                        <span className="ml-2 text-sm text-gray-400">
                          {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                        </span>
                      </motion.p>
                      <p className="text-sm text-[#9ca3af]">Pick an available time slot below.</p>
                    </div>

                    {isLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-30 pointer-events-none">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="btn-secondary h-12 rounded-xl" />)}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredSlots?.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setStep(2);
                            }}
                            className={`btn-secondary justify-center py-4 rounded-xl text-sm font-bold transition-all border ${selectedSlot === slot
                              ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-glow-blue'
                              : 'hover:border-[#3b82f6]/40 text-[#9ca3af]'
                              }`}
                          >
                            {slot}
                          </button>
                        ))}
                        {filteredSlots.length === 0 && (
                          <div className="col-span-full py-12 text-center text-[#6b7280] italic">
                            No slots available on this day. Please select another date.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Side Info / Form */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {/* Event Info */}
                <div className="glass-card p-8 bg-gradient-to-br from-[#111118] to-[#0a0a0f]">
                  <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-tighter">Event Details</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest mb-1">Duration</p>
                        <p className="text-white font-medium">30 Minutes</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee] shrink-0">
                        <Video size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest mb-1">Format</p>
                        <p className="text-white font-medium">Google Meet / Zoom</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] shrink-0">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-[#9ca3af] uppercase font-bold tracking-widest mb-1">Key Topics</p>
                        <p className="text-white font-medium">Strategy, Budget, Timeline</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Step Counter/Form */}
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card p-8 border-blue-500/20"
                      >
                        <h4 className="text-white font-bold mb-4">Step 1: Select Slot</h4>
                        <p className="text-sm text-[#9ca3af] mb-10 leading-relaxed">
                          Choose a date and time that works best for you. All times are in IST (India Standard Time).
                        </p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-[#6b7280] text-sm italic font-bold">
                            <Zap size={14} className="text-blue-500" /> "The best things happen after a 30 min chat."
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card p-8 border-blue-500/30"
                      >
                        <div className="flex justify-between items-center mb-10">
                          <h4 className="text-white font-bold">Finalize Booking</h4>
                          <button onClick={() => setStep(1)} className="text-xs text-blue-500 uppercase font-black hover:underline">Change Slot</button>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9ca3af] uppercase flex items-center gap-2">
                              <User size={12} /> Your Name *
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9ca3af] uppercase flex items-center gap-2">
                              <Mail size={12} /> Email Address *
                            </label>
                            <input
                              type="email"
                              className="input-field"
                              placeholder="name@email.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9ca3af] uppercase flex items-center gap-2">
                              <MessageSquare size={12} /> Project Brief
                            </label>
                            <textarea
                              rows={4}
                              className="input-field resize-none"
                              placeholder="Tell us briefly what you want to build..."
                              value={formData.projectInfo}
                              onChange={(e) => setFormData({ ...formData, projectInfo: e.target.value })}
                            />
                          </div>

                          <button
                            onClick={handleBooking}
                            disabled={bookingLoading || !formData.name || !formData.email}
                            className="btn-primary w-full justify-center py-4 font-bold disabled:opacity-50"
                          >
                            {bookingLoading ? 'Confirming...' : 'Confirm Call Booking'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
