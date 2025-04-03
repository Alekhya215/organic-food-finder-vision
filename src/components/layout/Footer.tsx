
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-organic-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">OrganicTrace</h3>
            <p className="text-sm text-gray-300">
              Bringing transparency to your food journey. Trace the origin and quality of your organic food with ease.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/scan" className="text-gray-300 hover:text-white transition-colors">Scan Food</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Our Team</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/scan" className="text-gray-300 hover:text-white transition-colors">Barcode Scanning</Link></li>
              <li><Link to="/scan" className="text-gray-300 hover:text-white transition-colors">Image Recognition</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Organic Database</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Food Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-sm text-gray-300 not-italic">
              <p>Email: info@organictrace.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Green St, Organic City, OC 12345</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OrganicTrace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
