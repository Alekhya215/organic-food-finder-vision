
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Send, Star, ThumbsUp, MessageSquare } from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { saveFeedback } from '@/services/feedbackService';

const feedbackSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  rating: z.enum(['1', '2', '3', '4', '5'], {
    message: "Please select a rating."
  }),
  category: z.enum(['general', 'product', 'website', 'service', 'other'], {
    message: "Please select a feedback category."
  }),
  message: z.string().min(10, {
    message: "Feedback message must be at least 10 characters."
  }).max(500, {
    message: "Feedback message can't be longer than 500 characters."
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: '5',
      category: 'general',
      message: '',
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      await saveFeedback(values);
      toast.success('Thank you for your feedback!', {
        description: 'We appreciate your input and will use it to improve our services.',
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to submit feedback', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Overall Rating</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-1"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="sr-only" />
                        </FormControl>
                        <label
                          htmlFor={`rating-${rating}`}
                          className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer border ${
                            field.value === rating.toString()
                              ? 'bg-organic text-white border-organic'
                              : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${
                            field.value === rating.toString() ? 'fill-white' : ''
                          }`} />
                        </label>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Rate your overall experience from 1 to 5 stars
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Category</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-5"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="general" id="category-general" className="sr-only" />
                      </FormControl>
                      <label
                        htmlFor="category-general"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === 'general'
                            ? 'bg-organic/10 border-organic'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 mb-1 ${field.value === 'general' ? 'text-organic' : 'text-gray-500'}`} />
                        <span className={field.value === 'general' ? 'text-organic' : 'text-gray-700'}>General</span>
                      </label>
                    </FormItem>
                    
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="product" id="category-product" className="sr-only" />
                      </FormControl>
                      <label
                        htmlFor="category-product"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === 'product'
                            ? 'bg-organic/10 border-organic'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Star className={`h-5 w-5 mb-1 ${field.value === 'product' ? 'text-organic' : 'text-gray-500'}`} />
                        <span className={field.value === 'product' ? 'text-organic' : 'text-gray-700'}>Product</span>
                      </label>
                    </FormItem>
                    
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="website" id="category-website" className="sr-only" />
                      </FormControl>
                      <label
                        htmlFor="category-website"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === 'website'
                            ? 'bg-organic/10 border-organic'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Star className={`h-5 w-5 mb-1 ${field.value === 'website' ? 'text-organic' : 'text-gray-500'}`} />
                        <span className={field.value === 'website' ? 'text-organic' : 'text-gray-700'}>Website</span>
                      </label>
                    </FormItem>
                    
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="service" id="category-service" className="sr-only" />
                      </FormControl>
                      <label
                        htmlFor="category-service"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === 'service'
                            ? 'bg-organic/10 border-organic'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <MessageSquare className={`h-5 w-5 mb-1 ${field.value === 'service' ? 'text-organic' : 'text-gray-500'}`} />
                        <span className={field.value === 'service' ? 'text-organic' : 'text-gray-700'}>Service</span>
                      </label>
                    </FormItem>
                    
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="other" id="category-other" className="sr-only" />
                      </FormControl>
                      <label
                        htmlFor="category-other"
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                          field.value === 'other'
                            ? 'bg-organic/10 border-organic'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <MessageSquare className={`h-5 w-5 mb-1 ${field.value === 'other' ? 'text-organic' : 'text-gray-500'}`} />
                        <span className={field.value === 'other' ? 'text-organic' : 'text-gray-700'}>Other</span>
                      </label>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Feedback</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please share your thoughts, suggestions, or concerns..." 
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value.length}/500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-organic hover:bg-organic-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
