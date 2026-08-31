import { useEffect, useState } from 'react';
import { Check, Flag, MapPin, ShieldCheck, Users, Eye } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { get, send } from '../services/api';
import { ServiceCard } from '../components/ContentCards';
import { Footer, Header } from '../components/PublicChrome';
import { Loading, Notice } from '../components/States';

const defaultAbout = {
  mission: 'To support vulnerable people and strengthen communities through respectful, practical, and sustainable action.',
  vision: 'A future where every person has the opportunity, dignity, and support to thrive.',
  story: 'Our story begins with a simple belief: lasting change is strongest when communities lead it.',
  values: ['Dignity in every interaction', 'Community-led solutions', 'Accountability and trust', 'Practical, lasting impact'],
  team: []
};

function usePublicData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      get('/settings').catch(() => ({})),
      get('/pages/about').catch(() => ({ content: defaultAbout })),
      get('/statistics').catch(() => []),
      get('/services').catch(() => [])
    ])
      .then(([settings, about, statistics, services]) => {
        setData({
          settings: settings || {},
          about: { ...defaultAbout, ...((about && (about.content || about)) || {}) },
          statistics: Array.isArray(statistics) ? statistics : [],
          services: Array.isArray(services) ? services : []
        });
      })
      .catch(() => setError('We could not load this content right now.'));
  }, []);
  return { data, error };
}
function Layout({ children }) { const { data, error } = usePublicData(); if (error) return <><Header /><div className="shell py-12"><Notice error>{error}</Notice></div></>; if (!data) return <Loading />; return <><Header />{children(data)}<Footer settings={data.settings} /></>; }

function TeamCard({ member }) {
  return <article className="overflow-hidden rounded-xl border border-[#c4c6ce] bg-white shadow-[0_4px_20px_rgba(15,23,42,.08)]">{member.imageUrl ? <img className="aspect-square w-full object-cover" src={member.imageUrl} alt={member.name || 'RCDF team member'} /> : <div className="grid aspect-square place-items-center bg-[#e9e8ea] text-[#1b6d24]"><Users size={46} /></div>}<div className="p-5 text-center"><h3 className="text-lg font-semibold text-[#000f22]">{member.name || 'Team member'}</h3><p className="mt-1 text-xs font-bold uppercase tracking-wider text-green">{member.role}</p></div></article>;
}

export function About() {
  const [searchParams] = useSearchParams();
  const selectedWorkSection = searchParams.get('section');
  return <Layout>{({ about, statistics }) => {
    const workSections = { accountability: ['Accountability', about.accountability], services: ['Services', about.services], approach: ['Approach', about.approach] };
    const selected = workSections[selectedWorkSection];
    if (selectedWorkSection === 'story') return <main className="page-entrance bg-white"><section className="shell py-16 sm:py-24"><a className="text-sm font-bold text-green hover:underline" href="/about">Back to About RCDF</a><p className="mt-10 eyebrow">Our story</p><h1 className="page-title mt-3 text-4xl font-bold tracking-tight text-[#000f22] sm:text-5xl">A partnership for lasting change.</h1><div className="mt-8 h-px w-20 bg-green" /><p className="reading-text mt-8 whitespace-pre-line text-lg leading-8 text-[#43474d]">{about.story}</p></section></main>;
    if (selected) return <main className="page-entrance bg-white"><section className="shell py-16 sm:py-24"><a className="text-sm font-bold text-green hover:underline" href="/about">Back to About RCDF</a><p className="mt-10 eyebrow">How we work</p><h1 className="page-title mt-3 text-4xl font-bold tracking-tight text-[#000f22] sm:text-5xl">{selected[0]}</h1><div className="mt-8 h-px w-20 bg-green" /><p className="reading-text mt-8 whitespace-pre-line text-lg leading-8 text-[#43474d]">{selected[1]}</p></section></main>;
    return <main className="page-entrance">
    <section className="relative flex min-h-[500px] items-center overflow-hidden bg-[#e3e2e5]"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-35 mix-blend-multiply" /><div className="absolute inset-0 bg-gradient-to-t from-[#faf9fb] via-[#faf9fb]/85 to-transparent" /><div className="shell relative z-10 py-20 text-center"><p className="eyebrow">About RCDF</p><h1 className="text-4xl font-bold tracking-tight text-[#000f22] sm:text-5xl">Rooted in compassion,<br />driven by impact.</h1><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#43474d]">{about.introduction}</p></div>
    </section>
    <section className="shell py-16 sm:py-24"><div className="grid gap-6 md:grid-cols-12"><article className="flex flex-col justify-center rounded-xl border border-[#c4c6ce] bg-[#f5f3f6] p-8 md:col-span-5"><p className="eyebrow">Our story</p><h2 className="text-3xl font-bold text-[#000f22]">A partnership for lasting change.</h2><p className="mt-5 line-clamp-4 leading-7 text-[#43474d]">{about.story}</p><a className="mt-6 inline-flex w-fit rounded-lg border border-[#002b5b] px-4 py-2 text-sm font-bold text-[#002b5b] hover:bg-[#002b5b] hover:text-white" href="/about?section=story" target="_blank" rel="noopener noreferrer">Read more</a></article><div className="min-h-80 overflow-hidden rounded-xl border border-[#c4c6ce] bg-[url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center md:col-span-7" /></div></section>
    <section className="shell grid gap-6 md:grid-cols-2"><article className="relative overflow-hidden rounded-xl border border-[#c4c6ce] bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,.08)]"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#d2e4ff] text-[#000f22]"><Flag size={27} /></span><h2 className="mt-6 text-2xl font-bold text-[#000f22]">Our Mission</h2><p className="mt-4 leading-7 text-[#43474d]">{about.mission}</p></article><article className="relative overflow-hidden rounded-xl border border-[#c4c6ce] bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,.08)]"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#a0f399] text-[#1b6d24]"><Eye size={27} /></span><h2 className="mt-6 text-2xl font-bold text-[#000f22]">Our Vision</h2><p className="mt-4 leading-7 text-[#43474d]">{about.vision}</p></article></section>
    <section className="shell py-16 sm:py-24"><div className="rounded-xl border border-[#c4c6ce] bg-white p-8 sm:p-12"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">What guides us</p><h2 className="text-3xl font-bold text-[#000f22]">Core Values</h2><p className="mt-4 text-[#43474d]">The principles that shape our relationship with every community.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{about.values?.map((value) => <article className="rounded-lg border border-[#c4c6ce] bg-[#faf9fb] p-5 text-center" key={value}><ShieldCheck className="mx-auto text-green" size={28} /><h3 className="mt-4 font-semibold text-[#000f22]">{value}</h3></article>)}</div></div></section>
    <section className="bg-[#f5f3f6] py-16 sm:py-24"><div className="shell"><div className="text-center"><p className="eyebrow">How we work</p><h2 className="text-3xl font-bold text-[#000f22]">Accountability, services, and approach</h2></div><div className="mt-9 grid gap-6 md:grid-cols-3">{[['Accountability', about.accountability, 'accountability'], ['Services', about.services, 'services'], ['Approach', about.approach, 'approach']].filter(([, text]) => text).map(([title, text, key]) => <article className="rounded-xl bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,.08)]" key={title}><h3 className="text-xl font-bold text-[#000f22]">{title}</h3><p className="mt-4 line-clamp-4 leading-7 text-[#43474d]">{text}</p><a className="mt-6 inline-flex rounded-lg border border-[#002b5b] px-4 py-2 text-sm font-bold text-[#002b5b] hover:bg-[#002b5b] hover:text-white" href={`/about?section=${key}`} target="_blank" rel="noopener noreferrer">Read more</a></article>)}</div></div></section>
    {about.team?.length > 0 && <section className="shell py-16 sm:py-24"><div className="text-center"><p className="eyebrow">Leadership</p><h2 className="text-3xl font-bold text-[#000f22]">Our Team</h2></div><div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{about.team.map((member, index) => <TeamCard member={member} key={`${member.name}-${index}`} />)}</div></section>}
    <section className="bg-[#f5f3f6] py-16 sm:py-24"><div className="shell grid gap-8 lg:grid-cols-2"><article className="rounded-xl bg-[#0a2540] p-8 text-white"><p className="text-sm font-bold uppercase tracking-[.18em] text-green-200">Where we work</p><h2 className="mt-4 text-3xl font-bold">{about.workLocationName || 'Our communities'}</h2><p className="mt-6 flex items-start gap-3 leading-7 text-slate-200"><MapPin className="mt-1 shrink-0 text-green-200" size={20} />{about.workLocationAddress || 'Location information will be available soon.'}</p><p className="mt-6 leading-7 text-slate-200">{about.workLocationDescription}</p></article><div className="min-h-80 overflow-hidden rounded-xl border border-[#c4c6ce] bg-white">{about.workMapUrl ? <iframe className="h-80 w-full" src={about.workMapUrl} title="RCDF service area map" loading="lazy" /> : <div className="grid h-80 place-items-center p-8 text-center text-[#43474d]"><MapPin className="mb-3 text-green" size={42} /><p>Add a Google Maps embed URL in the admin About page to show the location map.</p></div>}</div></div></section>
    <section className="shell py-16 sm:py-24"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{statistics.map((stat) => <div className="rounded-xl border border-[#c4c6ce] bg-white p-6 text-center" key={stat._id}><p className="text-3xl font-bold text-green">{stat.value}</p><p className="mt-2 text-sm text-[#43474d]">{stat.label}</p></div>)}</div></section>
  </main>;
  }}</Layout>;
}

export function Collection() { return <Layout>{({ services }) => <main className="page-entrance"><section className="section bg-mist"><div className="shell"><p className="eyebrow">Services</p><h1 className="page-title text-4xl font-extrabold">Support shaped by community needs.</h1></div></section><section className="section"><div className="shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((item) => <ServiceCard key={item._id} item={item} />)}</div></section></main>}</Layout>; }
export function Detail() { const { slug } = useParams(); const [item, setItem] = useState(null); useEffect(() => { get(`/services/${slug}`).then(setItem); }, [slug]); if (!item) return <Loading />; return <><Header /><main className="page-entrance section bg-mist"><div className="shell grid gap-8 md:grid-cols-2"><div><p className="eyebrow">Service</p><h1 className="page-title text-4xl font-extrabold">{item.title}</h1><p className="reading-text mt-6 leading-8 text-muted">{item.description}</p></div><img className="h-80 w-full rounded-2xl object-cover shadow-[0_10px_30px_rgba(15,23,42,.12)]" src={item.imageUrl} alt="" /></div></main><Footer /></>; }
export function Contact() { const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' }); const [status, setStatus] = useState(''); const submit = async (event) => { event.preventDefault(); setStatus('Sending…'); try { await send('post', '/contact', form); setStatus('Thank you. Your message has been sent.'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); } catch { setStatus('Unable to send your message.'); } }; return <Layout>{({ settings }) => <main className="page-entrance"><section className="section bg-mist"><div className="shell"><p className="eyebrow">Contact RCDF</p><h1 className="page-title text-4xl font-extrabold">Let’s connect.</h1></div></section><section className="section"><div className="shell grid gap-12 md:grid-cols-2"><aside><h2 className="text-2xl font-bold">Contact information</h2><p className="mt-5 text-muted">For partnership, program, or general enquiries, please reach out.</p><p className="mt-6 text-sm"><b>Email</b><br />{settings.email}</p><p className="mt-4 text-sm"><b>Phone</b><br />{settings.phone}</p><p className="mt-4 text-sm"><b>Address</b><br />{settings.address}</p></aside><form className="card p-7" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2">{[['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['subject', 'Subject']].map(([key, label]) => <label className="label" key={key}>{label}<input className="field" required={key !== 'phone'} type={key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}</div><label className="label mt-4 block">Message<textarea className="field" rows="6" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>{status && <div className="mt-4"><Notice error={status.includes('Unable')}>{status}</Notice></div>}<button className="btn btn-primary mt-5">Send message</button></form></div></section></main>}</Layout>; }
