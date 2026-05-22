import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-950/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Grade Management
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">
            Features
          </a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-sm">
            Testimonials
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
