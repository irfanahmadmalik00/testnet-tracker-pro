
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text"
            >
              CryptoTracker
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Track your crypto activities in one place
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {year} CryptoTracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
