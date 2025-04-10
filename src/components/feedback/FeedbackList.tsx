
import React, { useEffect, useState } from 'react';
import { Feedback, getFeedbackItems } from '@/services/feedbackService';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const FeedbackList = () => {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  
  useEffect(() => {
    const items = getFeedbackItems();
    setFeedbackItems(items);
  }, []);
  
  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-8 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No feedback has been submitted yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Recent Feedback</h2>
      <div className="space-y-4">
        {feedbackItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-organic-light text-organic rounded-full capitalize">
                {item.category}
              </span>
            </div>
            
            <p className="text-gray-700 whitespace-pre-line">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
