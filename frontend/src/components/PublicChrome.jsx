import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/contact', 'Contact']];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 border-b border-[#c4c6ce] bg-[#faf9fb]"><div className="shell flex h-20 items-center justify-between"><Link aria-label="RCDF home" to="/"><img className="h-14 w-auto object-contain" src="/rcdf-logo.png" alt="RCDF — Rajo Consultancy and Development Firm"/></Link><nav className="hidden gap-8 md:flex">{links.map(([to,label]) => <NavLink key={to} className={({isActive}) => `border-b-2 pb-1 text-sm font-semibold ${isActive ? 'border-green text-[#000f22]' : 'border-transparent text-[#43474d] hover:text-[#000f22]'}`} to={to}>{label}</NavLink>)}</nav><Link className="hidden rounded-lg bg-[#000f22] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0a2540] md:block" to="/contact">Support us</Link><button className="md:hidden" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>{open && <nav className="shell flex flex-col gap-3 border-t py-5 md:hidden">{links.map(([to,label]) => <NavLink onClick={() => setOpen(false)} key={to} className="font-semibold text-[#43474d]" to={to}>{label}</NavLink>)}</nav>}</header>;
}

export function Footer({ settings = {} }) {
  return <footer className="mt-16 bg-[#efedf0] text-[#43474d]"><div className="shell grid gap-8 py-12 md:grid-cols-3"><div><img className="h-24 w-auto object-contain" src={settings.logoUrl || '/rcdf-logo.png'} alt={`${settings.organizationName || 'RCDF'} logo`}/><p className="mt-4 max-w-sm text-sm leading-6">{settings.footerText || 'Working with communities to build opportunity and hope.'}</p><p className="mt-4 text-xs">© {new Date().getFullYear()} {settings.organizationName || 'RCDF'}. All rights reserved.</p></div><div><p className="font-bold text-[#000f22]">Contact</p><p className="mt-4 text-sm">{settings.email}</p><p className="mt-1 text-sm">{settings.phone}</p></div><div><p className="font-bold text-[#000f22]">Get involved</p><Link className="mt-4 block text-sm hover:text-green" to="/contact">Volunteer</Link><Link className="mt-2 block text-sm hover:text-green" to="/contact">Contact us</Link></div></div></footer>;
}
