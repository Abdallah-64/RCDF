import { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart3, FileText, LogOut, Mail, Menu, Plus, Settings, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { get, send } from '../services/api';
import { Loading, Notice } from '../components/States';

function AdminToast({ message, error, close }) {
  useEffect(() => {
    if (!message) return undefined;
    const timeoutId = window.setTimeout(close, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [message, close]);
  if (!message) return null;
  return <div className={`fixed right-4 top-4 z-[70] flex max-w-xs items-start gap-2 rounded-xl border px-3 py-2.5 shadow-[0_12px_28px_rgba(15,23,42,.18)] backdrop-blur ${error ? 'border-red-200 bg-red-50/95 text-red-900' : 'border-green-200 bg-white/95 text-[#002b5b]'}`} role="status"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${error ? 'bg-red-500' : 'bg-green'}`} /><div className="flex-1"><p className="text-xs font-bold">{error ? 'Action needs attention' : 'Update complete'}</p><p className="mt-0.5 text-xs leading-4">{message}</p></div><button className="rounded-md px-1 text-base leading-none opacity-60 hover:bg-black/5 hover:opacity-100" aria-label="Close notification" onClick={close}>×</button></div>;
}

const menu = [['/admin/dashboard', BarChart3, 'Dashboard'], ['/admin/services', Users, 'Services'], ['/admin/content/home', FileText, 'Home content'], ['/admin/content/about', FileText, 'About'], ['/admin/messages', Mail, 'Messages'], ['/admin/settings', Settings, 'Site settings']];
const messageFor = (error, fallback) => {
  const response = error.response?.data;
  const fieldErrors = response?.errors?.fieldErrors;
  const details = fieldErrors && Object.entries(fieldErrors)
    .flatMap(([field, messages]) => messages?.map((message) => `${field}: ${message}`) || [])
    .join(' ');

  return details || response?.message || error?.message || fallback;
};

function AdminLayout({ children }) {
  const { logout, user } = useAuth(); const location = useLocation(); const [open, setOpen] = useState(false); const [profileOpen, setProfileOpen] = useState(false); const profileMenuRef = useRef(null);
  useEffect(() => { const closeProfile = (event) => { if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setProfileOpen(false); }; document.addEventListener('pointerdown', closeProfile); return () => document.removeEventListener('pointerdown', closeProfile); }, []);
  const current = menu.find(([to]) => location.pathname === to)?.[2] || 'Administration'; const initial = (user?.name || user?.email || 'A').slice(0, 1).toUpperCase();
  return <div className="min-h-screen bg-[#faf9fb]">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#c4c6ce] bg-[#f5f3f6] p-5 transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><button className="absolute right-4 top-4 md:hidden" onClick={() => setOpen(false)}><X /></button><Link to="/admin/dashboard"><img className="h-14 w-auto" src="/rcdf-logo.png" alt="RCDF logo" /></Link><p className="mt-2 text-xs text-[#74777e]">Management Console · {user?.email}</p><nav className="mt-8 space-y-2">{menu.map(([to, Icon, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? 'bg-[#002b5b] text-white shadow-sm' : 'text-[#43474d] hover:bg-[#e3e2e5]'}`}><Icon size={18} />{label}</NavLink>)}</nav><button className="absolute bottom-6 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-lg border border-[#c4c6ce] py-3 text-sm font-semibold" onClick={logout}><LogOut size={17} />Log out</button></aside>
    <main className="md:ml-64"><header className="relative flex h-16 items-center border-b border-[#c4c6ce] bg-[#faf9fb] px-5"><button className="md:hidden" onClick={() => setOpen(true)}><Menu /></button><p className="ml-4 text-lg font-bold md:ml-0">{current}</p><div className="relative ml-auto" ref={profileMenuRef}><button className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-white bg-[#002b5b] text-sm font-bold text-white shadow ring-1 ring-[#c4c6ce] hover:scale-105" aria-label="Open admin profile" onClick={() => setProfileOpen(!profileOpen)}>{user?.imageUrl ? <img className="h-full w-full object-cover" src={user.imageUrl} alt="Admin profile" /> : initial}</button>{profileOpen && <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,.2)]"><div className="flex items-center gap-3">{user?.imageUrl ? <img className="h-12 w-12 rounded-full object-cover" src={user.imageUrl} alt="Admin profile" /> : <div className="grid h-12 w-12 place-items-center rounded-full bg-[#002b5b] font-bold text-white">{initial}</div>}<div className="min-w-0"><p className="truncate font-bold text-ink">{user?.name || 'Administrator'}</p><p className="truncate text-xs text-muted">{user?.email}</p></div></div><div className="mt-4 rounded-xl bg-slate-50 px-3 py-2"><p className="text-xs font-bold uppercase tracking-wider text-muted">Account type</p><p className="mt-1 text-sm font-semibold text-green">Administrator</p></div><Link className="mt-4 block rounded-lg bg-[#002b5b] px-3 py-2 text-center text-sm font-bold text-white hover:bg-[#0a2540]" to="/admin/settings" onClick={() => setProfileOpen(false)}>View profile settings</Link></div>}</div></header><div className="p-5 sm:p-8">{children}</div></main>
  </div>;
}
export function Protected({ children }) { const { user, checking } = useAuth(); if (checking) return <Loading />; return user ? <AdminLayout>{children}</AdminLayout> : <Navigate to="/admin/login" replace />; }
function RequestState({ error, retry }) { return <><Notice error>{error}</Notice><button className="btn btn-primary mt-4" onClick={retry}>Try again</button></>; }
function useRequest(url) { const [data, setData] = useState(null); const [error, setError] = useState(''); const load = useCallback(() => { setError(''); get(url).then(setData).catch((e) => setError(messageFor(e, 'Unable to load this page. Check that the API is running, then sign in again.'))); }, [url]); useEffect(load, [load]); return { data, error, load }; }

export function SetupAdmin() {
  const { user, registerFirstUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const isNetworkError = (err) =>
    !err.response && (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('network'));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setWakingUp(false);

    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setSaving(true);
    try {
      await registerFirstUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/admin/dashboard');
    } catch (err) {
      if (isNetworkError(err)) {
        setWakingUp(true);
        setError('');
      } else {
        setError(messageFor(err, 'Unable to create administrator account.'));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#faf9fb] p-5">
      <form className="card w-full max-w-md p-8 shadow-xl" onSubmit={submit}>
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
            <img className="h-16 w-auto object-contain" src="/rcdf-logo.png" alt="RCDF logo" />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <Sparkles size={14} /> Administrator Setup
          </span>
        </div>
        <h1 className="mt-3 text-center text-2xl font-extrabold text-[#000f22]">
          Create Administrator Account
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted">
          Fill in your details below to set up your RCDF administration portal.
        </p>

        {wakingUp && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-bold">⏳ Server is waking up…</p>
            <p className="mt-1 text-xs leading-5">The server was asleep (free hosting). Please wait 30–60 seconds, then click <strong>Try Again</strong>.</p>
            <button type="button" className="btn btn-primary mt-3 w-full text-sm" onClick={submit}>
              Try Again
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <Notice error>{error}</Notice>
          </div>
        )}

        <label className="label mt-5 block">
          Full Name
          <input
            className="field mt-1"
            type="text"
            required
            placeholder="e.g. Abdallah Adam"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="label mt-4 block">
          Admin Email Address
          <input
            className="field mt-1"
            type="email"
            required
            placeholder="admin@example.org"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="label mt-4 block">
          Create Password
          <input
            className="field mt-1"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <label className="label mt-4 block">
          Confirm Password
          <input
            className="field mt-1"
            type="password"
            required
            minLength={8}
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </label>

        <button className="btn btn-primary mt-6 w-full" disabled={saving}>
          {saving ? 'Creating administrator…' : 'Create Administrator Account'}
        </button>

        <div className="mt-5 text-center text-xs text-muted">
          Already have an account?{' '}
          <Link to="/admin/login" className="font-bold text-[#002b5b] hover:underline">
            Sign in here
          </Link>
        </div>
      </form>
    </main>
  );
}

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    get('/auth/setup-status')
      .then((res) => { if (res?.needsSetup) setNeedsSetup(true); })
      .catch(() => {});
  }, []);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await login({ email: form.email, password: form.password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(messageFor(err, 'Invalid email or password.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#faf9fb] p-5">
      <form className="card w-full max-w-md p-8 shadow-xl" onSubmit={submit}>
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
            <img className="h-16 w-auto object-contain" src="/rcdf-logo.png" alt="RCDF logo" />
          </div>
        </div>
        <h1 className="mt-5 text-center text-2xl font-extrabold text-[#000f22]">
          Administrator Sign In
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted">
          Sign in to access the RCDF management console.
        </p>

        {error && (
          <div className="mt-4">
            <Notice error>{error}</Notice>
          </div>
        )}

        <label className="label mt-5 block">
          Email Address
          <input
            className="field mt-1"
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="label mt-4 block">
          Password
          <input
            className="field mt-1"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <button className="btn btn-primary mt-6 w-full" disabled={saving}>
          {saving ? 'Signing in…' : 'Sign in'}
        </button>

        {needsSetup && (
          <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-muted">
            <span>No admin account yet?</span>
            <Link to="/admin/setup" className="font-bold text-[#002b5b] hover:underline">
              Setup First Admin →
            </Link>
          </div>
        )}
      </form>
    </main>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { data, error, load } = useRequest('/dashboard');
  if (error) return <RequestState error={error} retry={load} />;
  if (!data) return <Loading />;
  const adminName = user?.name || user?.email?.split('@')[0] || 'Administrator';
  const cards = [['Total services', data.totalServices, 'bg-blue-100'], ['Published services', data.publishedServices, 'bg-green-100'], ['Total messages', data.totalMessages, 'bg-orange-100'], ['Unread messages', data.unreadMessages, 'bg-purple-100']];
  const chart = [{ label: 'Published services', value: data.publishedServices, color: 'bg-green' }, { label: 'Draft services', value: Math.max(0, data.totalServices - data.publishedServices), color: 'bg-slate-400' }, { label: 'Read messages', value: Math.max(0, data.totalMessages - data.unreadMessages), color: 'bg-[#002b5b]' }, { label: 'Unread messages', value: data.unreadMessages, color: 'bg-orange-400' }];
  const maximum = Math.max(...chart.map((item) => item.value), 1);
  return <>
    <section className="rounded-2xl bg-gradient-to-r from-[#002b5b] to-[#0a2540] px-6 py-6 text-white shadow-lg sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b7f3b3]">RCDF management console</p>
      <h1 className="mt-1 text-2xl font-extrabold">Welcome back, {adminName}.</h1>
      <p className="mt-1 text-sm text-[#d2e4ff]">Here is the latest overview of your website.</p>
    </section>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, color]) => <div className="rounded-xl border border-[#c4c6ce] bg-white p-5 shadow-sm" key={label}><span className={`block h-8 w-8 rounded-full ${color}`} /><p className="mt-4 text-sm font-semibold text-muted">{label}</p><p className="mt-1 text-3xl font-extrabold text-navy">{value}</p></div>)}</div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><section className="rounded-xl border border-[#c4c6ce] bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Service & message activity</h2><p className="mt-1 text-sm text-muted">Current content and enquiry distribution.</p><div className="mt-8 grid h-56 grid-cols-4 items-end gap-5 border-b border-slate-200 px-5">{chart.map((item) => <div className="flex h-full flex-col justify-end text-center" key={item.label}><div className={`${item.color} mx-auto w-full max-w-16 rounded-t-md`} style={{ height: `${Math.max(10, (item.value / maximum) * 100)}%` }} title={`${item.label}: ${item.value}`} /><p className="mt-3 text-xs text-muted">{item.label}</p><b className="text-sm">{item.value}</b></div>)}</div></section><Recent title="Recent messages" items={data.recentMessages} field="subject" /></div>
  </>;
}
function Recent({ title, items = [], field }) { return <section className="rounded-xl bg-white p-5 shadow-sm"><h2 className="font-bold">{title}</h2>{items.length ? items.map((item) => <p className="border-b py-3 text-sm" key={item._id}>{item[field]}</p>) : <p className="mt-4 text-sm text-muted">Nothing here yet.</p>}</section>; }

const serviceBlank = { title: '', slug: '', shortDescription: '', description: '', imageUrl: '', status: 'draft' }; const projectBlank = { title: '', slug: '', description: '', imageUrl: '', location: '', date: '', status: 'draft' };
export function ManageContent({ type }) {
  const config = { label: type === 'services' ? 'Services' : 'Projects', endpoint: type === 'services' ? '/services' : '/projects' };
  const blank = { title: '', shortDescription: '', description: '', imageUrl: '', status: 'draft' };
  const { data: items, error, load } = useRequest(config.endpoint);
  const [editing, setEditing] = useState(null); const [notice, setNotice] = useState(''); const [saving, setSaving] = useState(false); const [deleteCandidate, setDeleteCandidate] = useState(null);
  const isError = notice.includes('Unable') || notice.includes('check') || notice.includes('image');
  if (error) return <RequestState error={error} retry={load} />; if (!items) return <Loading />;
  const selectImage = (event) => { const image = event.target.files?.[0]; if (!image) return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.type) || image.size > 800 * 1024) { setNotice('Choose a PNG, JPEG, or WebP image smaller than 800 KB.'); event.target.value = ''; return; } const reader = new FileReader(); reader.onload = () => setEditing((current) => ({ ...current, imageUrl: reader.result })); reader.readAsDataURL(image); };
  const remove = async (item) => { try { await send('delete', `${config.endpoint}/${item._id}`); setNotice(`Deleted “${item.title}”. It is no longer shown on the website.`); load(); } catch (requestError) { setNotice(messageFor(requestError, 'Unable to delete this item.')); } finally { setDeleteCandidate(null); } };
  const save = async (event) => { event.preventDefault(); const action = editing._id ? 'updated' : 'created'; setSaving(true); try { await send(editing._id ? 'put' : 'post', `${config.endpoint}${editing._id ? `/${editing._id}` : ''}`, editing); setEditing(null); setNotice(`Service “${editing.title}” was ${action} and saved successfully.`); load(); } catch (requestError) { setNotice(messageFor(requestError, 'Please check the form.')); } finally { setSaving(false); } };
  return <>
    <AdminToast message={notice} error={isError} close={() => setNotice('')} />
    <div className="flex justify-between"><h1 className="text-2xl font-extrabold">{config.label}</h1><button className="btn btn-primary" onClick={() => setEditing({ ...blank })}><Plus size={17} />Add</button></div>
    <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Title</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{items.map((item) => <tr className="border-t" key={item._id}><td className="p-4 font-semibold">{item.title}</td><td className="p-4">{item.status}</td><td className="p-4"><button className="mr-3 font-bold text-green" onClick={() => setEditing({ ...item })}>Edit</button><button className="font-bold text-red-700" onClick={() => setDeleteCandidate(item)}>Delete</button></td></tr>)}</tbody></table></div>
    {editing && <Modal title={editing._id ? 'Edit service' : 'Add service'} close={() => setEditing(null)}><form className="space-y-4" onSubmit={save}>
      <label className="label block">Service title<input className="field" required value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label>
      <label className="label block">Short description <span className="font-normal text-muted">(shown on the service card)</span><textarea className="field" required rows="3" value={editing.shortDescription} onChange={(event) => setEditing({ ...editing, shortDescription: event.target.value })} /></label>
      <label className="label block">Full description <span className="font-normal text-muted">(shown on the service page)</span><textarea className="field" required rows="6" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><p className="text-sm font-bold text-ink">Service image</p><p className="mt-1 text-xs text-muted">Choose a PNG, JPEG, or WebP image from your laptop (maximum 800 KB).</p><input className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#123755]" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} />{editing.imageUrl && <div className="mt-4"><img className="h-36 w-full rounded-lg object-cover" src={editing.imageUrl} alt="Selected service preview" /><button className="mt-2 text-sm font-bold text-red-700" type="button" onClick={() => setEditing({ ...editing, imageUrl: '' })}>Remove image</button></div>}</div>
      <label className="label block">Status<select className="field" value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save service'}</button>
    </form></Modal>}
    {deleteCandidate && <Modal title="Delete service" close={() => setDeleteCandidate(null)}><p className="text-sm leading-6 text-muted">You are about to permanently delete <b className="text-ink">“{deleteCandidate.title}”</b>. This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button className="btn border border-slate-300 bg-white text-ink" onClick={() => setDeleteCandidate(null)}>Keep service</button><button className="btn bg-red-700 text-white hover:bg-red-800" onClick={() => remove(deleteCandidate)}>Delete service</button></div></Modal>}
  </>;
}
function Modal({ title, children, close }) { return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-5"><div className="mx-auto my-10 max-w-xl rounded-xl bg-white p-6"><div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={close}><X /></button></div>{children}</div></div>; }

export function Messages() {
  const { data: items, error, load } = useRequest('/contact');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const detailRef = useRef(null);

  useEffect(() => {
    if (!selected) return;
    const handlePointerDown = (e) => {
      if (
        detailRef.current &&
        !detailRef.current.contains(e.target) &&
        !e.target.closest('[data-message-item]')
      ) {
        setSelected(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  if (error) return <RequestState error={error} retry={load} />;
  if (!items) return <Loading />;

  const markRead = async (item) => {
    try {
      await send('patch', `/contact/${item._id}/read`);
      setToast('Marked as read.');
      load();
    } catch { setToast('Unable to update message.'); }
  };

  const remove = async (item) => {
    try {
      await send('delete', `/contact/${item._id}`);
      if (selected?._id === item._id) setSelected(null);
      setToast('Message deleted.');
      load();
    } catch { setToast('Unable to delete message.'); }
  };

  const replyUrl = (item) =>
    `mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`Re: ${item.subject}`)}&body=${encodeURIComponent(`\n\n--- Original message from ${item.name} ---\n${item.message}`)}`;

  return (
    <>
      <AdminToast message={toast} close={() => setToast('')} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Messages</h1>
        <span className="text-sm text-muted">{items.length} message{items.length !== 1 ? 's' : ''}</span>
      </div>

      {!items.length && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center text-muted">
          <Mail size={40} className="opacity-30" />
          <p>No messages yet. Contact form submissions will appear here.</p>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Message list */}
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              data-message-item="true"
              onClick={() => setSelected(selected?._id === item._id ? null : item)}
              className={`w-full rounded-xl border p-4 text-left transition hover:border-[#002b5b] ${
                selected?._id === item._id
                  ? 'border-[#002b5b] bg-[#002b5b]/5 shadow-sm ring-2 ring-[#002b5b]/20'
                  : item.isRead
                  ? 'border-slate-200 bg-white opacity-70'
                  : 'border-slate-200 bg-white font-semibold shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-bold text-[#000f22]">{item.subject}</p>
                {!item.isRead && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#002b5b]" />}
              </div>
              <p className="mt-1 truncate text-xs text-muted">{item.name} · {item.email}</p>
              <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
            </button>
          ))}
        </div>

        {/* Message detail */}
        {selected ? (
          <div ref={detailRef} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#000f22]">{selected.subject}</h2>
                <p className="mt-1 text-sm text-muted">
                  From <span className="font-semibold text-[#000f22]">{selected.name}</span> · <a href={`mailto:${selected.email}`} className="text-[#002b5b] underline">{selected.email}</a>
                  {selected.phone && <span className="ml-2">· {selected.phone}</span>}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="shrink-0 rounded-lg p-1 hover:bg-slate-100" title="Close (or click outside)">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-7 whitespace-pre-wrap">{selected.message}</div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={replyUrl(selected)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Mail size={16} /> Reply via Email
              </a>
              {!selected.isRead && (
                <button
                  type="button"
                  className="btn border border-slate-300 bg-white text-ink"
                  onClick={() => { markRead(selected); setSelected({ ...selected, isRead: true }); }}
                >
                  Mark as Read
                </button>
              )}
              <button
                type="button"
                className="btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => remove(selected)}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 ml-auto"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden items-center justify-center rounded-xl border border-dashed border-slate-200 text-muted lg:flex p-12">
            <div className="text-center">
              <Mail size={36} className="mx-auto opacity-30" />
              <p className="mt-3 text-sm">Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function AccountSettings() {
  const { user, logout } = useAuth(); const [form, setForm] = useState({ email: user?.email || '', currentPassword: '', newPassword: '', confirmPassword: '' }); const [notice, setNotice] = useState(''); const [saving, setSaving] = useState(false);
  const save = async (event) => { event.preventDefault(); if (form.newPassword && form.newPassword !== form.confirmPassword) { setNotice('New password confirmation does not match.'); return; } setSaving(true); try { await send('patch', '/auth/credentials', { currentPassword: form.currentPassword, email: form.email === user?.email ? undefined : form.email, newPassword: form.newPassword || undefined }); setNotice('Account details updated. Please sign in again with your new details.'); window.setTimeout(logout, 1600); } catch (error) { setNotice(messageFor(error, 'Unable to update account details.')); } finally { setSaving(false); } };
  return <section className="card p-6"><h2 className="text-xl font-bold">Admin account</h2><p className="mt-1 text-sm text-muted">Confirm your current password before changing your email or password.</p>{notice && <div className="mt-4"><Notice error={notice.includes('Unable') || notice.includes('incorrect') || notice.includes('match') || notice.includes('use')}>{notice}</Notice></div>}<form className="mt-5 space-y-4" onSubmit={save}><label className="label block">Email address<input className="field" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label className="label block">Current password<input className="field" type="password" required value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="label">New password <span className="font-normal text-muted">(optional)</span><input className="field" type="password" minLength="8" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} /></label><label className="label">Confirm new password<input className="field" type="password" minLength="8" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></label></div><button className="btn btn-primary" disabled={saving}>{saving ? 'Updating…' : 'Update account'}</button></form></section>;
}

function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || ''); const [imageUrl, setImageUrl] = useState(user?.imageUrl || ''); const [currentPassword, setCurrentPassword] = useState(''); const [notice, setNotice] = useState(''); const [saving, setSaving] = useState(false);
  const chooseImage = (event) => { const image = event.target.files?.[0]; if (!image) return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.type) || image.size > 500 * 1024) { setNotice('Choose a PNG, JPEG, or WebP profile photo smaller than 500 KB.'); event.target.value = ''; return; } const reader = new FileReader(); reader.onload = () => setImageUrl(reader.result); reader.readAsDataURL(image); };
  const save = async (event) => { event.preventDefault(); setSaving(true); try { const result = await send('patch', '/auth/credentials', { currentPassword, name, imageUrl }); setUser(result.data); setCurrentPassword(''); setNotice('Profile saved successfully.'); } catch (error) { setNotice(messageFor(error, 'Unable to save profile.')); } finally { setSaving(false); } };
  return <section className="card p-6"><h2 className="text-xl font-bold">Admin profile</h2><p className="mt-1 text-sm text-muted">Update the name and photo displayed in the dashboard.</p>{notice && <div className="mt-4"><Notice error={notice.includes('Unable') || notice.includes('incorrect') || notice.includes('image')}>{notice}</Notice></div>}<form className="mt-5 space-y-4" onSubmit={save}><div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">{imageUrl ? <img className="h-16 w-16 rounded-full object-cover ring-4 ring-white" src={imageUrl} alt="Admin profile" /> : <div className="grid h-16 w-16 place-items-center rounded-full bg-navy text-xl font-bold text-white">{name.slice(0, 1).toUpperCase() || 'A'}</div>}<div><p className="font-bold">{name || 'Administrator'}</p><p className="text-sm text-muted">{user?.email}</p></div></div><label className="label block">Your name<input className="field" required value={name} onChange={(event) => setName(event.target.value)} /></label><div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><p className="text-sm font-bold">Profile photo</p><p className="mt-1 text-xs text-muted">PNG, JPEG, or WebP from your laptop (maximum 500 KB).</p><input className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#123755]" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} />{imageUrl && <button className="mt-2 text-sm font-bold text-red-700" type="button" onClick={() => setImageUrl('')}>Remove profile photo</button>}</div><label className="label block">Current password <span className="font-normal text-muted">(required to save)</span><input className="field" type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button></form></section>;
}

export function SettingsPage() {
  const { data, error, load } = useRequest('/settings');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('rcdf_admin_theme') === 'dark');
  useEffect(() => { document.documentElement.classList.toggle('admin-dark', darkMode); localStorage.setItem('rcdf_admin_theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  if (error) return <RequestState error={error} retry={load} />; if (!data) return <Loading />;
  return <><h1 className="text-2xl font-extrabold">Site settings</h1><p className="mt-1 text-sm text-muted">Manage your admin appearance, account, and public contact details.</p><section className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="font-bold">Appearance</h2><p className="mt-1 text-sm text-muted">Choose a comfortable admin workspace theme.</p></div><button className={`btn ${darkMode ? 'bg-navy text-white' : 'border border-navy bg-white text-navy'}`} type="button" onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Dark mode on' : 'Light mode on'}</button></section><div className="mt-6 max-w-3xl"><ProfileSettings /></div><div className="mt-6 max-w-3xl"><AccountSettings /></div><div className="mt-8"><SimpleEditor title="Public contact details" data={data} fields={['organizationName', 'email', 'phone', 'address', 'footerText']} endpoint="/settings" /></div></>;
}
export function StatisticsPage() { const { data, error, load } = useRequest('/statistics'); if (error) return <RequestState error={error} retry={load} />; if (!data) return <Loading />; return <SimpleEditor title="Statistics" data={data} endpoint="/statistics" />; }
export function PageEditor({ pageKey }) { const { data, error, load } = useRequest(`/pages/${pageKey}`); if (error) return <RequestState error={error} retry={load} />; if (!data) return <Loading />; if (pageKey === 'about') return <AboutEditor content={data.content} />; return <HomeContentEditor content={data.content} />; }

function HomeContentEditor({ content }) {
  const [value, setValue] = useState(content);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => setValue(content), [content]);
  const update = (key, nextValue) => setValue((v) => ({ ...v, [key]: nextValue }));

  const selectHeroImage = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.type) || image.size > 800 * 1024) {
      setNotice('Choose a PNG, JPEG, or WebP image smaller than 800 KB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update('heroImageUrl', reader.result);
    reader.readAsDataURL(image);
  };

  const save = async () => {
    setSaving(true);
    try {
      await send('put', '/pages/home', { content: value });
      setNotice('Home page saved successfully.');
    } catch (error) {
      setNotice(messageFor(error, 'Unable to save the Home page.'));
    } finally {
      setSaving(false);
    }
  };

  const textFields = [
    ['heroTitle', 'Hero heading', 'textarea'],
    ['heroDescription', 'Hero description', 'textarea'],
    ['primaryCta', 'Primary button text', 'text'],
    ['primaryLink', 'Primary button link', 'text'],
    ['secondaryCta', 'Secondary button text', 'text'],
    ['secondaryLink', 'Secondary button link', 'text'],
    ['programsTitle', 'Services section heading', 'text'],
    ['programsDescription', 'Services section description', 'textarea'],
  ];

  return (
    <>
      <h1 className="text-2xl font-extrabold">Home content</h1>
      <p className="mt-2 text-sm text-muted">Update homepage text, hero image, and links shown on the public website.</p>

      <div className="mt-6 max-w-3xl space-y-5">
        {/* Hero image upload */}
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <p className="text-sm font-bold text-ink">Hero image (main photo)</p>
          <p className="mt-1 text-xs text-muted">Upload a PNG, JPEG, or WebP photo (max 800 KB). This is the large background image shown at the top of the home page.</p>
          <input
            className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#123755]"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={selectHeroImage}
          />
          {value.heroImageUrl && (
            <div className="mt-4">
              <img
                className="h-40 w-full rounded-lg object-cover shadow-sm"
                src={value.heroImageUrl}
                alt="Hero preview"
              />
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm font-bold text-red-700 hover:underline"
                  onClick={() => update('heroImageUrl', '')}
                >
                  Remove image
                </button>
                <span className="text-xs text-muted">Or paste an image URL:</span>
                <input
                  className="field flex-1 text-xs"
                  type="url"
                  placeholder="https://…"
                  value={value.heroImageUrl?.startsWith('data:') ? '' : value.heroImageUrl || ''}
                  onChange={(e) => update('heroImageUrl', e.target.value)}
                />
              </div>
            </div>
          )}
          {!value.heroImageUrl && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted">Or paste an image URL:</span>
              <input
                className="field flex-1 text-xs"
                type="url"
                placeholder="https://…"
                value={value.heroImageUrl || ''}
                onChange={(e) => update('heroImageUrl', e.target.value)}
              />
            </div>
          )}
        </div>

        {textFields.map(([key, label, type]) => (
          <label className="label block" key={key}>
            {label}
            {type === 'textarea'
              ? <textarea className="field" rows={4} value={value[key] || ''} onChange={(e) => update(key, e.target.value)} />
              : <input className="field" type="text" value={value[key] || ''} onChange={(e) => update(key, e.target.value)} />}
          </label>
        ))}
      </div>

      {notice && <div className="mt-4"><Notice error={notice.includes('Unable') || notice.includes('image')}>{notice}</Notice></div>}
      <button className="btn btn-primary mt-5" onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Home page'}
      </button>
    </>
  );
}

function AboutEditor({ content }) {
  const [value, setValue] = useState(content); const [notice, setNotice] = useState('');
  useEffect(() => setValue(content), [content]);
  const update = (key, nextValue) => setValue({ ...value, [key]: nextValue });
  const team = value.team || [];
  const updateTeam = (index, key, nextValue) => update('team', team.map((member, memberIndex) => memberIndex === index ? { ...member, [key]: nextValue } : member));
  const selectTeamImage = (index, event) => { const image = event.target.files?.[0]; if (!image) return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.type) || image.size > 500 * 1024) { setNotice('Choose a PNG, JPEG, or WebP team photo smaller than 500 KB.'); event.target.value = ''; return; } const reader = new FileReader(); reader.onload = () => updateTeam(index, 'imageUrl', reader.result); reader.readAsDataURL(image); };
  const addTeamMember = () => update('team', [...team, { name: '', role: '', imageUrl: '' }]);
  const removeTeamMember = (index) => update('team', team.filter((_, memberIndex) => memberIndex !== index));
  const save = async () => { try { await send('put', '/pages/about', { content: value }); setNotice('About page saved successfully.'); } catch (error) { setNotice(messageFor(error, 'Unable to save the About page.')); } };
  const fields = [['introduction', 'Introduction'], ['story', 'Our story'], ['mission', 'Mission'], ['vision', 'Vision'], ['accountability', 'Accountability'], ['services', 'Services'], ['approach', 'Approach']];
  return <><h1 className="text-2xl font-extrabold">About content</h1><p className="mt-2 text-sm text-muted">Write the organization information and add team photos from your laptop.</p>
    <div className="mt-6 max-w-3xl space-y-5">{fields.map(([key, label]) => <label className="label block" key={key}>{label}<textarea className="field" rows="5" value={value[key] || ''} onChange={(event) => update(key, event.target.value)} /></label>)}
      <label className="label block">Core values <span className="font-normal text-muted">(one value per line)</span><textarea className="field" rows="5" value={(value.values || []).join('\n')} onChange={(event) => update('values', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} /></label>
      <section className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Where we work</h2><p className="mt-1 text-sm text-muted">Add the location or service area shown on the public About page.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="label">Location name<input className="field" value={value.workLocationName || ''} onChange={(event) => update('workLocationName', event.target.value)} /></label><label className="label">Address or service area<input className="field" value={value.workLocationAddress || ''} onChange={(event) => update('workLocationAddress', event.target.value)} /></label></div><label className="label mt-4 block">Location description<textarea className="field" rows="4" value={value.workLocationDescription || ''} onChange={(event) => update('workLocationDescription', event.target.value)} /></label><label className="label mt-4 block">Google Maps embed URL <span className="font-normal text-muted">(optional)</span><input className="field" type="url" placeholder="https://www.google.com/maps/embed?..." value={value.workMapUrl || ''} onChange={(event) => update('workMapUrl', event.target.value)} /></label></section>
      <section className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Our Team</h2><p className="mt-1 text-sm text-muted">Add team photos directly from your laptop.</p></div><button className="btn border border-navy text-navy" type="button" onClick={addTeamMember}>Add team member</button></div><div className="mt-5 space-y-4">{team.map((member, index) => <div className="rounded-lg border border-slate-200 p-4" key={index}><div className="grid gap-3 sm:grid-cols-2"><label className="label">Name<input className="field" value={member.name || ''} onChange={(event) => updateTeam(index, 'name', event.target.value)} /></label><label className="label">Role<input className="field" value={member.role || ''} onChange={(event) => updateTeam(index, 'role', event.target.value)} /></label></div><div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><p className="text-sm font-bold text-ink">Team photo</p><p className="mt-1 text-xs text-muted">PNG, JPEG, or WebP from your laptop (maximum 500 KB).</p><input className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#123755]" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectTeamImage(index, event)} />{member.imageUrl && <div className="mt-4"><img className="h-32 w-32 rounded-lg object-cover" src={member.imageUrl} alt={member.name || 'Selected team member'} /><button className="mt-2 block text-sm font-bold text-red-700" type="button" onClick={() => updateTeam(index, 'imageUrl', '')}>Remove photo</button></div>}</div><button className="mt-3 text-sm font-bold text-red-700" type="button" onClick={() => removeTeamMember(index)}>Remove member</button></div>)}{!team.length && <p className="text-sm text-muted">No team members added yet.</p>}</div></section>
    </div>{notice && <div className="mt-4"><Notice error={notice.includes('Unable') || notice.includes('image')}>{notice}</Notice></div>}<button className="btn btn-primary mt-5" onClick={save}>Save About page</button></>;
}
function SimpleEditor({ title, data, endpoint, fields, page }) { const [value, setValue] = useState(data); const [notice, setNotice] = useState(''); useEffect(() => setValue(data), [data]); const save = async () => { try { await send('put', endpoint, page ? { content: value } : value); setNotice('Saved successfully.'); } catch (e) { setNotice(messageFor(e, 'Unable to save changes.')); } }; return <><h1 className="text-2xl font-extrabold">{title}</h1><div className="mt-6 max-w-3xl space-y-4">{fields ? fields.map((key) => <label className="label block" key={key}>{key}<textarea className="field" rows={key === 'footerText' ? 3 : 1} value={value[key] || ''} onChange={(e) => setValue({ ...value, [key]: e.target.value })} /></label>) : <label className="label block">Content JSON<textarea className="field font-mono text-xs" rows="18" value={JSON.stringify(value, null, 2)} onChange={(e) => { try { setValue(JSON.parse(e.target.value)); setNotice(''); } catch { setNotice('JSON is not valid yet.'); } }} /></label>}</div>{notice && <div className="mt-4"><Notice error={notice.includes('Unable') || notice.includes('not valid')}>{notice}</Notice></div>}<button className="btn btn-primary mt-5" onClick={save} disabled={notice.includes('not valid')}>Save changes</button></>; }
