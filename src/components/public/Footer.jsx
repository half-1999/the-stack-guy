import { Link } from 'react-router-dom';
import {
  Zap, Github, Twitter, Linkedin, Instagram,
  Mail, Phone, MapPin, ArrowRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'Blog', path: '/blog' },
        { label: 'Careers', path: '/careers' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Coaching Center Website', path: '/services/coaching-centers' },
        { label: 'Restaurant Website', path: '/services/restaurants' },
        { label: 'Clinic Website', path: '/services/clinics' },
        { label: 'Salon Website', path: '/services/salons' },
        { label: 'E-Commerce Store', path: '/services/e-commerce' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact', path: '/contact' },
        { label: 'Website Audit', path: '/audit' },
        { label: 'Book a Call', path: '/book-call' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#0a0a0f]">

      {/* CTA STRIP */}
      <div className="border-b border-white/5 py-16 px-6 text-center">
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
          READY TO LAUNCH YOUR SYSTEM?
        </h3>
        <p className="text-gray-500 mb-8  mx-auto italic">
          Get your business website + automation system live in 48 hours.
        </p>
        <Link
          to="/book-call"
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:scale-105 hover:shadow-xl transition-all"
        >
          Book Free Strategy Call <ArrowRight size={18} />
        </Link>
      </div>

      {/* MAIN */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
                <Zap size={20} color="#fff" />
              </div>
              <span className="font-black text-2xl text-white uppercase tracking-wider">
                THE STACK GUY
              </span>
            </Link>

            <p className="text-gray-500 mb-8 ">
              We don’t just build websites — we build revenue systems for modern businesses.
              Fast. Scalable. Conversion-focused.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">
                {column.title}
              </h4>

              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-blue-400 hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT */}
          {/* <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">
              Connect
            </h4>

            <ul className="space-y-5">
              <li className="flex gap-3">
                <Mail size={18} className="text-blue-500 mt-1" />
                <span className="text-gray-400 text-sm">
                  hello@thestackguy.in
                </span>
              </li>

              <li className="flex gap-3">
                <Phone size={18} className="text-blue-500 mt-1" />
                <span className="text-gray-400 text-sm">
                  +91 9XXXXXXXXX
                </span>
              </li>

              <li className="flex gap-3">
                <MapPin size={18} className="text-blue-500 mt-1" />
                <span className="text-gray-400 text-sm">
                  India (Remote First)
                </span>
              </li>
            </ul>
          </div> */}
        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
          <p>© {currentYear} THE STACK GUY. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <Link to="/sitemap" className="hover:text-white transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}