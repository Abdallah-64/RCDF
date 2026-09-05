import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { About, Collection, Contact, Detail } from './pages/PublicPages';
import Home from './pages/HomeReference';
import { Dashboard, Login, ManageContent, Messages, PageEditor, Protected, SettingsPage, SetupAdmin } from './pages/AdminPages';

// Ensure any lingering public dark mode classes or storage are removed
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('public-dark');
  try {
    localStorage.removeItem('rcdf_public_theme');
  } catch {
    // ignore
  }
}

const admin = (element) => <Protected>{element}</Protected>;

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Collection type="services" />} />
        <Route path="/services/:slug" element={<Detail type="services" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/setup" element={<SetupAdmin />} />
        <Route path="/admin/register" element={<Navigate to="/admin/setup" replace />} />
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

