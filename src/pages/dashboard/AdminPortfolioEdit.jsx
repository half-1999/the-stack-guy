import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function AdminPortfolioEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    industry: 'technology',
    type: '',
    clientName: '',
    description: '',
    problem: '',
    solution: '',
    results: '',
    liveUrl: '',
    metrics: { trafficIncrease: '', conversionRate: '', revenue: '' },
    technologies: [],
    images: [],
    featured: false
  });

  const [techInput, setTechInput] = useState('');

  const { data: resp, isLoading } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfolioAPI.getById(id),
    onSuccess: (res) => {
      if (res.data) {
        setFormData({
          ...res.data,
          metrics: res.data.metrics || { trafficIncrease: '', conversionRate: '', revenue: '' },
          images: res.data.images || [],
          technologies: res.data.technologies || []
        });
      }
    }
  });

  useEffect(() => {
    if (resp?.data) {
      setFormData({
        ...resp.data,
        metrics: resp.data.metrics || { trafficIncrease: '', conversionRate: '', revenue: '' },
        images: resp.data.images || [],
        technologies: resp.data.technologies || []
      });
    }
  }, [resp]);

  const updateMutation = useMutation({
    mutationFn: (data) => portfolioAPI.update(id, data),
    onSuccess: () => {
      toast.success('Portfolio updated');
      queryClient.invalidateQueries(['admin-portfolio']);
      queryClient.invalidateQueries(['portfolio', id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('metrics.')) {
      const metricName = name.split('.')[1];
      setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [metricName]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      }
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', caption: '', isBefore: false }] }));
  };

  const updateImage = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/portfolio')} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-bold text-white font-display uppercase tracking-widest leading-tight">
            Edit <span className="gradient-text">Case Study</span>
          </h1>
        </div>
        <button onClick={handleSave} disabled={updateMutation.isLoading} className="btn-primary px-8 h-12 uppercase font-bold tracking-widest text-xs">
          {updateMutation.isLoading ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 border-white/5 space-y-6">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Core Details</h2>
            
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Project Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none">
                  {['coaching', 'restaurant', 'clinic', 'salon', 'e-commerce', 'real-estate', 'education', 'technology', 'fitness', 'other'].map(ind => (
                    <option key={ind} value={ind}>{ind.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Project Type</label>
                <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. SaaS Platform" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Client Name</label>
              <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Problem Statement</label>
                <textarea name="problem" value={formData.problem} onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"></textarea>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Solution</label>
                <textarea name="solution" value={formData.solution} onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"></textarea>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-white/5 space-y-6">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Images <span className="text-gray-500 font-normal lowercase">(For showcase and gallery)</span></h2>
            
            <div className="space-y-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/2 p-4 rounded-xl border border-white/5">
                  {img.url ? <img src={img.url} alt="preview" className="w-16 h-16 object-cover rounded-lg shrink-0 bg-white/5" /> : <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-gray-500"/></div>}
                  <div className="flex-1 space-y-3">
                    <input type="url" placeholder="Image URL (Unsplash or direct link)" value={img.url} onChange={(e) => updateImage(idx, 'url', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none" />
                    <input type="text" placeholder="Caption (optional)" value={img.caption} onChange={(e) => updateImage(idx, 'caption', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none" />
                  </div>
                  <button onClick={() => removeImage(idx)} className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button onClick={addImageField} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3b82f6] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-[#3b82f6]/20 hover:border-white/20">
                <Plus size={16} /> Add Image
              </button>
            </div>
          </div>

        </div>

        <aside className="space-y-8">
          <div className="glass-card p-8 border-white/5 space-y-6">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Tech Stack & Meta</h2>
            
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] uppercase font-bold text-blue-400 flex items-center gap-2">
                    {tech} <button onClick={() => removeTech(tech)}><Trash2 size={10} className="hover:text-red-400" /></button>
                  </span>
                ))}
              </div>
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={addTech} placeholder="Type & press Enter" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Live URL</label>
              <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 bg-white/5 border-white/10 rounded accent-blue-500" />
              <label htmlFor="featured" className="text-sm text-white font-medium">Feature this project on homepage</label>
            </div>
          </div>

          <div className="glass-card p-8 border-white/5 space-y-6">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Metrics & Results</h2>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Traffic Increase</label>
              <input type="text" name="metrics.trafficIncrease" value={formData.metrics.trafficIncrease} onChange={handleChange} placeholder="+45%" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Conversion Rate/ROI</label>
              <input type="text" name="metrics.conversionRate" value={formData.metrics.conversionRate} onChange={handleChange} placeholder="+2x" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2 block">Revenue impact (optional)</label>
              <input type="text" name="metrics.revenue" value={formData.metrics.revenue} onChange={handleChange} placeholder="$10k/mo" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
