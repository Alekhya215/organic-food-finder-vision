
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Barcode, Image } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from '@/components/auth/ProfileDropdown';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-organic rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">OFT</span>
              </div>
              <span className="text-lg font-medium text-organic-dark">OrganicTrace</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-organic transition-colors">
              Home
            </Link>
            <Link to="/scan" className="text-gray-700 hover:text-organic transition-colors">
              Scan Food
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-organic transition-colors">
              Our Team
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-organic transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex border-organic text-organic hover:bg-organic hover:text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Button variant="default" size="sm" className="bg-organic hover:bg-organic-dark text-white">
              <Barcode className="w-4 h-4 mr-2" />
              Scan Now
            </Button>
            
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="outline" size="sm" className="border-organic text-organic" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
