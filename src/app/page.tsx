import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import PackagesSection from '@/components/PackagesSection';
import { MapPin, ShieldCheck, ChevronsDown, Calendar, Users, Search, Star, ArrowRight, Sparkles, CalendarCheck, CreditCard, Heart, Eye, Compass, Mail, Globe } from 'lucide-react';

const imgMap: Record<string, string> = {
  kerala: 'https://picsum.photos/seed/kerala-green/600/400.jpg',
  rajasthan: 'https://picsum.photos/seed/rajasthan-palace/600/400.jpg',
  kedarnath: 'https://picsum.photos/seed/kedarnath-temple/600/400.jpg',
  delhi: 'https://picsum.photos/seed/delhi-monument/600/400.jpg',
  odisha: 'https://picsum.photos/seed/odisha-temple2/600/400.jpg',
  bangalore: 'https://picsum.photos/seed/bangalore-garden/600/400.jpg',
};

export default async function Home() {
  const destinations = await prisma.destination.findMany({
    include: { packages: { orderBy: { duration: 'asc' } } },
    orderBy: { name: 'asc' },
  });

  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section className="hero-section relative min-h-screen flex items-center">
        <div className="absolute top-32 right-16 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] float-anim" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-600/8 rounded-full blur-[120px] float-anim-delay" />
        <div className="absolute top-[30%] left-[15%] w-1 h-1 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)] float-anim-delay2" />
        <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-brand-300 rounded-full shadow-[0_0_10px_rgba(134,239,172,0.5)] float-anim" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8" style={{background:'rgba(255,255,255,0.05)'}}>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Explore {destinations.length}+ Destinations</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] font-black text-white leading-[1.05] tracking-tight mb-7 heading-glow">
                Discover the<br /><span className="text-brand-400" style={{textShadow:'0 0 40px rgba(74,222,128,0.3)'}}>Soul</span> of India
              </h1>
              <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 font-light">
                From the snow-capped peaks of Kedarnath to the tranquil backwaters of Kerala — handcrafted packages for every explorer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14">
                <a href="#packages" className="btn-glow bg-brand-500 text-white font-bold px-9 py-4 rounded-2xl text-center text-sm tracking-wide shadow-xl shadow-brand-500/25">Explore Packages</a>
                <a href="#destinations" className="flex items-center justify-center gap-2 border border-white/15 text-white font-medium px-9 py-4 rounded-2xl text-sm hover:bg-white/5 hover:border-white/25 transition-all" style={{background:'rgba(255,255,255,0.03)'}}>
                  <MapPin className="w-4 h-4 text-brand-400" /> View Destinations
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {[['25+', 'Destinations'], ['5K+', 'Travelers'], ['4.9', 'Rating']].map(([val, label]) => (
                  <div key={label} className="stat-card rounded-2xl px-4 py-5 text-center">
                    <div className="text-3xl font-black text-white">{val}</div>
                    <div className="text-white/35 text-[11px] mt-1 font-medium tracking-wide uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-[4/5]">
                <div className="absolute top-4 right-0 w-[70%] h-[58%] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 float-anim border border-white/10">
                  <img src="https://picsum.photos/seed/kerala-backwaters/600/500.jpg" alt="Kerala" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4"><span className="pill border border-white/20 text-white" style={{background:'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)'}}><MapPin className="w-3 h-3 text-brand-400" /> Kerala</span></div>
                </div>
                <div className="absolute bottom-8 left-0 w-[55%] h-[50%] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 float-anim-delay border border-white/10">
                  <img src="https://picsum.photos/seed/rajasthan-fort/500/450.jpg" alt="Rajasthan" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4"><span className="pill border border-white/20 text-white" style={{background:'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)'}}><MapPin className="w-3 h-3 text-brand-400" /> Rajasthan</span></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl shadow-black/20 p-4 float-anim-delay2 z-10 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-brand-700" /></div>
                    <div><div className="text-sm font-bold text-gray-900">100% Secure</div><div className="text-xs text-gray-500">Razorpay Payments</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator"><ChevronsDown className="w-5 h-5 text-white/25" /></div>
      </section>

      {/* SEARCH BAR */}
      <section className="relative -mt-8 z-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto search-bar rounded-2xl p-4 sm:p-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"><MapPin className="w-5 h-5 text-brand-600 shrink-0" /><input type="text" placeholder="Where do you want to go?" className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" /></div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"><Calendar className="w-5 h-5 text-brand-600 shrink-0" /><input type="text" placeholder="When?" className="w-full sm:w-32 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" /></div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"><Users className="w-5 h-5 text-brand-600 shrink-0" /><select className="w-full sm:w-24 bg-transparent text-sm text-gray-800 outline-none appearance-none cursor-pointer"><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4 Guests</option><option>5+ Guests</option></select></div>
            <button className="btn-glow bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm shrink-0 shadow-lg shadow-brand-700/25"><Search className="w-4 h-4" /> Search</button>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-badge mb-4"><Globe className="w-3.5 h-3.5" /> Popular Destinations</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">Where Will You Go <span className="text-brand-600">Next?</span></h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">Handpicked destinations showcasing India&apos;s incredible diversity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {destinations.map(dest => (
              <a href={`#packages`} key={dest.id} className="dest-card bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 block">
                <div className="relative h-56 overflow-hidden">
                  <img src={imgMap[dest.slug] || imgMap.kerala} alt={dest.name} className="dest-img w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4"><span className="pill bg-white/95 text-brand-800 shadow-sm"><Star className="w-3 h-3 fill-brand-500 text-brand-500" /> {dest.rating}</span></div>
                  <div className="absolute bottom-4 right-4"><span className="pill bg-brand-600 text-white shadow-lg shadow-brand-600/30">{dest.packages.length} Packages</span></div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1.5 mb-3"><MapPin className="w-3.5 h-3.5 text-brand-500" />{dest.tagline}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-700 font-bold text-lg">₹{dest.packages[0]?.pricePerPerson.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">/person</span></span>
                    <span className="text-brand-600 text-sm font-semibold flex items-center gap-1">View Plans <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <PackagesSection destinations={destinations.map(d => ({ name: d.name, slug: d.slug, packages: d.packages }))} />

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-4"><Sparkles className="w-3.5 h-3.5" /> How It Works</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Book in <span className="text-brand-600">4 Simple Steps</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, step: '01', title: 'Choose Destination', desc: 'Browse curated destinations across India.' },
              { icon: CalendarCheck, step: '02', title: 'Select Package', desc: 'Pick a duration that fits your schedule.' },
              { icon: Users, step: '03', title: 'Add Travelers', desc: 'Enter members — total cost auto-calculates.' },
              { icon: CreditCard, step: '04', title: 'Pay Securely', desc: 'Pay via Razorpay — instant confirmation.' },
            ].map(item => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-600 group-hover:shadow-xl group-hover:shadow-brand-600/25 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs font-black text-brand-500 mb-2 tracking-widest">STEP {item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 sm:py-28 px-5 sm:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4"><Heart className="w-3.5 h-3.5 text-brand-400" /><span className="text-white/50 text-xs font-medium tracking-widest uppercase">Traveler Reviews</span></div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">Loved by <span className="text-brand-400">5000+</span> Travelers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', loc: 'Kerala • 7-Day Plan', text: 'The Kerala 7-day package was absolutely magical. The backwater houseboat stay was the highlight. Everything was perfectly organized!', initials: 'PS', color: 'bg-brand-700' },
              { name: 'Rajesh Kumar', loc: 'Kedarnath • 5-Day Plan', text: 'Took my family of 5 on the Kedarnath pilgrimage. The arrangements were seamless — from transport to accommodation. Felt safe throughout.', initials: 'RK', color: 'bg-orange-700' },
              { name: 'Ananya Menon', loc: 'Rajasthan • 10-Day Plan', text: 'Rajasthan in 10 days — forts, deserts, and incredible food. The private cab arrangement was a game-changer. Will definitely book again!', initials: 'AM', color: 'bg-purple-700' },
            ].map(t => (
              <div key={t.name} className="testimonial-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex gap-1 mb-4">{Array(5).fill(null).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>{t.initials}</div>
                  <div><div className="text-white font-semibold text-sm">{t.name}</div><div className="text-white/30 text-xs">{t.loc}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-950 rounded-3xl p-10 sm:p-16 text-center overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/10 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">Ready to Explore India?</h2>
              <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto mb-8">Join 5000+ happy travelers who&apos;ve discovered India through travelIN.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="btn-glow bg-brand-500 text-white font-bold px-8 py-4 rounded-2xl text-sm tracking-wide shadow-xl shadow-brand-500/25">Start Your Journey</button>
                <a href="#packages" className="flex items-center justify-center gap-2 border border-white/15 text-white font-medium px-8 py-4 rounded-2xl text-sm hover:bg-white/5 transition-all"><Eye className="w-4 h-4" />View All Packages</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-950 pt-16 pb-8 px-5 sm:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20"><Compass className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-bold text-white">travel<span className="text-brand-400">IN</span></span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">Discover incredible India with handcrafted travel packages.</p>
              <div className="flex gap-3">
                {['Instagram', 'Twitter', 'Youtube'].map(s => (
                  <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-brand-400 hover:border-brand-500/30 transition-all text-xs font-bold">{s[0]}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Destinations</h4>
              <ul className="space-y-2.5">{destinations.map(d => <li key={d.slug}><a href="#destinations" className="text-gray-600 text-sm hover:text-brand-400 transition-colors">{d.name}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">{['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service'].map(l => <li key={l}><a href="#" className="text-gray-600 text-sm hover:text-brand-400 transition-colors">{l}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2.5">{['Help Center', 'Contact Us', 'Cancellation Policy', 'FAQs'].map(l => <li key={l}><a href="#" className="text-gray-600 text-sm hover:text-brand-400 transition-colors">{l}</a></li>)}</ul>
              <div className="mt-5 flex items-center gap-2 text-gray-600 text-sm"><Mail className="w-4 h-4 text-brand-500" />hello@travelin.in</div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 text-xs">&copy; 2025 travelIN. All rights reserved.</p>
            <div className="flex items-center gap-2 text-gray-700 text-xs"><ShieldCheck className="w-4 h-4 text-brand-600" />Payments secured by Razorpay</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
