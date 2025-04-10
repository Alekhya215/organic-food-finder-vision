
import React, { useState } from 'react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FeedbackList } from '@/components/feedback/FeedbackList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("submit");
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Feedback Portal</h1>
        <p className="text-center text-gray-600 mb-8">
          We value your feedback! Please share your thoughts to help us improve our products and services.
        </p>
        
        <Tabs defaultValue="submit" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
            <TabsTrigger value="view">View Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <FeedbackForm />
          </TabsContent>
          
          <TabsContent value="view">
            <FeedbackList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;
