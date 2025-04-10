
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Barcode, Camera } from 'lucide-react';
import { toast } from 'sonner';

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up video stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setHasCameraPermission(true);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraActive(true);
      toast.success('Camera activated successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const handleScan = () => {
    setScanning(true);
    // In a real app, we would analyze video frames for barcodes
    // For simulation purposes, we'll just use a timeout
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
          
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            {cameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : scanning ? (
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
                <p className="mt-2 text-sm">Camera access required</p>
              </div>
            )}
            
            {scanning && cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="animate-pulse">
                  <Barcode className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
          </div>
          
          {!cameraActive ? (
            <Button 
              onClick={requestCameraPermission} 
              className="w-full bg-organic hover:bg-organic-dark"
              disabled={scanning}
            >
              Enable Camera
            </Button>
          ) : (
            <div className="w-full flex space-x-2">
              <Button 
                onClick={handleScan} 
                className="flex-1 bg-organic hover:bg-organic-dark"
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Scan Barcode'}
              </Button>
              <Button 
                onClick={stopCamera} 
                variant="outline"
                className="border-organic text-organic"
              >
                Stop Camera
              </Button>
            </div>
          )}
          
          {hasCameraPermission === false && (
            <div className="w-full p-3 bg-red-50 text-red-600 rounded-md text-sm">
              Camera access denied. Please check your browser settings and grant camera permissions.
            </div>
          )}
          
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
