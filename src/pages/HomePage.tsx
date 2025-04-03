
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Barcode, Image, Search } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-organic-light to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-organic-dark mb-4">
                Trace Your Organic Food Journey
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Scan, identify, and learn about organic food products with our cutting-edge traceability system. Get detailed information about origin, certification, and nutritional values.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-organic hover:bg-organic-dark">
                  <Link to="/scan">Start Scanning</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-organic text-organic hover:bg-organic hover:text-white">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                alt="Organic vegetables"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-organic-light rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <Barcode className="w-8 h-8 text-organic" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan Barcode</h3>
              <p className="text-gray-600">
                Scan barcodes on packaged organic products to instantly access detailed information about their origin, certification, and more.
              </p>
            </div>
            
            <div className="bg-earthy-light rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-earthy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Image Recognition</h3>
              <p className="text-gray-600">
                Take photos of unpacked fruits, vegetables, and other organic items to identify them and get information about their properties.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Database</h3>
              <p className="text-gray-600">
                Access our extensive database that combines information from multiple reliable sources on organic food products and certification.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-organic-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Benefits of Using OrganicTrace</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Our traceability system helps you make informed decisions about the food you consume, ensuring it meets organic standards and aligns with your values.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                Know exactly where your food comes from and how it was produced.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Food Safety</h3>
              <p className="text-gray-600 text-sm">
                Verify certification and safety standards for all organic products.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Health Awareness</h3>
              <p className="text-gray-600 text-sm">
                Access nutritional information to support your dietary needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Sustainable Choices</h3>
              <p className="text-gray-600 text-sm">
                Support sustainable farming practices and make eco-friendly decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-organic-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Track Your Organic Food?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Start your journey to healthier, more transparent food choices today with OrganicTrace.
          </p>
          <Button asChild size="lg" className="bg-white text-organic-dark hover:bg-gray-100">
            <Link to="/scan">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
