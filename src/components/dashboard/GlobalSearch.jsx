import { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { User, FileText, Calendar, Folder, MessageCircle, LayoutDashboard, Book } from "lucide-react";

const typeColors = {
  Lead: "bg-blue-600 text-white",
  Project: "bg-green-600 text-white",
  Invoice: "bg-yellow-500 text-black",
  Appointment: "bg-purple-600 text-white",
  User: "bg-pink-500 text-white",
  Message: "bg-indigo-500 text-white",
  Blog: "bg-red-500 text-white",
  Portfolio: "bg-teal-500 text-white",
  Other: "bg-gray-500 text-white",
};

const typeIcons = {
  Lead: <User size={14} />,
  Project: <LayoutDashboard size={14} />,
  Invoice: <FileText size={14} />,
  Appointment: <Calendar size={14} />,
  User: <User size={14} />,
  Message: <MessageCircle size={14} />,
  Blog: <Book size={14} />,
  Portfolio: <Folder size={14} />,
  Other: <LayoutDashboard size={14} />,
};

export default function GlobalSearch({ showSearch, setShowSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset search when modal closes
  useEffect(() => {
    if (!showSearch) {
      setQuery("");
      setResults({});
      setLoading(false);
    }
  }, [showSearch]);

  const fetchResults = async (value) => {
    if (!value) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/search", { params: { q: value } });

      const grouped = data.reduce((acc, item) => {
        const type = item.type || "Other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      }, {});

      setResults(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(debounce(fetchResults, 400)).current;

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleNavigate = (type, id) => {
    setShowSearch(false);
    switch(type) {
      case "Lead": navigate(`/dashboard/leads/${id}`); break;
      case "Project": navigate(`/dashboard/projects/${id}`); break;
      case "Invoice": navigate(`/dashboard/invoices/${id}`); break;
      case "Appointment": navigate(`/dashboard/appointments/${id}`); break;
      case "User": navigate(`/dashboard/users/${id}`); break;
      case "Message": navigate(`/dashboard/messages/${id}`); break;
      case "Blog": navigate(`/dashboard/blogs/${id}`); break;
      case "Portfolio": navigate(`/dashboard/portfolios/${id}`); break;
      default: navigate("/"); break;
    }
  };

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSearch(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-3xl bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-lg"
          >
            <input
              autoFocus
              value={query}
              onChange={handleChange}
              placeholder="Search Leads, Projects, Invoices, Appointments..."
              className="w-full bg-transparent outline-none text-white text-lg p-3 rounded-xl border border-white/20 focus:border-blue-500 transition"
            />

            {loading && <p className="text-xs text-gray-400 mt-2 animate-pulse">Searching...</p>}

            <div className="mt-4 space-y-5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {Object.keys(results).length > 0 ? (
                Object.entries(results).map(([type, items]) => (
                  <div key={type}>
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${typeColors[type]}`}>
                        {typeIcons[type]} <span className="ml-1">{type}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          onClick={() => handleNavigate(type, item.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition"
                        >
                          <div>
                            <p className="text-sm text-white font-medium">{item.name}</p>
                            <p className="text-xs text-gray-400 font-mono">
                              ID: <span className="font-bold">{item.id}</span>
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColors[type]} flex items-center`}>
                            {typeIcons[type]} <span className="ml-1">{type}</span>
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : query && !loading ? (
                <p className="text-sm text-gray-500">No results found</p>
              ) : (
                <p className="text-sm text-gray-500">Try: "Leads", "Projects", "Invoices", "Appointments"</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}