import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import {
  Zap, CheckCircle, Smartphone, Globe, Layout, Users,
  Shield, Rocket, Star
} from 'lucide-react';

import { servicesAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

const iconMap = {
  'coaching-centers': Users,
  'restaurants': Smartphone,
  'clinics': Shield,
  'salons': Layout,
  'e-commerce': Globe
};

export default function ServicePage() {
  const { slug } = useParams();

  const {
    data: service,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['service', slug],
    queryFn: async ({ signal }) => {
      const resp = await servicesAPI.getBySlug(slug, { signal });
      return resp?.data?.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Memoized text processing
  const {
    titleStart,
    titleEnd,
    lastWord,
    heroParts
  } = useMemo(() => {
    if (!service?.title || !service?.hero) {
      return {
        titleStart: '',
        titleEnd: '',
        lastWord: '',
        heroParts: ['', '', '']
      };
    }

    const words = service.title.split(' ');
    const heroWords = service.hero.split(' ');

    return {
      titleStart: words.slice(0, -2).join(' '),
      titleEnd: words.slice(-2).join(' '),
      lastWord: words[words.length - 1],
      heroParts: [
        heroWords.slice(0, 8).join(' '),
        heroWords.slice(8, 12).join(' '),
        heroWords.slice(12).join(' ')
      ]
    };
  }, [service]);

  const ServiceIcon = useMemo(() => iconMap[slug] || Rocket, [slug]);

  if (isLoading) return <LoadingScreen />;

  if (error || !service) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="mb-4">Service not found.</p>
        <button onClick={refetch} className="btn-primary px-6 py-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#0a0a0f]">

      {/* SEO */}
      <Helmet>
        <title>{service.title} | The Stack Guy</title>
        <meta name="description" content={service.hero} />
      </Helmet>

      {/* Hero */}
      <section className="section py-24 md:py-28 bg-gradient-to-b from-[#111118] to-[#0a0a0f]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>

              <div className="badge badge-blue mb-5">Service for Your Industry</div>

              <h1 className="section-title text-5xl md:text-7xl mb-8 leading-tight">
                {titleStart}{' '}
                <span className="gradient-text">{titleEnd}</span>
              </h1>

              <p className="text-2xl text-[#9ca3af] mb-10 leading-relaxed max-w-xl">
                {heroParts[0]}{' '}
                <span className="gradient-text font-semibold">
                  {heroParts[1]}
                </span>{' '}
                {heroParts[2]}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/book-call" className="btn-primary no-underline text-lg px-8 py-4">
                  <Zap size={20} /> Get Started in 3 Days
                </Link>
                <Link to="/contact" className="btn-secondary no-underline text-lg px-8 py-4">
                  Request Custom Quote
                </Link>
              </div>

              <div className="flex gap-10 border-t border-white/5 pt-8">
                <div>
                  <p className="text-3xl font-bold text-white mb-2">48h</p>
                  <p className="text-sm text-[#9ca3af] uppercase font-bold tracking-widest">Speed Delivery</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-2">100%</p>
                  <p className="text-sm text-[#9ca3af] uppercase font-bold tracking-widest">SEO Optimized</p>
                </div>
              </div>

            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
              <div className="relative z-10 p-6 glass-card rounded-3xl">
                <img
                  src={`https://images.unsplash.com/photo-${slug === 'restaurants'
                      ? '1504674900247-0877df9cc836'
                      : slug === 'clinics'
                        ? '1504813184591-01f74f51c471'
                        : '1551434678-e076c223a692'
                    }?auto=format&fit=crop&q=80&w=1000`}
                  alt={service.title}
                  loading="lazy"
                  className="rounded-2xl w-full"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section py-24 md:py-28">
        <div className="container-custom">

          <div className="text-center mb-20">
            <h2 className="section-title">
              Why Your <span className="gradient-text">Business</span> Needs This
            </h2>
            <p className="section-subtitle mx-auto mt-4 max-w-2xl leading-relaxed">
              Specific solutions for growing enterprises in the{' '}
              <span className="text-white font-semibold">{slug}</span> space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service?.features?.map((feature, idx) => (
              <motion.div key={idx} className="glass-card p-8 flex flex-col gap-5" whileHover={{ y: -5 }}>
                <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-lg font-bold text-white leading-tight">{feature}</h4>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="section py-24 md:py-28 bg-gradient-to-t from-[#0a0a0f] to-[#111118]">
        <div className="container-custom">
          <div className="glass-card p-16 rounded-[40px] text-center max-w-5xl mx-auto border-[#39ff14]/10 border-2">

            <Rocket size={60} className="text-[#39ff14] mx-auto mb-8" />

            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white leading-tight">
              Launch Your <span className="gradient-text">{lastWord}</span> Website This Week
            </h2>

            <p className="text-lg text-[#9ca3af] mb-14 max-w-2xl mx-auto leading-relaxed">
              We specialize in creating{' '}
              <span className="text-white font-semibold">{slug}</span>{' '}
              experiences that turn visitors into{' '}
              <span className="gradient-text font-semibold">paying customers</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/book-call" className="btn-primary no-underline text-lg px-12">
                Book Free Consultation
              </Link>
              <Link to="/contact" className="btn-secondary no-underline text-lg px-12">
                Contact via WhatsApp
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=serv${i}`} className="w-8 h-8 rounded-full border-2 border-[#0a0a0f]" />
                ))}
              </div>

              <p className="text-sm font-bold text-white flex items-center gap-1">
                4.9/5 Average Industrial Rating
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}