const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO at TechStart',
    quote: 'UserFlow transformed how we handle authentication. The role-based access saved us weeks of development time.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'Marc Dubois',
    role: 'Lead Developer at ScaleUp',
    quote: 'The 3D dashboard and real-time analytics give us incredible visibility into our user base. Highly recommended.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Emily Chen',
    role: 'Product Manager at CloudNine',
    quote: 'We migrated from a custom solution and saw immediate improvements in security and developer experience.',
    gradient: 'from-cyan-500 to-indigo-500',
  },
];

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20 mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-white">
            Loved by developers worldwide
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            See what teams are saying about their experience with UserFlow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-gray-800/50 border border-white/5 hover:border-purple-500/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mt-4 text-sm italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
