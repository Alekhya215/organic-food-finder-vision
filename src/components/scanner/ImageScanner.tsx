
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Camera } from 'lucide-react';
import { toast } from 'sonner';

const ImageScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = () => {
    setScanning(true);
    // In a real app, we would integrate with an image recognition API
    setTimeout(() => {
      const possibleResults = ['Apple (Organic)', 'Spinach (Organic)', 'Tomato (Organic)', 'Carrots (Organic)'];
      const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
      setResult(randomResult);
      setScanning(false);
      toast.success('Food item recognized successfully!');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-earthy-light flex items-center justify-center">
            <Image className="w-8 h-8 text-earthy" />
          </div>
          
          <h3 className="text-xl font-semibold text-center">Image Recognition</h3>
          <p className="text-sm text-gray-500 text-center">
            Take a picture of unpacked organic food items to identify them
          </p>
          
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {scanning ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <Camera className="w-12 h-12 text-earthy mx-auto" />
                </div>
                <p className="mt-2 text-sm text-gray-500">Analyzing image...</p>
              </div>
            ) : result ? (
              <div className="text-center">
                <Image className="w-12 h-12 text-earthy mx-auto" />
                <p className="mt-2 text-sm font-medium">Detected: {result}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Camera className="w-12 h-12 mx-auto opacity-50" />
                <p className="mt-2 text-sm">Camera preview will appear here</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleScan} 
            className="w-full bg-earthy hover:bg-earthy-dark"
            disabled={scanning}
          >
            {scanning ? 'Analyzing...' : 'Take Photo'}
          </Button>
          
          {result && (
            <div className="w-full p-4 bg-earthy-light rounded-lg">
              <h4 className="font-medium mb-2">Food Information</h4>
              <p className="text-sm text-gray-700">
                Finding details about {result}...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Note: In the actual application, this would display real food information fetched from organic food databases and nutrition sources.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageScanner;
