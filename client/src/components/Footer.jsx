import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa6';
import { BiMailSend, BiPhoneCall, BiMap } from 'react-icons/bi';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-2 rounded-xl w-max shadow-md select-none pointer-events-none">
            <img src={logo} alt="HyperLocal Logo" className="h-10 w-auto" />
          </div>
          <p className="text-xs leading-relaxed text-slate-400 mt-2 select-none">
            Your neighborhood grocery store, delivered to your doorstep in 10 minutes. Fresh items, unbeatable prices, and lightning-fast service.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-green-500 transition-colors" aria-label="Facebook"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-green-500 transition-colors" aria-label="Twitter"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-green-500 transition-colors" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="#" className="hover:text-green-500 transition-colors" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Useful Links</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li><Link to="/" className="hover:text-green-500 transition-colors">Home</Link></li>
            <li><Link to="/search" className="hover:text-green-500 transition-colors">Search Products</Link></li>
            <li><Link to="/user" className="hover:text-green-500 transition-colors">My Profile</Link></li>
            <li><Link to="/my-orders" className="hover:text-green-500 transition-colors">Order History</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <BiMailSend size={16} className="text-green-500" />
            <a href="mailto:support@hyperlocal.com" className="hover:text-green-500 transition-colors">support@hyperlocal.com</a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <BiPhoneCall size={16} className="text-green-500" />
            <a href="tel:+919876543210" className="hover:text-green-500 transition-colors">+91 98765 43210</a>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-400">
            <BiMap size={16} className="text-green-500 mt-0.5" />
            <p>123, Grocery Hub Street, Near Metro Station, Lucknow - 226001</p>
          </div>
        </div>

        {/* Column 4: App Download / Delivery Hours */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Service Status</h4>
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-green-500 flex items-center gap-1.5 animate-pulse">
              ● Server Online
            </p>
            <p className="text-xs text-slate-300 font-semibold">Delivery Hours:</p>
            <p className="text-xs text-slate-400 leading-tight">6:00 AM - 11:00 PM</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-1">Orders placed after 11 PM will be delivered next morning.</p>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800/80 bg-slate-950/40">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HyperLocal Delivery. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 mt-2 sm:mt-0 font-medium">
            Developed with <FaHeart className="text-red-500 animate-pulse" /> by <span className="text-green-500 font-bold hover:underline cursor-pointer">Team HyperLocal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
