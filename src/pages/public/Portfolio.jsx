import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, TrendingUp, ExternalLink, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { portfolioAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

const categories = ['All', 'Coaching', 'Restaurant', 'Clinic', 'Salon', 'E-commerce', 'SaaS', 'Real Estate', 'Education', 'Technology', 'Fitness'];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ['portfolio-public'],
    queryFn: async () => {
      const res = await portfolioAPI.getAll();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const projects = resp?.data || [];

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;

    const f = filter.toLowerCase();
    return projects.filter(p =>
      p.industry?.toLowerCase() === f ||
      p.category?.toLowerCase() === f
    );
  }, [projects, filter]);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <div className="pt-32 text-center text-white">
        Failed to load portfolio. Please try again.
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Portfolio | The Stack Guy</title>
        <meta name="description" content="Explore real client success stories, SaaS builds, and high-conversion websites built by The Stack Guy." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "Portfolio Projects",
            "creator": "The Stack Guy"
          })}
        </script>
      </Helmet>

      <div className="pt-32 pb-24 bg-[#0a0a0f]">
        <div className="container-custom mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          {/* LEFT */}
          <div>
            <div className="badge badge-blue mb-4">Success Stories</div>
            <h1 className="section-title text-5xl md:text-7xl mb-6">
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl text-[#9ca3af] mb-5">
              From simple landing pages to complex business operating systems. We help you scale with world-class design and technology.
            </p>
          </div>

          {/* FILTER */}
          <div className="relative">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="appearance-none bg-white/[0.03] border border-white/10 text-white text-sm font-semibold rounded-xl px-6 pr-12 h-12 focus:outline-none focus:border-blue-500 transition-all cursor-pointer mb-5"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-black text-white">
                  {cat}
                </option>
              ))}
            </select>

            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* GRID */}
        <div className="container-custom mt-5">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-12" layout>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const coverImage =
                  project.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000';

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex flex-col gap-6"
                  >
                    {/* IMAGE */}
                    <div className="relative rounded-3xl overflow-hidden h-[300px]">
                      <img
                        src={coverImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/10 to-transparent" />
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="badge badge-blue bg-blue-600/20 backdrop-blur-md">
                          {project.industry || project.category}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="glass-card p-5 flex flex-col gap-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold text-white group-hover:text-[#3b82f6] transition-colors line-clamp-1">
                          {project.title}
                        </h2>

                        <div className="flex gap-4 shrink-0">
                          <div className="text-center">
                            <p className="text-xs text-[#9ca3af] uppercase font-bold">Traffic</p>
                            <p className="text-lg font-bold text-green-500 flex items-center gap-1">
                              <TrendingUp size={16} /> {project.metrics?.trafficIncrease || '+0%'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#9ca3af] uppercase font-bold">ROI</p>
                            <p className="text-lg font-bold text-green-500">
                              {project.metrics?.conversionRate || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-lg text-[#9ca3af] line-clamp-2">{project.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div>
                          <h4 className="text-white text-sm flex items-center gap-2">
                            <Filter size={14} /> Problem
                          </h4>
                          <p className="text-xs text-[#9ca3af] line-clamp-2">{project.problem || '-'}</p>
                        </div>
                        <div>
                          <h4 className="text-white text-sm flex items-center gap-2">
                            <Layout size={14} /> Solution
                          </h4>
                          <p className="text-xs text-[#9ca3af] line-clamp-2">{project.solution || '-'}</p>
                        </div>
                        <div>
                          <h4 className="text-white text-sm flex items-center gap-2">
                            <TrendingUp size={14} /> Result
                          </h4>
                          <p className="text-xs text-[#10b981] font-bold line-clamp-2">{project.results || '-'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies?.map(t => (
                          <span key={t} className="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] uppercase text-[#6b7280]">
                            {t}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/portfolio/${project.slug}`}
                        className="flex w-full justify-center items-center btn-secondary rounded-xl bg-gray-300 text-black hover:bg-blue-600 hover:text-white transition-colors py-4"
                      >
                        View Full Case Study <ExternalLink size={16} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA */}
        <section className="section pb-0 mt-20">
          <div className="container-custom">
            <div className="glass-card p-16 rounded-[40px] text-center border-[#3b82f6]/20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Want a <span className="gradient-text">Success Story</span> like these?
              </h2>
              <p className="text-lg text-[#9ca3af] mb-12 max-w-2xl mx-auto">
                Tell us about your business and let us build you a digital engine that performs.
              </p>
              <div className="flex gap-6 justify-center">
                <Link to="/book-call" className="btn-primary text-lg px-10">
                  Start Your Project
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-10">
                  Get Estimates
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}