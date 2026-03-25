import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  IndianRupee, TrendingUp, TrendingDown, Users, 
  Target, Zap, PieChart, Rocket, FileText, 
  Download, Filter, Calendar, Activity, BarChart
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { analyticsAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Analytics() {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const resp = await analyticsAPI.getDashboard();
      return resp.data.data;
    }
  });

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: async () => {
      const resp = await analyticsAPI.getRevenue({ period: '12months' });
      return resp.data.data;
    }
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text('THE STACK GUY - STRATEGIC REPORT', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on: ${now}`, 14, 30);

    // Summary Table
    const summaryData = [
      ['Total Units', 'Current Status'],
      ['Gross Revenue', `INR ${summary?.revenue?.toLocaleString()}`],
      ['Total Active Leads', summary?.leads],
      ['Active Projects', summary?.projects],
      ['Growth Index', `${summary?.revenueGrowth}%`],
      ['Conversion Rate', `${revenueData?.conversionRate}%`]
    ];

    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Lead Sources
    if (summary?.leadsBySource) {
      const leadSources = summary.leadsBySource.map(l => [l._id || 'Organic', l.count]);
      doc.text('Lead Source Distribution', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Channel', 'Volume']],
        body: leadSources,
        theme: 'grid'
      });
    }

    doc.save(`TSG_Strategic_Report_${Date.now()}.pdf`);
  };

  if (isSummaryLoading || isRevenueLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 font-display uppercase tracking-widest leading-tight">
            Agency <span className="gradient-text-blue">Performance</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Advanced metrics and conversion analytics for "THE STACK GUY".
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleExportPDF}
            className="btn-primary h-12 text-[10px] no-underline font-black uppercase tracking-widest px-8 flex items-center gap-2"
          >
            <Download size={16} /> Export Tactical Report
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatsCard 
            label="Gross Revenue" 
            val={`₹${summary?.revenue?.toLocaleString('en-IN') || 0}`} 
            icon={IndianRupee} 
            trend={`${summary?.revenueGrowth >= 0 ? '+' : ''}${summary?.revenueGrowth}%`} 
            color="blue" 
            down={summary?.revenueGrowth < 0}
          />
         <StatsCard label="Lead Score (Avg)" val="78" icon={Target} trend="+5%" color="green" />
         <StatsCard label="Conversion Index" val={`${revenueData?.conversionRate || 0}%`} icon={Activity} trend="TARGET: 25%" color="cyan" />
         <StatsCard label="Support SLA" val="98.8%" icon={Zap} trend="-0.2%" color="orange" down={true} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Monthly Revenue Chart */}
         <div className="lg:col-span-8 glass-card p-10 min-h-[500px] flex flex-col border-white/5 border-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-12 pb-8 border-b border-white/5">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4 italic">
                   <BarChart size={24} className="text-blue-500" /> Revenue Velocity
                </h3>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shadow-glow-blue" /> Actual Pulse
                   </div>
                </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 pt-10">
               {revenueData?.monthlyRevenue?.map((data, i) => {
                  const maxVal = Math.max(...revenueData.monthlyRevenue.map(d => d.revenue), 1);
                  const height = (data.revenue / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar">
                       <div className="relative w-full flex flex-col items-center justify-end h-64">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 5)}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className="w-full bg-blue-600/10 border border-blue-500/20 rounded-t-xl group-hover/bar:bg-blue-600/30 group-hover/bar:border-blue-500/50 transition-all cursor-pointer relative"
                          >
                             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap shadow-glow-blue/20">
                                ₹{data.revenue >= 1000 ? (data.revenue/1000).toFixed(1) + 'K' : data.revenue}
                             </div>
                          </motion.div>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover/bar:text-white transition-colors rotate-45 md:rotate-0 mt-2">
                          {data.month.split(' ')[0]}
                       </span>
                    </div>
                  );
               })}
            </div>
         </div>

         {/* Distribution Summary */}
         <div className="lg:col-span-4 space-y-8">
            <div className="glass-card-premium p-10 bg-white/[0.01] border-white/5">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10 pb-6 border-b border-white/5 flex items-center justify-between italic">
                  Project Status distribution
                  <PieChart size={18} className="text-blue-500" />
               </h3>
               
               <div className="space-y-10">
                  {summary?.projectsByStatus?.map((item, idx) => {
                    const colors = ['bg-blue-500 shadow-glow-blue/20', 'bg-cyan-500 shadow-glow-cyan/20', 'bg-green-500 shadow-glow-green/20', 'bg-purple-500 shadow-glow-purple/20'];
                    const percent = ((item.count / summary.projects) * 100).toFixed(0);
                    return (
                      <div key={idx} className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white flex items-center gap-2 italic">
                              <span className={`w-1.5 h-1.5 rounded-full ${colors[idx % colors.length]}`} />
                              {item._id}
                            </span>
                            <span className="text-gray-500">{percent}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              className={`h-full ${colors[idx % colors.length]}`}
                            />
                         </div>
                      </div>
                    );
                  })}
               </div>

               <div className="mt-12 pt-10 border-t border-white/5 text-center">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] italic mb-2">Core Efficiency</p>
                  <p className="text-2xl font-black text-white font-display uppercase tracking-tighter">OPTIMAL</p>
               </div>
            </div>

            <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/10 text-center relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] group-hover:scale-150 transition-transform duration-1000" />
               <Rocket size={40} className="text-blue-500 mx-auto mb-6 transform group-hover:translate-y-[-10px] transition-transform" />
               <h4 className="text-white font-black mb-3 uppercase tracking-widest italic">Scale Signal</h4>
               <p className="text-[10px] text-gray-500 leading-relaxed mb-8 uppercase font-bold italic tracking-widest">Growth metrics indicate high potential for SaaS vertical expansion.</p>
               <button className="btn-primary w-full justify-center h-12 text-[10px] font-black uppercase tracking-widest no-underline">Initialize Expansion</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatsCard(props) {
   const { label, val, icon: Icon, trend, color, down } = props;
   const colors = {
      blue: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
      green: 'text-[#39ff14] bg-[#39ff14]/5 border-[#39ff14]/10',
      cyan: 'text-[#22d3ee] bg-[#22d3ee]/5 border-[#22d3ee]/10',
      orange: 'text-orange-500 bg-orange-500/5 border-orange-500/10'
   };
   
   return (
      <div className={`glass-card p-10 border-2 transition-all hover:translate-y-[-8px] ${colors[color]} bg-white/[0.02]`}>
         <div className="flex justify-between items-center mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${colors[color]} transform rotate-3`}>
               <Icon size={28} />
            </div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic ${down ? 'text-red-500' : 'text-green-500'}`}>
               {down ? <TrendingDown size={16} /> : <TrendingUp size={16} />} {trend}
            </div>
         </div>
         <h4 className="text-3xl font-black font-display tracking-tighter text-white mb-2 uppercase">{val}</h4>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">{label}</p>
      </div>
   );
}
