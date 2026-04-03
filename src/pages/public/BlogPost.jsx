import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Twitter, Linkedin, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { blogAPI } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function BlogPost() {
  const { slug } = useParams();

  const fallbackImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop'
  ];

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const resp = await blogAPI.getBySlug(slug);
      return resp.data.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 2
  });

  const getFeaturedImage = (post) => {
    if (post?.featuredImage) return post.featuredImage;
    const index = post?._id ? post._id.charCodeAt(0) % fallbackImages.length : 0;
    return fallbackImages[index];
  };

  const featuredImage = post ? getFeaturedImage(post) : fallbackImages[0];

  const getRelatedImage = (rel) => {
    if (rel?.featuredImage) return rel.featuredImage;
    const index = rel?._id ? rel._id.charCodeAt(0) % fallbackImages.length : 0;
    return fallbackImages[index];
  };

  const category = post?.category;

  const { data: related } = useQuery({
    queryKey: ['related-posts', category],
    enabled: !!category,
    queryFn: async () => {
      const resp = await blogAPI.getPublished({ category, limit: 3 });
      return resp.data.data.filter(p => p._id !== post._id);
    },
    staleTime: 1000 * 60 * 10
  });

  const formattedDate = useMemo(() => {
    if (!post) return '';
    return new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [post]);

  if (isLoading) return <LoadingScreen />;

  if (error || !post) {
    return (
      <div className="pt-32 pb-24 text-center text-white">
        Article not found.{' '}
        <Link to="/blog" className="text-blue-500 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{post.title} | The Stack Guy</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": featuredImage,
            "author": { "@type": "Organization", "name": "The Stack Guy" },
            "datePublished": post.publishedAt
          })}
        </script>
      </Helmet>

      <div className=" bg-[#0a0a0f] text-white">

        {/* HEADER */}
        <header className="relative py-20 overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-3">
                <span className="badge badge-blue">{post.category}</span>
                <span className="badge badge-green">{post.readTime} MIN READ</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold mb-2 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-2 gap-4 md:gap-0">
                <div>
                  <h4 className="text-white font-bold">The Stack Guy Team</h4>
                  <p className="text-xs text-gray-400 mt-1">Published {formattedDate}</p>
                </div>

                <div className="flex gap-4">
                  <button className="btn-secondary"><Twitter size={18} /></button>
                  <button className="btn-secondary"><Linkedin size={18} /></button>
                  <button className="btn-secondary"><Share2 size={18} /></button>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* FEATURED IMAGE */}
        <section className="mb-20 mx-auto px-4 mt-2">
          <motion.div className="relative h-[250px] md:h-[500px] rounded-[40px] overflow-hidden shadow-lg">
            <img
              src={featuredImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div> 
        </section>

        {/* MAIN CONTENT */}
        <div className="container-custom mx-auto px-4 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* BLOG CONTENT */}
            <main className="lg:col-span-8">
              <div className="space-y-6 text-white">

                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />

                <style jsx="true">{`
      .blog-content h2 { color: #a78bfa; font-weight: 1000; font-size: 2rem; margin-bottom: 1rem; }
      .blog-content h3 { color: #4ade80; font-weight: 600; margin-bottom: 0.75rem; }
      .blog-content p { color: #fff; margin-bottom: 1rem; line-height: 1.7; }
      .blog-content ul { color: #facc15; margin-bottom: 1rem; padding-left: 1.25rem; }
      .blog-content ol { color: #fcd34d; margin-bottom: 1rem; padding-left: 1.25rem; }
      .blog-content li { margin-bottom: 0.5rem; }
      .blog-content blockquote { border-left: 4px solid #f87171; padding-left: 1rem; color: #f9a8d4; font-style: italic; margin-bottom: 1rem; }
      .blog-content a { color: #06b6d4; text-decoration: underline; }
      .blog-content strong { color: #f97316; font-weight: 700; }
      .blog-content em { color: #6366f1; font-style: italic; }
    `}</style>

              </div>

              {/* TAGS */}
              {post.tags?.length > 0 && (
                <div className="mt-16 flex flex-wrap gap-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 border text-xs font-semibold rounded-md bg-gray-800 text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </main>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4 space-y-10 sticky top-24 h-fit">

              {/* CTA */}
              <div className="glass-card p-10 text-center">
                <Zap size={40} />
                <h4 className="text-white font-bold mt-4">Need a website like this?</h4>
                <Link to="/book-call" className="btn-primary mt-6 w-full">
                  Get Free Consultation
                </Link>
              </div>

              {/* RELATED POSTS */}
              <div>
                <h3 className="text-white mb-6">Related Posts</h3>
                {related?.map(rel => (
                  <Link key={rel._id} to={`/blog/${rel.slug}`} className="flex gap-4 mb-4 hover:bg-gray-800 p-2 rounded-md transition">
                    <img src={getRelatedImage(rel)} className="w-20 h-20 object-cover rounded-xl" loading="lazy" />
                    <div>
                      <h4 className="text-white text-sm font-semibold">{rel.title}</h4>
                      <p className="text-xs text-gray-400">{rel.readTime} min</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* SEO / CTA BLOCK */}
              <div className="glass-card p-6">
                <TrendingUp />
                <p className="text-xs text-gray-400 mt-4">
                  Want SEO strategy for your {post.category}?
                </p>
              </div>

            </aside>
          </div>
        </div>

      </div>
    </>
  );
}