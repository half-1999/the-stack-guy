import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Zap, CheckCircle, MessageSquare, Briefcase } from 'lucide-react';
import { leadsAPI } from '../../services/api';

const testimonials = [
  {
    initials: 'RK',
    name: 'Rajesh Khanna',
    location: 'Nagpur',
    rating: 5,
    message: "The Stack Guy team delivered our restaurant website in just 48 hours. The lead generation system is amazing!",
    bg: 'from-[#111118] to-[#0a0a0f]'
  },
  {
    initials: 'PS',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    message: "Amazing experience! Our e-commerce site launched without a single issue and looks stunning.",
    bg: 'from-[#1a1a25] to-[#0f0f15]'
  },
  {
    initials: 'AK',
    name: 'Ankit Kumar',
    location: 'Delhi',
    rating: 4,
    message: "Professional team, very responsive, and delivered exactly what we needed on time.",
    bg: 'from-[#111118] to-[#0a0a0f]'
  },
  {
    initials: 'SM',
    name: 'Sonia Mehra',
    location: 'Bangalore',
    rating: 5,
    message: "Our SaaS platform was built efficiently and the UX is fantastic. Highly recommended!",
    bg: 'from-[#1c1c1c] to-[#0b0b0f]'
  },
  {
    initials: 'RV',
    name: 'Rohan Verma',
    location: 'Chennai',
    rating: 5,
    message: "Quick, reliable, and scalable solutions. The Stack Guy nailed it!",
    bg: 'from-[#111118] to-[#0a0a0f]'
  }
];

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  projectType: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(10),
  urgency: z.string().default('medium'),
});

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);


  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const projectTypes = useMemo(() => [
    'Business Website', 'E-commerce', 'Portfolio', 'Landing Page',
    'Mobile App (PWA)', 'Web App / SaaS', 'SEO Optimization', 'Branding / UI Design'
  ], []);

  const budgetRanges = useMemo(() => [
    '₹5,000 - ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000+'
  ], []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { urgency: 'medium' }
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Auto-slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 1000ms = 1 second

    return () => clearInterval(interval);
  }, []);

  const onSubmit = useCallback(async (data) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    abortControllerRef.current = new AbortController();

    try {
      await leadsAPI.create({
        ...data,
        source: 'contact-page'
      }, { signal: abortControllerRef.current.signal });

      if (!isMountedRef.current) return;

      setSubmitted(true);
      reset();

    } catch (err) {
      if (!isMountedRef.current) return;

      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.';

      setError(message);

    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isSubmittingRef.current = false;
      }
    }
  }, [reset]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleResetForm = useCallback(() => {
    setSubmitted(false);
  }, []);

  if (submitted) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[80vh] flex flex-col justify-center items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-16 flex flex-col items-center max-w-2xl px-8"
        >
          <div className="w-20 h-20 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] mb-8">
            <CheckCircle size={40} />
          </div>

          <h1 className="text-4xl font-bold mb-4 font-display text-white">
            Message Sent Successfully!
          </h1>

          <p className="text-xl text-[#9ca3af] mb-10">
            Thank you for reaching out to THE STACK GUY. Our team will review your requirements and get back to you within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleGoHome} className="btn-primary text-lg px-8 py-4">
              Back to Home
            </button>
            <button onClick={handleResetForm} className="btn-secondary text-lg px-8 py-4">
              Send Another Message
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Contact The Stack Guy | Build Your Digital Product</title>
        <meta name="description" content="Contact The Stack Guy to build your website, SaaS, or digital product. Fast delivery, scalable systems." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact The Stack Guy",
            "description": "Reach out for web development and SaaS solutions"
          })}
        </script>
      </Helmet>

      <div className="pt-32 pb-24">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="badge badge-blue mb-4">Contact Us</div>
            <h1 className="section-title text-4xl md:text-6xl mb-6">Let's Build Your <span className="gradient-text">Digital Engine</span></h1>
            <p className="text-xl text-[#9ca3af]">
              Whether you need a simple website or a complex SaaS system, we are here to help you scale.
              Fill out the form below and let's get started.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Side */}
            <div className="flex flex-col gap-8">
              {/* Info Cards */}
              <div className="glass-card p-8 flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email Us</h4>
                  <a
                    href="mailto:theestackguy@gmail.com"
                    className="text-[#9ca3af] text-sm hover:text-blue-400 transition"
                  >
                    theestackguy@gmail.com
                  </a>
                </div>
              </div>

              <div className="glass-card p-8 flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Call / WhatsApp</h4>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-lead-popup'))}
                    className="text-[#9ca3af] text-sm hover:text-green-400 transition text-left"
                  >
                    +91 8218X XXXXX
                  </button>
                  <p className="text-[#9ca3af] text-sm">(Mon-Sat, 10 AM - 7 PM IST)</p>
                </div>
              </div>

              <div className="glass-card p-8 flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee] shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Our Location</h4>
                  <p className="text-[#9ca3af] text-sm">Available globally for remote projects.</p>
                </div>
              </div>

              {/* Testimonial Snippet */}
              {/* <div className="glass-card p-8 bg-gradient-to-br from-[#111118] to-[#0a0a0f] border-blue-500/20">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="text-white italic text-sm mb-4 font-medium leading-relaxed">
                  "The Stack Guy team delivered our restaurant website in just 48 hours. The lead generation system is amazing!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-black uppercase">RK</div>
                  <div>
                    <h6 className="text-[xs] font-bold text-white">Rajesh Khanna</h6>
                    <p className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-widest">Nagpur</p>
                  </div>
                </div>
              </div> */}
              <div className="relative w-full max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className={`glass-card p-8 bg-gradient-to-br ${testimonials[current].bg} border-blue-500/20`}
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonials[current].rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-white italic text-sm mb-4 font-medium leading-relaxed">
                      "{testimonials[current].message}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-black uppercase">
                        {testimonials[current].initials}
                      </div>
                      <div>
                        <h6 className="text-[xs] font-bold text-white">{testimonials[current].name}</h6>
                        <p className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-widest">
                          {testimonials[current].location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                  <button
                    onClick={prev}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 md:p-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af] flex items-center gap-2">
                      <MessageSquare size={14} /> Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Enter your name"
                      className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af] flex items-center gap-2">
                      <Mail size={14} /> Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="name@company.com"
                      className={`input-field ${errors.email ? 'border-red-500/50' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af] flex items-center gap-2">
                      <Phone size={14} /> Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="+91 00000 00000"
                      className={`input-field ${errors.phone ? 'border-red-500/50' : ''}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af] flex items-center gap-2">
                      <Briefcase size={14} /> Company Name (Optional)
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      placeholder="Your Business Name"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af]">
                      Project Type *
                    </label>

                    <select
                      {...register('projectType')}
                      className={`input-field 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        focus:border-blue-500/50 
        focus:bg-white/10 
        transition-all duration-300
        ${errors.projectType ? 'border-red-500/50' : ''}
      `}
                    >
                      {projectTypes.map(type => (
                        <option key={type} value={type} className="bg-[#0a0a0f] text-white">
                          {type}
                        </option>
                      ))}
                    </select>

                    {errors.projectType && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#9ca3af]">
                      Estimated Budget *
                    </label>

                    <select
                      {...register('budget')}
                      className={`input-field 
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        focus:border-blue-500/50 
        focus:bg-white/10 
        transition-all duration-300
        ${errors.budget ? 'border-red-500/50' : ''}
      `}
                    >
                      {budgetRanges.map(range => (
                        <option key={range} value={range} className="bg-[#0a0a0f] text-white">
                          {range}
                        </option>
                      ))}
                    </select>

                    {errors.budget && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#9ca3af]">How can we help you? *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell us about your project requirements and goals..."
                    className={`input-field resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <Zap size={14} className="text-[#3b82f6]" />
                    <span className="text-xs text-[#9ca3af]">We usually respond within 24 hours.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-auto px-12 py-4 justify-center"
                  >
                    {loading ? 'Sending Message...' : (
                      <>
                        Send Message <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500 font-bold bg-red-500/10 p-4 rounded-lg border border-red-500/20"
                    >
                      Error: {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Star({ size, fill, color, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}