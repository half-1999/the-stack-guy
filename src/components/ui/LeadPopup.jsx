import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, User, Briefcase, CheckCircle } from 'lucide-react';
import { leadsAPI } from '../../services/api';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'lead_popup_state';
const getState = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
};
const setState = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export default function LeadPopup() {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { register, handleSubmit, reset } = useForm();
    const timerRef = useRef(null);

    // Auto popup on page load (except dashboard)
    useEffect(() => {
        if (location.pathname.startsWith('/dashboard')) return;
        const state = getState();
        if (state.blockUntil && Date.now() < state.blockUntil) return;

        timerRef.current = setTimeout(() => setOpen(true), 120000);
        return () => clearTimeout(timerRef.current);
    }, [location.pathname]);

    // Trigger popup externally (phone click)
    useEffect(() => {
        const openPopup = () => setOpen(true);
        window.addEventListener('open-lead-popup', openPopup);
        return () => window.removeEventListener('open-lead-popup', openPopup);
    }, []);

    // Close popup and manage localStorage blocking
    const closePopup = () => {
        setOpen(false);
        const state = getState();
        const closes = (state.closes || 0) + 1;
        if (closes >= 3) {
            setState({ closes: 0, blockUntil: Date.now() + 2 * 60 * 60 * 1000 });
        } else {
            setState({ ...state, closes });
        }
    };

    // Submit form
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await leadsAPI.create({
                name: data.name || 'Guest',
                email: data.email || 'leads@thestackguy.com',
                phone: data.phone || '9999999999',
                projectType: data.projectType || 'Quick Lead',
                budget: data.budget || 'Not specified',
                message: data.message || 'Auto popup lead',
                source: data.source || 'popup',
            });

            setState({ closes: 0, blockUntil: Date.now() + 2 * 60 * 60 * 1000 });
            setSubmitted(true);
            reset();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Reset after success
    const handleReset = () => {
        setSubmitted(false);
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="glass-card relative max-w-2xl w-full p-8 space-y-4"
                    >
                        {/* Close */}
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 text-white/50 hover:text-white text-xl cursor-pointer"
                        >
                            ✕
                        </button>

                        {!submitted ? (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-2">Let’s Build Something 🚀</h3>
                                <p className="text-sm text-[#9ca3af] mb-6">
                                    Drop your details & we’ll reach out fast.
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-1 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={15} />
                                        <input
                                            {...register('name')}
                                            placeholder="Your Name"
                                            className="input-field pl-10 bg-white/5 focus:border-blue-500/50"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-1 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={15} />
                                        <input
                                            {...register('email')}
                                            placeholder="Email"
                                            className="input-field pl-10 bg-white/5 focus:border-blue-500/50"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-1 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={15} />
                                        <input
                                            {...register('phone')}
                                            placeholder="Phone"
                                            className="input-field pl-10 bg-white/5 focus:border-green-500/50"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`btn-primary w-full py-3 flex items-center justify-center gap-2 transition-all duration-300
                                        ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                                    >
                                         {loading ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit
                                                    <CheckCircle size={18} />
                                                </>
                                            )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.4 }}
                            className="text-center space-y-5 p-8"
                        >
                            {/* Animated Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto"
                            >
                                <CheckCircle size={36} className="text-green-400" />
                            </motion.div>

                            {/* Heading */}
                            <h3 className="text-2xl font-semibold text-white">
                                Submission Successful 🎉
                            </h3>

                            {/* Message */}
                            <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xs mx-auto">
                                Thanks for reaching out. Our team has received your details and will
                                get in touch with you shortly.
                            </p>

                            {/* CTA Button */}
                            <button
                                onClick={handleReset}
                                className="mt-4 px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 
                                text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                            >
                                Close
                            </button>
                        </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}