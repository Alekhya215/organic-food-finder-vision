
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Camera, Check, X, Globe, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Real food database (simulated)
const organicFoodDatabase = {
  'Apple': {
    name: 'Organic Apple',
    variety: 'Honeycrisp',
    nutrients: 'Vitamin C, Fiber, Antioxidants',
    benefits: 'Supports heart health, aids digestion',
    season: 'Late Summer to Fall',
    growthConditions: 'Temperate climate, well-drained soil',
    organicCultivation: 'No synthetic pesticides, natural fertilizers only',
  },
  'Spinach': {
    name: 'Organic Spinach',
    variety: 'Baby Spinach',
    nutrients: 'Iron, Vitamin K, Folate, Magnesium',
    benefits: 'Supports bone health, helps prevent anemia',
    season: 'Spring and Fall',
    growthConditions: 'Cool weather, moist soil',
    organicCultivation: 'Crop rotation, natural pest management',
  },
  'Tomato': {
    name: 'Tomato',
    variety: 'Roma',
    nutrients: 'Vitamin C, Potassium, Lycopene',
    benefits: 'Supports heart health, antioxidant properties',
    season: 'Summer',
    growthConditions: 'Warm weather, even watering',
    organicCultivation: 'Often grown with conventional methods',
  },
  'Carrots': {
    name: 'Organic Carrots',
    variety: 'Nantes',
    nutrients: 'Vitamin A, Beta-carotene, Fiber',
    benefits: 'Supports eye health, immune function',
    season: 'Year-round (peak in fall)',
    growthConditions: 'Loose, sandy soil, moderate water',
    organicCultivation: 'Cover crops, natural compost fertilizers',
  },
  'Broccoli': {
    name: 'Organic Broccoli',
    variety: 'Calabrese',
    nutrients: 'Vitamin C, Vitamin K, Folate, Fiber',
    benefits: 'Anti-inflammatory, supports detoxification',
    season: 'Fall and Spring',
    growthConditions: 'Cool weather, consistent moisture',
    organicCultivation: 'Companion planting, natural pest deterrents',
  },
  'Banana': {
    name: 'Organic Banana',
    variety: 'Cavendish',
    nutrients: 'Potassium, Vitamin B6, Vitamin C',
    benefits: 'Supports heart health, aids digestion',
    season: 'Year-round',
    growthConditions: 'Tropical climate, high humidity',
    organicCultivation: 'Natural composts, no synthetic chemicals',
  }
};

// Mock data for organic verification from different websites by food type
const mockOrganicVerificationData = {
  'Apple': [
    { source: 'OrganicProduce.org', isOrganic: true, certificationId: 'USDA-NOP-85241' },
    { source: 'FarmTracker.com', isOrganic: true, farmName: 'Honeycrisp Organic Farms' },
    { source: 'FruitDatabase.org', isOrganic: true, notes: 'Certified organic, no pesticides' }
  ],
  'Spinach': [
    { source: 'OrganicVegetables.org', isOrganic: true, certificationId: 'EU-BIO-76123' },
    { source: 'FarmTracker.com', isOrganic: true, farmName: 'Green Valley Organics' },
    { source: 'ProduceCheck.com', isOrganic: true, notes: 'Certified organic cultivation' }
  ],
  'Tomato': [
    { source: 'ProduceDatabase.org', isOrganic: false, notes: 'Detected conventional growing methods' },
    { source: 'OrganicVerify.com', isOrganic: false, notes: 'No organic certification found' },
    { source: 'FarmInspect.org', isOrganic: false, notes: 'May contain traces of non-organic fertilizers' }
  ],
  'Carrots': [
    { source: 'OrganicRootVegetables.org', isOrganic: true, certificationId: 'CAN-ORG-32145' },
    { source: 'RootVegCheck.com', isOrganic: true, notes: 'Fully organic farm verified' },
    { source: 'OrganicTracker.net', isOrganic: true, farmName: 'Sunrise Organic Farms' }
  ],
  'Broccoli': [
    { source: 'OrganicVegetables.org', isOrganic: true, certificationId: 'USDA-NOP-73421' },
    { source: 'ProduceVerifier.com', isOrganic: true, notes: 'Certified organic growing methods' },
    { source: 'VeggieTracker.org', isOrganic: false, notes: 'Pending verification' }
  ],
  'Banana': [
    { source: 'TropicalFruitCert.org', isOrganic: true, certificationId: 'GLOBAL-ORG-99542' },
    { source: 'FruitDatabase.org', isOrganic: true, farmName: 'Tropical Organic Farms' },
    { source: 'ImportVerifier.com', isOrganic: true, notes: 'Fair trade & organic certified' }
  ]
};

const ImageScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [foodInfo, setFoodInfo] = useState<any>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<any[] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        analyzeCapturedImage();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setUploadedImage(file);
      
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      
      // Begin analysis
      analyzeCapturedImage();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeCapturedImage = () => {
    setScanning(true);
    setResult(null);
    setFoodInfo(null);
    setVerificationData(null);
    
    // In a real app, we would send this image to an AI service for recognition
    // For simulation purposes, we'll just use a timeout and random selection
    setTimeout(() => {
      const possibleFoods = Object.keys(organicFoodDatabase);
      const recognizedFood = possibleFoods[Math.floor(Math.random() * possibleFoods.length)];
      
      setResult(recognizedFood);
      setScanning(false);
      
      // Set food info
      const info = organicFoodDatabase[recognizedFood as keyof typeof organicFoodDatabase];
      setFoodInfo(info);
      
      toast.success(`Identified as ${recognizedFood}!`);
      
      // Trigger verification after analysis
      verifyOrganicStatus(recognizedFood);
    }, 2000);
  };

  const verifyOrganicStatus = (foodItem: string) => {
    setIsVerifying(true);
    
    // Simulate API calls to different websites
    setTimeout(() => {
      // Use our predefined verification data for known foods
      // For unknown foods, generate random verification results
      let data;
      
      if (mockOrganicVerificationData[foodItem as keyof typeof mockOrganicVerificationData]) {
        data = mockOrganicVerificationData[foodItem as keyof typeof mockOrganicVerificationData];
      } else {
        // Generate random verification for unknown food
        const randomOrganic = Math.random() > 0.3; // Most foods are likely organic in this context
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
        const dateStr = randomDate.toISOString().split('T')[0];
        
        data = [
          { 
            source: 'OrganicProduce.org', 
            isOrganic: randomOrganic, 
            certificationId: randomOrganic ? `ORG-${Math.floor(Math.random() * 10000)}-ID` : null,
            notes: randomOrganic ? 'Common organic variety' : 'May be conventionally grown'
          },
          { 
            source: 'FarmTracker.com', 
            isOrganic: randomOrganic, 
            farmName: randomOrganic ? 'Nature\'s Best Farms' : null,
            notes: randomOrganic ? 'Sustainable farming practices' : 'Unknown farm source'
          },
          { 
            source: Math.random() > 0.5 ? 'ProduceDatabase.org' : 'OrganicVerify.com', 
            isOrganic: Math.random() > 0.2, // High chance of being organic
            notes: 'Visual characteristics consistent with organic farming'
          }
        ];
      }
      
      setVerificationData(data);
      setIsVerifying(false);
      
      // Calculate if majority say it's organic
      const organicCount = data.filter(item => item.isOrganic).length;
      if (organicCount > data.length / 2) {
        toast.success('Item verified as organic by majority of sources!');
      } else {
        toast.error('Item may not be organic. Check verification details.');
      }
    }, 1500);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
    setFoodInfo(null);
    setVerificationData(null);
    setUploadedImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate overall organic status
  const getOverallOrganicStatus = () => {
    if (!verificationData) return null;
    
    const organicCount = verificationData.filter(item => item.isOrganic).length;
    return organicCount > verificationData.length / 2;
  };

  const overallStatus = getOverallOrganicStatus();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-earthy-light flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-earthy" />
          </div>
          
          <h3 className="text-xl font-semibold text-center">Image Recognition</h3>
          <p className="text-sm text-gray-500 text-center">
            Take a picture of unpacked organic food items to identify them
          </p>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          
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
                <ImageIcon className="w-12 h-12 text-earthy mx-auto" />
                <p className="mt-2 text-sm font-medium">Detected: {result}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="flex flex-col items-center">
                  <Camera className="w-12 h-12 mx-auto opacity-50 mb-2" />
                  <p className="text-sm">Camera or upload required</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-earthy"
                    onClick={triggerFileInput}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload image
                  </Button>
                </div>
              </div>
            )}
            
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="animate-pulse">
                  <ImageIcon className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
            
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {!cameraActive && !capturedImage ? (
            <div className="w-full grid grid-cols-2 gap-2">
              <Button 
                onClick={requestCameraPermission} 
                className="bg-earthy hover:bg-earthy-dark"
                disabled={scanning}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
              <Button 
                onClick={triggerFileInput}
                variant="outline"
                className="border-earthy text-earthy"
                disabled={scanning}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          ) : capturedImage ? (
            <div className="w-full flex space-x-2">
              {!result && (
                <Button 
                  onClick={analyzeCapturedImage}
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
                New Image
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
          
          {result && foodInfo && (
            <div className="w-full p-4 bg-earthy-light rounded-lg">
              <h4 className="font-medium mb-2">Food Information</h4>
              <div className="bg-white p-3 rounded border border-gray-200">
                <h5 className="font-medium text-earthy">{foodInfo.name}</h5>
                <div className="text-xs text-gray-700 mt-1 space-y-1">
                  <p><span className="font-medium">Variety:</span> {foodInfo.variety}</p>
                  <p><span className="font-medium">Nutrients:</span> {foodInfo.nutrients}</p>
                  <p><span className="font-medium">Benefits:</span> {foodInfo.benefits}</p>
                  <p><span className="font-medium">Season:</span> {foodInfo.season}</p>
                  <p><span className="font-medium">Growing:</span> {foodInfo.organicCultivation}</p>
                </div>
              </div>
              
              {isVerifying ? (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-earthy border-t-transparent rounded-full"></div>
                  <p className="text-sm">Verifying organic status from multiple sources...</p>
                </div>
              ) : verificationData && (
                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <Globe className="h-4 w-4 mr-1 text-gray-600" />
                    <p className="text-sm font-medium">Cross-Verification Results:</p>
                  </div>
                  
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <div className="flex items-center mb-2 justify-between">
                      <p className="text-sm font-medium">Overall Status:</p>
                      {overallStatus === true ? (
                        <Badge className="bg-green-500">Organic</Badge>
                      ) : overallStatus === false ? (
                        <Badge className="bg-red-500">Not Organic</Badge>
                      ) : (
                        <Badge className="bg-yellow-500">Unverified</Badge>
                      )}
                    </div>
                    
                    <ul className="divide-y divide-gray-100 text-xs">
                      {verificationData.map((item, index) => (
                        <li key={index} className="py-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate max-w-[180px]">{item.source}</span>
                            {item.isOrganic ? (
                              <span className="flex items-center text-green-600">
                                <Check className="h-3 w-3 mr-1" /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <X className="h-3 w-3 mr-1" /> Not Verified
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 mt-1">
                            {item.certificationId && <div>ID: {item.certificationId}</div>}
                            {item.farmName && <div>Farm: {item.farmName}</div>}
                            {item.notes && <div>Note: {item.notes}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageScanner;
