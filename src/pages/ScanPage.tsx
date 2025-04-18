
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';
import ImageScanner from '@/components/scanner/ImageScanner';
import { Barcode, Image, Globe, Calendar, Timer } from 'lucide-react';

const ScanPage = () => {
  const [activeTab, setActiveTab] = useState('barcode');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Scan Organic Food</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use our advanced scanning technology to identify and trace organic food products. 
            Choose between barcode scanning for packaged foods or image recognition for fresh produce.
            We verify organic status by cross-referencing data from multiple trusted sources.
          </p>
        </div>

        <Tabs defaultValue="barcode" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="barcode" className="flex items-center justify-center">
              <Barcode className="w-4 h-4 mr-2" />
              Barcode Scanner
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center justify-center">
              <Image className="w-4 h-4 mr-2" />
              Image Recognition
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="barcode">
            <BarcodeScanner />
          </TabsContent>
          
          <TabsContent value="image">
            <ImageScanner />
          </TabsContent>
        </Tabs>

        <Card className="mt-10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">How to use the {activeTab === 'barcode' ? 'Barcode Scanner' : 'Image Recognition'}</h2>
            
            {activeTab === 'barcode' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  1. Position the barcode of a packaged organic food product in the scanner frame.
                </p>
                <p className="text-sm text-gray-600">
                  2. Hold steady while the scanner reads the barcode.
                </p>
                <p className="text-sm text-gray-600">
                  3. View detailed information about the product, including certification, origin, nutritional data, and preservation guidelines.
                </p>
                <p className="text-sm text-gray-600">
                  4. We'll verify the organic status by checking multiple trusted sources and databases.
                </p>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Preservation Time</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Nutrient Percentages</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 p-3 bg-gray-100 rounded-md mt-4">
                  <p>Note: For demonstration purposes, you can enter your own barcode number or use the camera to scan a real barcode. 
                  We'll simulate verification across organic food databases.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  1. Place the unpacked organic food item (fruit, vegetable, etc.) in the camera view.
                </p>
                <p className="text-sm text-gray-600">
                  2. Take a clear photo that captures the food item well.
                </p>
                <p className="text-sm text-gray-600">
                  3. Our AI will identify the item and provide information about its organic properties, nutrient percentages, and preservation timeframes.
                </p>
                <p className="text-sm text-gray-600">
                  4. We cross-reference multiple organic certification databases to verify authenticity.
                </p>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Shelf Life Information</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Daily Value Percentages</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 p-3 bg-gray-100 rounded-md mt-4">
                  <p>Note: For demonstration purposes, you can upload your own image or use the camera to take a real photo. 
                  We'll simulate AI recognition and verification across organic food databases.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
