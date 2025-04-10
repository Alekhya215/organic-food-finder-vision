
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Camera } from 'lucide-react';
import { toast } from 'sonner';

const ImageScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Begin analysis
        setScanning(true);
        
        // In a real app, we would send this image to an AI service for recognition
        // For simulation purposes, we'll just use a timeout
        setTimeout(() => {
          const possibleResults = ['Apple (Organic)', 'Spinach (Organic)', 'Tomato (Organic)', 'Carrots (Organic)'];
          const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
          setResult(randomResult);
          setScanning(false);
          toast.success('Food item recognized successfully!');
        }, 2000);
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
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
          
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured food item" 
                className="w-full h-full object-contain"
              />
            ) : cameraActive ? (
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
                <p className="mt-2 text-sm">Camera access required</p>
              </div>
            )}
            
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="animate-pulse">
                  <Image className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
            
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {!cameraActive && !capturedImage ? (
            <Button 
              onClick={requestCameraPermission} 
              className="w-full bg-earthy hover:bg-earthy-dark"
              disabled={scanning}
            >
              Enable Camera
            </Button>
          ) : capturedImage ? (
            <div className="w-full flex space-x-2">
              {!result && (
                <Button 
                  onClick={() => setScanning(true)}
                  className="flex-1 bg-earthy hover:bg-earthy-dark"
                  disabled={scanning}
                >
                  {scanning ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              )}
              <Button 
                onClick={resetCapture} 
                variant="outline"
                className="flex-1 border-earthy text-earthy"
              >
                Take New Photo
              </Button>
            </div>
          ) : (
            <div className="w-full flex space-x-2">
              <Button 
                onClick={captureImage} 
                className="flex-1 bg-earthy hover:bg-earthy-dark"
              >
                Take Photo
              </Button>
              <Button 
                onClick={stopCamera} 
                variant="outline"
                className="border-earthy text-earthy"
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
