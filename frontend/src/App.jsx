import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { About, Collection, Contact, Detail } from './pages/PublicPages';
import Home from './pages/HomeReference';
import { Dashboard, Login, ManageContent, Messages, PageEditor, Protected, SettingsPage } from './pages/AdminPages';

const admin = (element) => <Protected>{element}</Protected>;

function PublicThemeToggle() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('rcdf_public_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('public-dark', darkMode);
    localStorage.setItem('rcdf_public_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (location.pathname.startsWith('/admin')) return null;
  return (
    <button
      className="fixed bottom-5 right-5 z-50 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-navy shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Switch page theme"
    >
      {darkMode ? '☀ Light mode' : '◐ Dark mode'}
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PublicThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Collection type="services" />} />
        <Route path="/services/:slug" element={<Detail type="services" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={admin(<Dashboard />)} />
        <Route path="/admin/services" element={admin(<ManageContent type="services" />)} />
        <Route path="/admin/content/home" element={admin(<PageEditor pageKey="home" />)} />
        <Route path="/admin/content/about" element={admin(<PageEditor pageKey="about" />)} />
        <Route path="/admin/messages" element={admin(<Messages />)} />
        <Route path="/admin/settings" element={admin(<SettingsPage />)} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

