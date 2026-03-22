import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { portfolioAPI } from '../../services/api';
import { Layout, ArrowRight, ExternalLink, Filter, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function PortfolioDetail() {
  const { slug } = useParams();

  const {
    data: resp,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => portfolioAPI.getBySlug(slug),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!slug
  });

  const project = resp?.data?.data;

  // 🔥 Memoized values (performance)
  const coverImage = useMemo(() => {
    return project?.images?.[0]?.url ||
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200';
  }, [project]);

  const metrics = useMemo(() => project?.metrics || {}, [project]);

  const gallery = useMemo(() => {
    return project?.images?.length > 1 ? project.images.slice(1) : [];
  }, [project]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !project) {
    return (
      <div className="pt-32 pb-24 bg-[#0a0a0f] min-h-screen flex items-center justify-center">
        <h1 className="text-3xl text-white">
          Project not found
        </h1>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0a0a0f] min-h-screen">

      {/* SEO */}
      <Helmet>
        <title>{project.title} | Portfolio | The Stack Guy</title>
        <meta name="description" content={project.description} />
        <meta name="keywords" content={project.technologies?.join(', ')} />

        {/* Open Graph */}
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={coverImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            image: coverImage,
            author: {
              "@type": "Organization",
              name: "The Stack Guy"
            }
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div className="container-custom mb-16">


        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 mb-6">
            <span className="badge badge-blue bg-blue-600/20 backdrop-blur-md uppercase font-bold">
              {project.industry || project.category}
            </span>
            {project.type && (
              <span className="badge badge-green bg-green-600/20 backdrop-blur-md uppercase font-bold">
                {project.type}
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tight font-display">
            {project.title}
          </h1>

          <p className="text-xl text-[#9ca3af] italic leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[40px] overflow-hidden aspect-video border border-white/5 shadow-2xl shadow-blue-500/10"
        >
          <img
            src={coverImage}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Core Grid */}
      <div className="container-custom mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">

            {project.problem && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Filter size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-white font-display uppercase tracking-wider">
                    The Challenge
                  </h2>
                </div>
                <p className="text-lg text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
                  {project.problem}
                </p>
              </section>
            )}

            {project.solution && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Layout size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-white font-display uppercase tracking-wider">
                    The Solution
                  </h2>
                </div>
                <p className="text-lg text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
                  {project.solution}
                </p>
              </section>
            )}

            {project.results && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <TrendingUp size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-white font-display uppercase tracking-wider">
                    The Results
                  </h2>
                </div>
                <p className="text-lg text-[#9ca3af] leading-relaxed whitespace-pre-wrap p-8 glass-card border-green-500/20 shadow-glow-green/10">
                  {project.results}
                </p>
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <section className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-8 font-display uppercase">
                  Gallery Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="glass-card overflow-hidden group">
                      <div className="relative aspect-video">
                        <img
                          src={img.url}
                          alt={img.caption || "Gallery image"}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      {img.caption && (
                        <div className="p-4 text-sm text-gray-400 font-medium">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="glass-card-premium p-10 border-white/5 space-y-10">

              {project.liveUrl && (
                <div>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center h-14 text-sm font-bold uppercase tracking-widest shadow-glow-blue/20"
                  >
                    View Live Project <ExternalLink size={18} className="ml-2" />
                  </a>
                </div>
              )}

              {(metrics.trafficIncrease || metrics.conversionRate || metrics.revenue) && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-6">
                    Impact Metrics
                  </h3>

                  <div className="space-y-6">
                    {metrics.trafficIncrease && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                          Traffic Growth
                        </p>
                        <p className="text-3xl font-black text-white font-display flex items-center gap-2">
                          <TrendingUp size={24} className="text-green-500" /> {metrics.trafficIncrease}
                        </p>
                      </div>
                    )}

                    {metrics.conversionRate && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                          Conversion / ROI
                        </p>
                        <p className="text-3xl font-black text-white font-display">
                          {metrics.conversionRate}
                        </p>
                      </div>
                    )}

                    {metrics.revenue && (
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                          Revenue Impact
                        </p>
                        <p className="text-3xl font-black text-green-500 font-display">
                          {metrics.revenue}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {project.technologies?.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-4">
                    Core Technology
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] uppercase font-bold text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}