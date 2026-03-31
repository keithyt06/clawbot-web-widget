import { useMemo } from "react";
import { ChatWidget } from "./components/ChatWidget";

const products = [
  { name: "Aurora", price: "$49", original: "$89", tag: "BEST SELLER", color: "from-amber-100 to-orange-200", lens: "bg-amber-300/60" },
  { name: "Eclipse", price: "$59", original: "$99", tag: "NEW", color: "from-slate-100 to-slate-200", lens: "bg-slate-400/50" },
  { name: "Nova", price: "$39", original: "$79", tag: "-51%", color: "from-rose-100 to-pink-200", lens: "bg-rose-300/50" },
  { name: "Zenith", price: "$55", original: "$95", tag: "TRENDING", color: "from-sky-100 to-blue-200", lens: "bg-sky-300/50" },
  { name: "Prism", price: "$45", original: "$85", tag: "-47%", color: "from-violet-100 to-purple-200", lens: "bg-violet-300/50" },
  { name: "Drift", price: "$42", original: "$82", tag: "NEW", color: "from-emerald-100 to-teal-200", lens: "bg-emerald-300/50" },
];

const reviews = [
  { name: "Sarah M.", rating: 5, text: "Love my new frames! The quality is amazing for the price. Got so many compliments.", avatar: "S" },
  { name: "James L.", rating: 5, text: "Fast shipping, great packaging. The blue-light glasses are perfect for work.", avatar: "J" },
  { name: "Emily R.", rating: 5, text: "Third pair from LensVue. The prescription is spot on every time.", avatar: "E" },
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function GlassesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="none" className={className}>
      <ellipse cx="16" cy="16" rx="14" ry="12" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="48" cy="16" rx="14" ry="12" stroke="currentColor" strokeWidth="2.5" />
      <path d="M30 14 C32 10 32 10 34 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2 14 L0 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 14 L64 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const userId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("userId") ?? `anon-${crypto.randomUUID().slice(0, 8)}`;
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900">
        {/* ── Promo Bar ── */}
        <div className="bg-gray-900 text-white text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide">
          SUMMER SALE: Buy 1 Get 1 50% OFF + Free Shipping on Orders Over $59
        </div>

        {/* ── Nav ── */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GlassesIcon className="w-8 h-5 text-gray-900" />
                <span className="text-xl font-bold tracking-tight">LensVue</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <a href="#collections" className="hover:text-gray-900 transition-colors">Eyeglasses</a>
                <a href="#products" className="hover:text-gray-900 transition-colors">Sunglasses</a>
                <a href="#products" className="hover:text-gray-900 transition-colors">Blue Light</a>
                <a href="#reviews" className="hover:text-gray-900 transition-colors">Reviews</a>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-gray-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button className="relative text-gray-600 hover:text-gray-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-xl">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                New Collection 2026
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight">
                See the World<br />
                in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">Style</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Premium eyewear at honest prices. Handcrafted frames, prescription-ready lenses,
                and free virtual try-on. Starting at just $29.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#products" className="px-7 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-300/30 text-sm">
                  Shop Now
                </a>
                <button className="px-7 py-3.5 bg-white text-gray-700 rounded-full font-semibold border border-gray-200 hover:border-gray-400 transition-all text-sm">
                  Virtual Try-On
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  Free Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  30-Day Returns
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  1-Year Warranty
                </div>
              </div>
            </div>
            {/* Hero visual */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full opacity-40 blur-3xl" />
                <div className="absolute inset-8 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GlassesIcon className="w-48 h-24 sm:w-64 sm:h-32 text-gray-800 drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  UP TO<br/>60% OFF
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Collections ── */}
        <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Prescription", desc: "From $29", gradient: "from-blue-50 to-indigo-100", icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8zm10 0a1 1 0 100-2 1 1 0 000 2z" },
              { label: "Sunglasses", desc: "From $35", gradient: "from-amber-50 to-yellow-100", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
              { label: "Blue Light", desc: "From $25", gradient: "from-cyan-50 to-sky-100", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { label: "Kids", desc: "From $19", gradient: "from-pink-50 to-rose-100", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
            ].map((c) => (
              <button key={c.label} className={`bg-gradient-to-br ${c.gradient} rounded-2xl p-6 text-left hover:shadow-lg transition-all group`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-700 mb-3">
                  <path d={c.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="font-bold text-gray-900">{c.label}</div>
                <div className="text-sm text-gray-500 mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Products ── */}
        <section id="products" className="bg-gray-50/80 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Trending Now</h2>
                <p className="text-gray-500 mt-1 text-sm">Our most-loved frames this season</p>
              </div>
              <button className="text-sm font-medium text-gray-900 hover:underline hidden sm:block">
                View All &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <div key={p.name} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group cursor-pointer">
                  <div className={`relative bg-gradient-to-br ${p.color} aspect-square flex items-center justify-center p-8`}>
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase">
                      {p.tag}
                    </span>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                    {/* Stylized glasses */}
                    <div className="relative group-hover:scale-105 transition-transform">
                      <div className="flex items-center gap-1">
                        <div className={`w-14 h-10 sm:w-20 sm:h-14 ${p.lens} rounded-[40%] border-2 border-gray-800/70`} />
                        <div className="w-3 h-0.5 bg-gray-800/70 rounded" />
                        <div className={`w-14 h-10 sm:w-20 sm:h-14 ${p.lens} rounded-[40%] border-2 border-gray-800/70`} />
                      </div>
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-800/70 -rotate-12 rounded" />
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-800/70 rotate-12 rounded" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
                      <span className="text-xs text-gray-400 ml-1">(128)</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-lg">{p.price}</span>
                      <span className="text-sm text-gray-400 line-through">{p.original}</span>
                    </div>
                    <button className="mt-3 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", title: "Free Shipping", desc: "On orders over $59" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "30-Day Returns", desc: "No questions asked" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "1-Year Warranty", desc: "On all frames" },
              { icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", title: "Virtual Try-On", desc: "See before you buy" },
            ].map((f) => (
              <div key={f.title}>
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="reviews" className="bg-gray-50/80 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Loved by 50,000+ Customers</h2>
              <div className="flex items-center justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
                <span className="text-sm text-gray-500 ml-2">4.9/5 from 12,000+ reviews</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.name} className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">"{r.text}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">{r.avatar}</div>
                    <div>
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-gray-400">Verified Buyer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold">Get 15% Off Your First Order</h2>
            <p className="text-gray-400 mt-2 text-sm">Join our newsletter for exclusive deals and new arrivals.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-white/40"
              />
              <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GlassesIcon className="w-6 h-4 text-gray-900" />
                  <span className="font-bold">LensVue</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Premium eyewear at honest prices. Designed in Tokyo, crafted for the world.
                </p>
              </div>
              <div>
                <div className="font-semibold mb-3 text-gray-900">Shop</div>
                <div className="space-y-2 text-gray-500">
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Eyeglasses</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Sunglasses</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Blue Light</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Kids Glasses</a></div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3 text-gray-900">Support</div>
                <div className="space-y-2 text-gray-500">
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Shipping Info</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Returns</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Size Guide</a></div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3 text-gray-900">Company</div>
                <div className="space-y-2 text-gray-500">
                  <div><a href="#" className="hover:text-gray-900 transition-colors">About Us</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Press</a></div>
                  <div><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></div>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <span>&copy; 2026 LensVue. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-gray-600">Privacy</a>
                <a href="#" className="hover:text-gray-600">Terms</a>
                <a href="#" className="hover:text-gray-600">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Floating Chat Widget ── */}
      <ChatWidget userId={userId} />
    </>
  );
}
