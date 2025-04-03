
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! We will get back to you soon.');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12">
          Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" placeholder="Your name" required />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" required />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="Message subject" required />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" rows={6} required />
              </div>
              
              <Button type="submit" className="w-full bg-organic hover:bg-organic-dark">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-gray-600">info@organictrace.com</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Green Street<br />
                  Organic City, OC 12345<br />
                  United States
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Working Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-organic-light rounded-lg">
              <h3 className="font-semibold mb-3">Join Our Community</h3>
              <p className="text-gray-700 text-sm mb-4">
                Follow us on social media and join our newsletter to stay updated on organic food news, tips, and features.
              </p>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-organic text-organic hover:bg-organic hover:text-white">
                  Social Media
                </Button>
                <Button variant="outline" size="sm" className="border-organic text-organic hover:bg-organic hover:text-white">
                  Newsletter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
