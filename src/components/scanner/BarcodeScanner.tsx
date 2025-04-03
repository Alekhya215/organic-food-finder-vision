
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Barcode, Camera } from 'lucide-react';
import { toast } from 'sonner';

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = () => {
    setScanning(true);
    // In a real app, we would integrate with a barcode scanning library
    setTimeout(() => {
      const mockBarcodes = ['8901063152227', '5000112637922', '8901719110018', '8902080527022'];
      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      setResult(randomBarcode);
      setScanning(false);
      toast.success('Barcode scanned successfully!');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-organic-light flex items-center justify-center">
            <Barcode className="w-8 h-8 text-organic" />
          </div>
          
          <h3 className="text-xl font-semibold text-center">Scan Barcode</h3>
          <p className="text-sm text-gray-500 text-center">
            Point your camera at a barcode on a packaged organic food product
          </p>
          
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {scanning ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <Camera className="w-12 h-12 text-organic mx-auto" />
                </div>
                <p className="mt-2 text-sm text-gray-500">Scanning...</p>
              </div>
            ) : result ? (
              <div className="text-center">
                <Barcode className="w-12 h-12 text-organic mx-auto" />
                <p className="mt-2 text-sm font-medium">Barcode: {result}</p>
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
            className="w-full bg-organic hover:bg-organic-dark"
            disabled={scanning}
          >
            {scanning ? 'Scanning...' : 'Scan Barcode'}
          </Button>
          
          {result && (
            <div className="w-full p-4 bg-organic-light rounded-lg">
              <h4 className="font-medium mb-2">Product Information</h4>
              <p className="text-sm text-gray-700">
                Scanning for details about organic product with barcode {result}...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Note: In the actual application, this would display real product information fetched from organic food databases.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
