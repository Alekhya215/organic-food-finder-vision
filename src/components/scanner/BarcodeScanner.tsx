import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Barcode, Camera, Check, X, AlertCircle, Globe, Calendar, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  getFoodItemByBarcode, 
  setupFoodItemRealtime, 
  setupNutrientsRealtime,
  setupPreservationRealtime,
  setupVerificationRealtime,
  type FoodItemWithDetails,
  type Nutrient,
  type PreservationGuideline,
  type OrganicVerification
} from '@/utils/foodDatabase';

const organicProductsDatabase = {
  '8901063152227': {
    name: 'Organic Honey',
    brand: 'Nature\'s Best',
    ingredients: 'Pure Organic Honey',
    nutritionalInfo: 'Energy: 304 kcal, Carbohydrates: 82g, Sugars: 82g',
    origin: 'Himalayan Valleys, India',
    nutrients: {
      carbohydrates: { value: 82, percent: 27 },
      protein: { value: 0.3, percent: 0.6 },
      fat: { value: 0, percent: 0 },
      sugar: { value: 82, percent: 91 },
      fiber: { value: 0, percent: 0 },
      sodium: { value: 0.004, percent: 0 }
    },
    preservation: {
      method: 'Store in cool, dry place',
      duration: '24 months',
      tips: 'Keep tightly sealed. Natural crystallization may occur; warm gently to restore liquid state.'
    }
  },
  '5000112637922': {
    name: 'Organic Quinoa',
    brand: 'Earth Harvest',
    ingredients: '100% Organic White Quinoa',
    nutritionalInfo: 'Energy: 368 kcal, Protein: 14g, Carbohydrates: 64g, Fat: 6g',
    origin: 'Andean Mountains, Peru',
    nutrients: {
      carbohydrates: { value: 64, percent: 21 },
      protein: { value: 14, percent: 28 },
      fat: { value: 6, percent: 9 },
      sugar: { value: 2, percent: 2 },
      fiber: { value: 7, percent: 28 },
      sodium: { value: 0.007, percent: 0 }
    },
    preservation: {
      method: 'Store in airtight container',
      duration: '12-24 months',
      tips: 'Keep in cool, dry place. Refrigerate after opening for extended freshness.'
    }
  },
  '8901719110018': {
    name: 'Green Tea',
    brand: 'Mountain Tea Co.',
    ingredients: 'Green Tea Leaves, Natural Flavors',
    nutritionalInfo: 'Energy: 0 kcal, Antioxidants: High',
    origin: 'Darjeeling, India',
    nutrients: {
      carbohydrates: { value: 0, percent: 0 },
      protein: { value: 0, percent: 0 },
      fat: { value: 0, percent: 0 },
      sugar: { value: 0, percent: 0 },
      antioxidants: { value: 'High', percent: null },
      polyphenols: { value: '30-40% of dry weight', percent: null }
    },
    preservation: {
      method: 'Store in airtight container',
      duration: '18-24 months',
      tips: 'Keep away from strong odors, moisture, heat, and light. Do not refrigerate.'
    }
  },
  '8902080527022': {
    name: 'Organic Coconut Oil',
    brand: 'Tropicana Organic',
    ingredients: '100% Cold-Pressed Organic Coconut Oil',
    nutritionalInfo: 'Energy: 862 kcal, Fat: 100g, Saturated Fat: 86.5g',
    origin: 'Kerala, India',
    nutrients: {
      carbohydrates: { value: 0, percent: 0 },
      protein: { value: 0, percent: 0 },
      fat: { value: 100, percent: 153 },
      saturatedFat: { value: 86.5, percent: 432 },
      monounsaturatedFat: { value: 6.3, percent: null },
      polyunsaturatedFat: { value: 1.7, percent: null }
    },
    preservation: {
      method: 'Store in cool, dry place',
      duration: '18-24 months',
      tips: 'Natural solidification occurs below 76°F (24°C). No refrigeration required.'
    }
  }
};

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
  const [productInfo, setProductInfo] = useState<FoodItemWithDetails | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [verificationData, setVerificationData] = useState<OrganicVerification[] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [preservation, setPreservation] = useState<PreservationGuideline | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!productInfo) return;

    const foodItemUnsub = setupFoodItemRealtime(productInfo.id, (updatedItem) => {
      setProductInfo(prev => prev ? { ...prev, ...updatedItem } : null);
      toast({
        title: "Food Item Updated",
        description: "Food information has been updated in real-time",
        variant: "default"
      });
    });

    const nutrientsUnsub = setupNutrientsRealtime(productInfo.id, (updatedNutrients) => {
      setNutrients(updatedNutrients);
      setProductInfo(prev => prev ? { ...prev, nutrients: updatedNutrients } : null);
      toast({
        title: "Nutrients Updated",
        description: "Nutritional information has been updated in real-time",
        variant: "default"
      });
    });

    const preservationUnsub = setupPreservationRealtime(productInfo.id, (updatedPreservation) => {
      setPreservation(updatedPreservation);
      setProductInfo(prev => prev ? { ...prev, preservation: updatedPreservation } : null);
      toast({
        title: "Preservation Guidelines Updated",
        description: "Storage information has been updated in real-time",
        variant: "default"
      });
    });

    const verificationsUnsub = setupVerificationRealtime(productInfo.id, (updatedVerifications) => {
      setVerificationData(updatedVerifications);
      setProductInfo(prev => prev ? { ...prev, verifications: updatedVerifications } : null);
      toast({
        title: "Organic Verification Updated",
        description: "Certification information has been updated in real-time",
        variant: "default"
      });
    });

    return () => {
      foodItemUnsub();
      nutrientsUnsub();
      preservationUnsub();
      verificationsUnsub();
    };
  }, [productInfo?.id]);

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
      toast({
        title: "Success",
        description: "Camera activated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        title: "Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
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
    
    setTimeout(() => {
      let barcodeToUse;
      
      if (Math.random() > 0.5) {
        const mockBarcodes = Object.keys(organicProductsDatabase);
        barcodeToUse = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      } else {
        barcodeToUse = Math.floor(Math.random() * 9000000000000) + 1000000000000;
      }
      
      setResult(barcodeToUse.toString());
      setScanning(false);
      toast({
        title: "Success",
        description: "Barcode scanned successfully!",
        variant: "default"
      });
      
      processBarcode(barcodeToUse.toString());
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode && manualBarcode.length > 8) {
      setResult(manualBarcode);
      processBarcode(manualBarcode);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid barcode (at least 8 digits)",
        variant: "destructive"
      });
    }
  };

  const processBarcode = async (barcode: string) => {
    try {
      const foodData = await getFoodItemByBarcode(barcode);
      
      if (foodData) {
        setProductInfo(foodData);
        setNutrients(foodData.nutrients);
        setPreservation(foodData.preservation);
        setVerificationData(foodData.verifications);
        toast({
          title: "Product Found",
          description: `Found product: ${foodData.name}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "This barcode is not in our database",
          variant: "destructive"
        });
        setProductInfo(null);
        setVerificationData(null);
      }
    } catch (error) {
      console.error('Error fetching food item:', error);
      toast({
        title: "Error",
        description: "Unable to retrieve product information",
        variant: "destructive"
      });
    }
  };

  const verifyOrganicStatus = (barcode: string) => {
    setIsVerifying(true);
    setVerificationData(null);
    
    setTimeout(() => {
      let data;
      
      if (mockOrganicVerificationData[barcode as keyof typeof mockOrganicVerificationData]) {
        data = mockOrganicVerificationData[barcode as keyof typeof mockOrganicVerificationData];
        
        data = data.map((item: any) => ({
          source_name: item.source,
          is_verified: item.isOrganic,
          certification_id: item.certificationId,
          certification_date: item.certificationDate,
          notes: item.notes
        }));
      } else {
        const randomOrganic = Math.random() > 0.5;
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
        const dateStr = randomDate.toISOString().split('T')[0];
        
        data = [
          { 
            source_name: 'OrganicCertifier.org', 
            is_verified: randomOrganic, 
            certification_id: randomOrganic ? `ORG-${Math.floor(Math.random() * 10000)}-ID` : undefined,
            notes: randomOrganic ? 'Verified organic' : 'Not found in database'
          },
          { 
            source_name: 'GlobalOrganicDatabase.com', 
            is_verified: randomOrganic, 
            certification_date: randomOrganic ? dateStr : undefined,
            notes: randomOrganic ? 'Certification valid' : 'No certification record'
          },
          { 
            source_name: Math.random() > 0.5 ? 'USDAOrganicList.gov' : 'EUOrganicRegistry.eu', 
            is_verified: Math.random() > 0.7,
            notes: 'Status may vary by region'
          }
        ];
      }
      
      setVerificationData(data);
      setIsVerifying(false);
      
      const organicCount = data.filter(item => item.is_verified).length;
      if (organicCount > data.length / 2) {
        toast({
          title: "Verified Organic",
          description: "Product verified as organic by majority of sources!",
          variant: "default"
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Product may not be organic. Check verification details.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const getOverallOrganicStatus = () => {
    if (!verificationData) return null;
    
    const organicCount = verificationData.filter(item => item.is_verified).length;
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
                <div className="mt-2 bg-white p-3 rounded border border-gray-200 relative">
                  <Badge className="absolute top-2 right-2 bg-blue-500 animate-pulse">Real-time</Badge>
                  
                  <h5 className="font-medium text-organic">{productInfo.name}</h5>
                  <div className="text-xs text-gray-700 mt-1 space-y-1">
                    <p><span className="font-medium">Brand:</span> {productInfo.brand}</p>
                    <p><span className="font-medium">Ingredients:</span> {productInfo.ingredients}</p>
                    <p><span className="font-medium">Nutrition:</span> {productInfo.nutrients?.length} nutrient entries available</p>
                    <p><span className="font-medium">Origin:</span> {productInfo.origin}</p>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center mb-1">
                        <Timer className="h-3 w-3 mr-1 text-organic" />
                        <p className="font-medium">Preservation:</p>
                      </div>
                      <p><span className="font-medium">Refrigerated:</span> {productInfo.preservation.refrigerated_duration}</p>
                      <p><span className="font-medium">Storage Method:</span> {productInfo.preservation.storage_method}</p>
                      <p className="text-xs italic mt-1">{productInfo.preservation.tips}</p>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="font-medium mb-1">Detailed Nutritional Information:</p>
                      <div className="max-h-40 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="py-1 px-2">Nutrient</TableHead>
                              <TableHead className="py-1 px-2">Amount</TableHead>
                              <TableHead className="py-1 px-2">% Daily Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productInfo.nutrients.map((nutrient, index) => (
                              <TableRow key={index}>
                                <TableCell className="py-1 px-2 capitalize">{nutrient.nutrient_name}</TableCell>
                                <TableCell className="py-1 px-2">{nutrient.value} {nutrient.unit}</TableCell>
                                <TableCell className="py-1 px-2">{nutrient.daily_value_percent !== null ? `${nutrient.daily_value_percent}%` : '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
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
                            <span className="font-medium truncate max-w-[180px]">{item.source_name}</span>
                            {item.is_verified ? (
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
                            {item.certification_id && <div>ID: {item.certification_id}</div>}
                            {item.certification_date && <div>Date: {item.certification_date}</div>}
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
