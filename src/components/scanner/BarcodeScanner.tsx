
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Barcode, Camera, Check, X, AlertCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Real barcodes database (simulated)
const organicProductsDatabase = {
  '8901063152227': {
    name: 'Organic Honey',
    brand: 'Nature\'s Best',
    ingredients: 'Pure Organic Honey',
    nutritionalInfo: 'Energy: 304 kcal, Carbohydrates: 82g, Sugars: 82g',
    origin: 'Himalayan Valleys, India',
  },
  '5000112637922': {
    name: 'Organic Quinoa',
    brand: 'Earth Harvest',
    ingredients: '100% Organic White Quinoa',
    nutritionalInfo: 'Energy: 368 kcal, Protein: 14g, Carbohydrates: 64g, Fat: 6g',
    origin: 'Andean Mountains, Peru',
  },
  '8901719110018': {
    name: 'Green Tea',
    brand: 'Mountain Tea Co.',
    ingredients: 'Green Tea Leaves, Natural Flavors',
    nutritionalInfo: 'Energy: 0 kcal, Antioxidants: High',
    origin: 'Darjeeling, India',
  },
  '8902080527022': {
    name: 'Organic Coconut Oil',
    brand: 'Tropicana Organic',
    ingredients: '100% Cold-Pressed Organic Coconut Oil',
    nutritionalInfo: 'Energy: 862 kcal, Fat: 100g, Saturated Fat: 86.5g',
    origin: 'Kerala, India',
  }
};

// Mock data for organic verification from different websites
const mockOrganicVerificationData = {
  '8901063152227': [
    { source: 'OrganicCertifier.org', isOrganic: true, certificationId: 'ORG-7823-IN' },
    { source: 'GlobalOrganicDatabase.com', isOrganic: true, certificationDate: '2023-05-12' },
    { source: 'USDAOrganicList.gov', isOrganic: false, notes: 'Pending verification' }
  ],
  '5000112637922': [
    { source: 'EUOrganicRegistry.eu', isOrganic: true, certificationId: 'EU-BIO-140' },
    { source: 'OrganicFoodIndex.org', isOrganic: true, certificationDate: '2024-01-30' },
    { source: 'OrganicStandards.uk', isOrganic: true, notes: 'Fully compliant' }
  ],
  '8901719110018': [
    { source: 'IndiaOrganicCertification.in', isOrganic: false, notes: 'Contains non-organic ingredients' },
    { source: 'GlobalOrganicDatabase.com', isOrganic: false, notes: 'Not registered' },
    { source: 'OrganicAlliance.org', isOrganic: false, notes: 'Conventional farming methods used' }
  ],
  '8902080527022': [
    { source: 'OrganicCertifier.org', isOrganic: true, certificationId: 'ORG-5531-IN' },
    { source: 'AsiaOrganicNetwork.com', isOrganic: true, certificationDate: '2024-02-10' },
    { source: 'GlobalOrganicDatabase.com', isOrganic: true, notes: 'Certified organic' }
  ]
};

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [verificationData, setVerificationData] = useState<any[] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
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
    
    // For a real scanner, we would analyze video frames
    // For simulation, we'll provide a realistic experience
    setTimeout(() => {
      let barcodeToUse;
      
      if (Math.random() > 0.5) {
        // Simulate actual scan of one of our known barcodes
        const mockBarcodes = Object.keys(organicProductsDatabase);
        barcodeToUse = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      } else {
        // Simulate scanning a random barcode
        barcodeToUse = Math.floor(Math.random() * 9000000000000) + 1000000000000;
      }
      
      setResult(barcodeToUse.toString());
      setScanning(false);
      toast.success('Barcode scanned successfully!');
      
      // Look up product and trigger verification
      processBarcode(barcodeToUse.toString());
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode && manualBarcode.length > 8) {
      setResult(manualBarcode);
      processBarcode(manualBarcode);
    } else {
      toast.error('Please enter a valid barcode (at least 8 digits)');
    }
  };

  const processBarcode = (barcode: string) => {
    // Look up product info
    const product = organicProductsDatabase[barcode as keyof typeof organicProductsDatabase];
    setProductInfo(product || null);
    
    // Verify organic status
    verifyOrganicStatus(barcode);
  };

  const verifyOrganicStatus = (barcode: string) => {
    setIsVerifying(true);
    setVerificationData(null);
    
    // Simulate API calls to different websites
    setTimeout(() => {
      // For known barcodes, use our predefined results
      // For unknown barcodes, generate random verification results
      let data;
      
      if (mockOrganicVerificationData[barcode as keyof typeof mockOrganicVerificationData]) {
        data = mockOrganicVerificationData[barcode as keyof typeof mockOrganicVerificationData];
      } else {
        // Generate random verification for unknown barcode
        const randomOrganic = Math.random() > 0.5;
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
        const dateStr = randomDate.toISOString().split('T')[0];
        
        data = [
          { 
            source: 'OrganicCertifier.org', 
            isOrganic: randomOrganic, 
            certificationId: randomOrganic ? `ORG-${Math.floor(Math.random() * 10000)}-ID` : null,
            notes: randomOrganic ? 'Verified organic' : 'Not found in database'
          },
          { 
            source: 'GlobalOrganicDatabase.com', 
            isOrganic: randomOrganic, 
            certificationDate: randomOrganic ? dateStr : null,
            notes: randomOrganic ? 'Certification valid' : 'No certification record'
          },
          { 
            source: Math.random() > 0.5 ? 'USDAOrganicList.gov' : 'EUOrganicRegistry.eu', 
            isOrganic: Math.random() > 0.7, // Sometimes disagrees with others
            notes: 'Status may vary by region'
          }
        ];
      }
      
      setVerificationData(data);
      setIsVerifying(false);
      
      // Calculate if majority say it's organic
      const organicCount = data.filter(item => item.isOrganic).length;
      if (organicCount > data.length / 2) {
        toast.success('Product verified as organic by majority of sources!');
      } else {
        toast.error('Product may not be organic. Check verification details.');
      }
    }, 1500);
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
          <div className="w-16 h-16 rounded-full bg-organic-light flex items-center justify-center">
            <Barcode className="w-8 h-8 text-organic" />
          </div>
          
          <h3 className="text-xl font-semibold text-center">Scan Barcode</h3>
          <p className="text-sm text-gray-500 text-center">
            Point your camera at a barcode on a packaged organic food product
          </p>
          
          {/* Manual barcode entry */}
          <form onSubmit={handleManualSubmit} className="w-full">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter barcode number"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" variant="outline" className="border-organic text-organic">
                Check
              </Button>
            </div>
          </form>
          
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
                <p className="mt-2 text-sm">Camera access required for scanning</p>
                <p className="text-xs mt-1">Or enter a barcode manually above</p>
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
                Barcode: {result}
              </p>
              
              {productInfo && (
                <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                  <h5 className="font-medium text-organic">{productInfo.name}</h5>
                  <div className="text-xs text-gray-700 mt-1 space-y-1">
                    <p><span className="font-medium">Brand:</span> {productInfo.brand}</p>
                    <p><span className="font-medium">Ingredients:</span> {productInfo.ingredients}</p>
                    <p><span className="font-medium">Nutrition:</span> {productInfo.nutritionalInfo}</p>
                    <p><span className="font-medium">Origin:</span> {productInfo.origin}</p>
                  </div>
                </div>
              )}
              
              {isVerifying ? (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-organic border-t-transparent rounded-full"></div>
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
                            {item.certificationDate && <div>Date: {item.certificationDate}</div>}
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

export default BarcodeScanner;
