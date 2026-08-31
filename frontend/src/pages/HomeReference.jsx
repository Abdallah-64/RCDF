import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { get } from '../services/api';
import { Loading, Notice } from '../components/States';

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/contact', 'Contact']];

function ReferenceHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 border-b border-slate-300 bg-[#faf9fb]"><div className="shell flex h-20 items-center justify-between"><Link aria-label="RCDF home" to="/"><img className="h-14 w-auto object-contain" src="/rcdf-logo.png" alt="RCDF — Rajo Consultancy and Development Firm"/></Link><nav className="hidden items-center gap-8 md:flex">{links.map(([to, label]) => <NavLink key={to} className={({ isActive }) => `border-b-2 pb-1 text-sm font-semibold ${isActive ? 'border-green text-green' : 'border-transparent text-slate-600 hover:text-green'}`} to={to}>{label}</NavLink>)}</nav><Link className="hidden rounded-lg bg-[#000f22] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0a2540] md:block" to="/contact">Support us</Link><button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X /> : <Menu />}</button></div>{open && <nav className="shell flex flex-col gap-4 border-t py-5 md:hidden">{links.map(([to,label]) => <NavLink key={to} onClick={() => setOpen(false)} className="font-semibold text-slate-700" to={to}>{label}</NavLink>)}</nav>}</header>;
}

function ReferenceFooter({ settings }) {
  return <footer className="mt-16 bg-[#efedf0]"><div className="shell grid gap-8 py-12 md:grid-cols-3"><div><img className="h-24 w-auto object-contain" src={settings.logoUrl || '/rcdf-logo.png'} alt={`${settings.organizationName || 'RCDF'} logo`}/><p className="mt-4 max-w-md text-sm leading-6 text-slate-600">{settings.footerText || 'Empowering vulnerable communities and building sustainable futures through community-driven development.'}</p><p className="mt-5 text-xs text-slate-600">© {new Date().getFullYear()} RCDF. All rights reserved.</p></div><div><p className="text-sm font-bold text-[#000f22]">Contact</p><p className="mt-3 text-sm text-slate-600">{settings.email}</p><p className="mt-2 text-sm text-slate-600">{settings.phone}</p></div><div><p className="text-sm font-bold text-[#000f22]">Get involved</p><Link className="mt-3 block text-sm text-slate-600" to="/contact">Volunteer</Link><Link className="mt-2 block text-sm text-slate-600" to="/contact">Contact us</Link></div></div></footer>;
}

const defaultHome = {
  heroTitle: 'Building stronger communities, together.',
  heroDescription: 'RCDF partners with communities to create practical, lasting opportunities for people facing poverty and vulnerability.',
  primaryCta: 'Explore our programs',
  primaryLink: '/services',
  secondaryCta: 'About RCDF',
  secondaryLink: '/about',
  heroImageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  programsTitle: 'How we support communities',
  programsDescription: 'Our work is shaped by local priorities and delivered with care.'
};

const defaultAbout = {
  mission: 'To support vulnerable people and strengthen communities through respectful, practical, and sustainable action.',
  vision: 'A future where every person has the opportunity, dignity, and support to thrive.',
  story: 'Our story begins with a simple belief: lasting change is strongest when communities lead it.',
  values: ['Dignity in every interaction', 'Community-led solutions', 'Accountability and trust', 'Practical, lasting impact']
};

export default function HomeReference() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      get('/settings').catch(() => ({})),
      get('/pages/home').catch(() => ({ content: defaultHome })),
      get('/pages/about').catch(() => ({ content: defaultAbout })),
      get('/statistics').catch(() => []),
      get('/services').catch(() => [])
    ])
      .then(([settings, home, about, statistics, services]) => {
        setData({
          settings: settings || {},
          home: { ...defaultHome, ...((home && home.content) || home) },
          about: { ...defaultAbout, ...((about && about.content) || about) },
          statistics: Array.isArray(statistics) ? statistics : [],
          services: Array.isArray(services) ? services : []
        });
      })
      .catch(() => setError('We could not load the homepage content.'));
  }, []);
  if (!data) return error ? <><ReferenceHeader/><div className="shell py-16"><Notice error>{error}</Notice></div></> : <Loading/>;
  const { settings, home, about, statistics, services } = data;
  return <><ReferenceHeader/><main className="page-entrance">
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden px-5 py-20 text-center text-white"><img className="absolute inset-0 h-full w-full scale-105 object-cover" src={home.heroImageUrl} alt="Community gathering"/><div className="absolute inset-0 bg-gradient-to-br from-[#000f22]/95 via-[#0a2540]/85 to-[#1b6d24]/65"/><div className="relative mx-auto max-w-5xl"><p className="mb-5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#b7f3b3]">Community-led development</p><h1 className="hero-title text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{home.heroTitle}</h1><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#e2ecfb]">{home.heroDescription}</p><div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row"><Link className="rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#000f22] shadow-lg hover:-translate-y-0.5 hover:bg-[#dff5dd]" to={home.primaryLink}>{home.primaryCta}</Link><Link className="rounded-xl border border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:bg-white/10" to={home.secondaryLink}>{home.secondaryCta}</Link></div></div>
    </section>
    <section className="relative z-10 mx-auto -mt-12 max-w-7xl rounded-2xl bg-white px-5 py-10 shadow-[0_18px_45px_rgba(15,23,42,.14)] sm:px-8"><div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">{statistics.map(stat => <div className="border-slate-200 last:border-0 lg:border-r" key={stat._id}><p className="text-3xl font-extrabold text-green">{stat.value}</p><p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p></div>)}</div></section>
    <section className="shell grid items-center gap-14 py-20 lg:grid-cols-2"><div><h2 className="text-3xl font-bold text-[#000f22]">Our Commitment to Change</h2><p className="mt-6 leading-7 text-slate-600">{about.introduction} {about.story}</p><Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-green hover:text-[#a0f399]" to="/about">Learn more <ArrowRight size={18}/></Link></div><img className="h-96 w-full rounded-xl object-cover shadow-[0_4px_20px_rgba(15,23,42,.08)]" src={services[0]?.imageUrl || home.heroImageUrl} alt="Education in action"/></section>
    <section className="bg-[#eef4ef] py-20"><div className="shell"><div className="text-center"><p className="eyebrow">What we do</p><h2 className="text-3xl font-bold text-[#000f22]">Featured Services</h2><p className="mt-2 text-slate-600">Core areas where we make an impact.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{services.slice(0,3).map(item => <article className="group overflow-hidden rounded-2xl border border-white bg-white shadow-[0_8px_30px_rgba(15,23,42,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.15)]" key={item._id}><img className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" src={item.imageUrl || home.heroImageUrl} alt=""/><div className="p-6"><span className="rounded-full bg-[#e7f5e5] px-3 py-1 text-xs font-bold text-green">Program</span><h3 className="mt-4 text-xl font-bold text-[#000f22]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.shortDescription}</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green hover:gap-3" to={`/services/${item.slug}`}>Learn more <ArrowRight size={16}/></Link></div></article>)}</div></div></section>
    <section className="mx-auto my-12 max-w-7xl rounded-xl bg-[#0a2540] px-6 py-16 text-center text-white sm:px-12"><h2 className="text-4xl font-bold">Join Us in Making a Difference</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#b0c8eb]">Your support, whether through time or resources, directly impacts the people and communities we work alongside.</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><Link className="rounded-lg bg-green px-8 py-4 text-sm font-bold uppercase tracking-wider" to="/contact">Volunteer</Link><Link className="rounded-lg border border-white/60 px-8 py-4 text-sm font-bold uppercase tracking-wider" to="/contact">Contact us</Link></div></section>
  </main><ReferenceFooter settings={settings}/></>;
}
