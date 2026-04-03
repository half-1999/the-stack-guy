import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, BookOpen, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { blogAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

const categories = ['All', 'Web Design', 'Digital Marketing', 'SaaS', 'SEO', 'Freelancing', 'Case Study'];

const fallbackImages = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
];

const getFeaturedImage = (post) => {
  if (post?.featuredImage) return post.featuredImage;
  const index = post?._id ? post._id.charCodeAt(0) % fallbackImages.length : 0;
  return fallbackImages[index];
};

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  const page = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const category = useMemo(() => searchParams.get('category') || 'All', [searchParams]);

  // 🔥 Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchValue), 400);
    return () => clearTimeout(t);
  }, [searchValue]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-posts', page, category, debouncedSearch],
    queryFn: async () => {
      const params = { page, limit: 12 };
      if (category !== 'All') params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;

      const resp = await blogAPI.getPublished(params);
      return resp.data;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    retry: 2
  });

  const updateParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    updateParams({ search: searchValue, page: '1' });
  }, [searchValue, updateParams]);

  const handleCategoryChange = useCallback((cat) => {
    updateParams({ category: cat, page: '1' });
  }, [updateParams]);

  const handlePageChange = useCallback((p) => {
    updateParams({ page: p.toString() });
    if (p !== page) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [updateParams, page]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <div className="pt-32 text-center text-white">
        Failed to load posts. Please try again.
      </div>
    );
  }

  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Blog | The Stack Guy</title>
        <meta name="description" content="Explore web development, SaaS, SEO, and freelancing insights by The Stack Guy." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "The Stack Guy Blog",
            "description": "Insights on development, SaaS, SEO"
          })}
        </script>
      </Helmet>

      <div className="pt-32 pb-24 bg-[#0a0a0f]">
        {/* 🔴 UI FULLY PRESERVED */}

        <div className="container-custom mb-16">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="badge badge-blue mb-4">The Stack Guy Blog</div>
            <h1 className="section-title text-4xl md:text-6xl mb-8">
              Ideas & <span className="gradient-text">Insights</span>
            </h1>

            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6b7280]" size={15} />
              <input
                type="text"
                placeholder="Search articles, guides, case studies..."
                className="input-field pl-16 h-18 text-xl rounded-2xl border-white/5 hover:border-white/10 "
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className=" m-5 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold border ${category === cat
                ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                : 'text-[#9ca3af] border-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="container-custom min-h-[600px] mt-10">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className="group glass-card overflow-hidden flex flex-col"
                >
                  <Link to={`/blog/${post.slug}`} className="relative h-60 overflow-hidden">
                    <img
                      src={getFeaturedImage(post)}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </Link>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex gap-4 text-[10px] mb-4">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span>{post.readTime} Min Read</span>
                    </div>

                    <h3 className="text-xl text-white mb-4">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-[#9ca3af] text-sm mb-8">
                      {post.excerpt}
                    </p>

                    <Link to={`/blog/${post.slug}`} className="mt-auto text-blue-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors duration-300 bg-white/5 p-2 rounded-full justify-center">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <BookOpen size={60} />
              <h3>No Articles Found</h3>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-20 flex justify-center gap-8">
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                <ChevronLeft />
              </button>
              <span>{page} / {pagination.pages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page === pagination.pages}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}