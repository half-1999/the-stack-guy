import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ExternalLink,
  TrendingUp,
  Layout,
  Globe,
  Smartphone,
  ArrowRight,
  Calendar,
  DollarSign,
} from 'lucide-react';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../../services/api';

export default function ProjectDetail() {
  const { id } = useParams();

  const { data: resp, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getOne(id),
  });

  if (isLoading) return <LoadingScreen />;

  const project = resp?.data?.data;

  if (!project) {
    return (
      <div className="pt-32 pb-24 bg-[#0a0a0f] min-h-screen flex items-center justify-center">
        <h1 className="text-3xl text-white">Project not found</h1>
      </div>
    );
  }

  const estimatedEnd = new Date(project.estimatedEndDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className=" mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase font-display">
          {project.title}
        </h1>
        <p className="text-xl text-[#9ca3af] italic leading-relaxed mb-6">{project.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <span className="badge badge-blue bg-blue-600/20 backdrop-blur-md uppercase font-bold">
            {project.type}
          </span>
          <span className="badge badge-green bg-green-600/20 backdrop-blur-md uppercase font-bold">
            {project.status}
          </span>
          <span className="badge badge-purple bg-purple-600/20 backdrop-blur-md uppercase font-bold">
            Priority: {project.priority}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className=" mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Section */}
        <div className="lg:col-span-8 space-y-16">
          {/* Client Info */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <Globe size={28} className="text-blue-400" />
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
                Client Details
              </h2>
            </div>
            <div className="text-[#9ca3af] space-y-2">
              <p>
                <strong>Name:</strong> {project.clientId.name}
              </p>
              <p>
                <strong>Company:</strong> {project.clientId.company}
              </p>
              <p>
                <strong>Email:</strong> {project.clientId.email}
              </p>
            </div>
          </section>

          {/* Pricing & Payment */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign size={28} className="text-green-400" />
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
                Pricing & Payment
              </h2>
            </div>
            <div className="text-[#9ca3af] space-y-2">
              <p>
                <strong>Amount:</strong> {project.pricing.amount} {project.pricing.currency}
              </p>
              <p>
                <strong>Payment Type:</strong> {project.pricing.paymentType}
              </p>
              <p>
                <strong>Payment Status:</strong> {project.paymentStatus} ({project.amountPaid}/
                {project.pricing.amount})
              </p>
            </div>
          </section>

          {/* Progress Tracker */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <Layout size={28} className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
                Progress Tracker
              </h2>
            </div>

            <div className="space-y-2">
              <p className="text-[#9ca3af] mb-2">Project Progress: {project.progress}%</p>
              <div className="relative w-full bg-white/10 rounded-full h-5">
                <div
                  className="bg-blue-500 h-5 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
                {project.milestones &&
                  project.milestones.map((m, idx) => {
                    const left = project.progress >= (100 / project.milestones.length) * (idx + 1)
                      ? `${((idx + 1) / project.milestones.length) * 100}%`
                      : `${((idx + 1) / project.milestones.length) * 100}%`;
                    return (
                      <motion.div
                        key={m._id}
                        className={`absolute top-0 -translate-x-1/2 w-5 h-5 rounded-full border-2 ${m.status === 'completed' ? 'bg-green-500 border-green-400' : 'bg-white/10 border-gray-500'
                          }`}
                        style={{ left }}
                      />
                    );
                  })}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {project.milestones?.map((m) => (
                  <span key={m._id}>{m.title}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <section className="glass-card p-6">
              <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-widest mb-4">
                Technologies Used
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
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="glass-card-premium p-10 border-white/5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-300 text-sm">Estimated End: {estimatedEnd}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-gray-400" />
                <span className="text-gray-300 text-sm">
                  {project.pricing.amount} {project.pricing.currency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-gray-400" />
                <span className="text-gray-300 text-sm">Payment Status: {project.paymentStatus}</span>
              </div>
            </div>

            <button className="btn-primary w-full justify-center py-4 flex items-center text-white font-bold hover:scale-105 transition-transform">
              View Live Project <ExternalLink size={16} className="ml-2" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}