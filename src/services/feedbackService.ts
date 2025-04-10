
// Define the feedback interface
export interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: string;
  category: string;
  message: string;
  createdAt: string;
}

/**
 * Save feedback to localStorage
 */
export const saveFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const id = generateId();
  const createdAt = new Date().toISOString();
  
  const newFeedback: Feedback = {
    ...feedback,
    id,
    createdAt,
  };
  
  // Get existing feedback items
  const existingFeedback = getFeedbackItems();
  
  // Add new feedback to the list
  const updatedFeedback = [newFeedback, ...existingFeedback];
  
  // Save to localStorage
  localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
  
  return newFeedback;
};

/**
 * Get all feedback items from localStorage
 */
export const getFeedbackItems = (): Feedback[] => {
  const feedbackJson = localStorage.getItem('feedback');
  return feedbackJson ? JSON.parse(feedbackJson) : [];
};

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
