
import React from 'react';
import { teamMembers } from '@/data/teamData';
import TeamMemberCard from '@/components/team/TeamMember';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-16">
        <h1 className="text-3xl font-bold text-center mb-6">About OrganicTrace</h1>
        <p className="text-center text-gray-600 mb-8">
          We're on a mission to bring transparency to the organic food industry and empower consumers to make informed choices.
        </p>
        
        <div className="bg-organic-light p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At OrganicTrace, we believe that everyone has the right to know exactly what they're eating and where it comes from. 
            Our cutting-edge food traceability system combines barcode scanning and image recognition technology to provide detailed 
            information about organic food products.
          </p>
          <p className="text-gray-700">
            By aggregating data from multiple reliable sources, we offer a comprehensive database that covers certification, 
            origin, nutritional value, and environmental impact. Our goal is to make organic food transparency accessible to all.
          </p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Our Technology</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-xl mb-4">Barcode Scanning</h3>
            <p className="text-gray-600">
              Our advanced barcode scanning technology can quickly identify packaged organic products and retrieve 
              information from our database. We support multiple barcode formats and maintain a comprehensive product catalog.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-xl mb-4">Image Recognition</h3>
            <p className="text-gray-600">
              Using machine learning algorithms, our image recognition system can identify various unpacked organic foods like 
              fruits, vegetables, and grains. The system continuously improves as it processes more images.
            </p>
          </div>
        </div>
        
        <div className="bg-earthy-light p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Data Sources</h2>
          <p className="text-gray-700 mb-4">
            We aggregate information from multiple reliable sources, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Organic certification bodies</li>
            <li>Government food databases</li>
            <li>Nutrition research institutes</li>
            <li>Sustainable agriculture organizations</li>
            <li>Producer-supplied information</li>
          </ul>
          <p className="text-gray-700 mt-4">
            All information is regularly verified and updated to ensure accuracy and relevance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
