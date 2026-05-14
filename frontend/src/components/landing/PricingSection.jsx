import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['Up to 100 users', 'Basic analytics', 'Email support', 'Community access'],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best for growing teams',
    features: ['Unlimited users', 'Advanced analytics', 'Priority support', 'Role management', 'API access', 'Custom integrations'],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'For large organizations',
    features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom deployment', 'Audit logs'],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 mb-4">
            Pricing
          </span>
          <h2 className="text-4xl font-bold text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl relative ${
                plan.featured
                  ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 md:scale-105 shadow-xl shadow-indigo-500/10'
                  : 'bg-gray-900/50 border border-white/10'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 text-lg">/mo</span>
              </div>

              <ul className="space-y-3 mt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-8 block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'border border-white/20 hover:border-white/40 text-white hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
