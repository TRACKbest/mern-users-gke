import { Link } from 'react-router-dom';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'Integrations'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy'],
};

export default function FooterSection() {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              UserFlow
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Modern user management platform built for developers who demand security and performance.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 UserFlow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
              Twitter
            </span>
            <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
              GitHub
            </span>
            <span className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
              Discord
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
