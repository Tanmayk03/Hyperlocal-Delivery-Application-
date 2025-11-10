import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-4 flex flex-col lg:flex-row items-center justify-between text-center text-gray-600 dark:text-gray-300">
        
        {/* Copyright Section */}
        <p className="text-sm">
          © {new Date().getFullYear()} All Rights Reserved. 
        </p>

        {/* Branding or Tagline */}
        <p className="text-sm font-medium mt-2 lg:mt-0">
          Developed by <span className="text-primary-500">Team HyperLocal</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
