import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { foodApi } from '../../lib/food-data';
import { useToast } from '../../hooks/use-toast';

interface ImageUploadProps {
  onFoodAdded: () => void;
  token: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFoodAdded, token }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [mealType, setMealType] = useState('');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const analyzeFood = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    try {
      const result = await foodApi.analyzeFood(selectedFile);
      setAnalysisResult(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const addToFoodLog = async () => {
    if (!analysisResult || !mealType) {
      toast({
        title: "Error",
        description: "Please select a meal type.",
        variant: "destructive",
      });
      return;
    }

    try {
      await foodApi.createFoodEntry({
        foodName: analysisResult.name,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fat: analysisResult.fat,
        confidence: analysisResult.confidence,
        mealType,
        imageUrl: preview,
      });

      toast({
        title: "Success",
        description: "Food added to your log!",
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setAnalysisResult(null);
      setMealType('');
      onFoodAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add food to log. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/ai/analyze-food', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setAnalysisResult(data);
    onFoodAdded();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Food Recognition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Food preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    onClick={analyzeFood}
                    disabled={analyzing}
                    className="w-full"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Analyze Food
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">AI Analysis</h4>
            {analysisResult ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Detected Food:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysisResult.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Calories:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysisResult.calories} cal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Protein:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysisResult.protein}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Carbs:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysisResult.carbs}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fat:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysisResult.fat}g
                  </span>
                </div>
                <div className="mt-4">
                  <Label htmlFor="mealType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meal Type
                  </Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={addToFoodLog}
                  className="w-full mt-4"
                  disabled={!mealType}
                >
                  Add to Food Log
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Upload and analyze a food image to see results here.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
