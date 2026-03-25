import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Portfolio', path: '/portfolio' },
  {
    label: 'Services', path: '#', children: [
      { label: 'Coaching Centers', path: '/services/coaching-centers' },
      { label: 'Restaurants', path: '/services/restaurants' },
      { label: 'Clinics', path: '/services/clinics' },
      { label: 'Salons', path: '/services/salons' },
      { label: 'E-Commerce', path: '/services/e-commerce' },
    ]
  },
  { label: 'Blog', path: '/blog' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
            <Zap size={18} color="#fff" />
          </div>
          <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
            THE STACK GUY
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative" onMouseEnter={() => link.children && setServicesOpen(true)} onMouseLeave={() => link.children && setServicesOpen(false)}>
              {link.children ? (
                <>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    {link.label} <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-1 py-2 w-48 rounded-xl glass"
                        style={{ border: '1px solid var(--color-border)' }}
                      >
                        {link.children.map((child) => (
                          <Link key={child.path} to={child.path} className="block px-4 py-2 text-sm transition-colors hover:text-white no-underline" style={{ color: 'var(--color-text-secondary)' }}>
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to={link.path} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white no-underline" style={{ color: location.pathname === link.path ? 'var(--color-primary-light)' : 'var(--color-text-secondary)' }}>
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* <Link to="/login" className="text-sm font-medium no-underline" style={{ color: 'var(--color-text-secondary)' }}>
            Login
          </Link> */}
          <Link to="/book-call" className="btn-primary text-sm" style={{ padding: '0.5rem 1.25rem' }}>
            <Zap size={14} /> Book a Call
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="container-custom py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                link.children ? (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{link.label}</p>
                    {link.children.map((child) => (
                      <Link key={child.path} to={child.path} onClick={() => setMobileOpen(false)} className="block px-6 py-2 text-sm no-underline" style={{ color: 'var(--color-text-secondary)' }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium no-underline" style={{ color: 'var(--color-text-secondary)' }}>
                    {link.label}
                  </Link>
                )
              ))}
              <div className="flex gap-3 mt-4 px-3">
                <Link to="/login" className="btn-secondary text-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/book-call" className="btn-primary text-sm flex-1 justify-center" onClick={() => setMobileOpen(false)}>Book a Call</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
