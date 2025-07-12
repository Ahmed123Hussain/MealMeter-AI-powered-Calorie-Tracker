import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/layout/layout';
import { useAuth } from '../context/auth-context';

function ImageUpload({ onFoodAdded, token }: { onFoodAdded: () => void; token: string }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file)); // Show image preview

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
    setAnalysis(data);
    onFoodAdded();
  };

  return (
    <div className="flex gap-8 mt-6">
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 flex-1">
        <h2 className="text-lg font-semibold mb-2">AI Food Recognition</h2>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mb-4"
            id="food-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="food-upload" className="cursor-pointer flex flex-col items-center">
            {preview ? (
              <img src={preview} alt="Preview" className="mb-4 rounded-lg max-h-40" />
            ) : (
              <span className="text-green-600 font-semibold mb-2">Click to upload</span>
            )}
            <span>or drag and drop</span>
            <div className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</div>
          </label>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 flex-1 shadow-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span role="img" aria-label="analysis">🔎</span> AI Analysis
        </h2>
        {analysis ? (
          <div className="space-y-2 animate-fade-in">
            <div className="mb-2 font-medium text-xl">
              Food: <span className="font-bold text-green-700 dark:text-green-400">{analysis.name}</span>
            </div>
            <div>
              <span className="font-semibold">Calories:</span>
              <span className="ml-2 text-orange-600 dark:text-orange-400">{analysis.calories}</span>
            </div>
            <div>
              <span className="font-semibold">Protein:</span>
              <span className="ml-2 text-blue-600 dark:text-blue-400">{analysis.protein}g</span>
            </div>
            <div>
              <span className="font-semibold">Carbs:</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400">{analysis.carbs}g</span>
            </div>
            <div>
              <span className="font-semibold">Fat:</span>
              <span className="ml-2 text-pink-600 dark:text-pink-400">{analysis.fat}g</span>
            </div>
            <div>
              <span className="font-semibold">Confidence:</span>
              <span className="ml-2 text-green-600 dark:text-green-400">{(analysis.confidence * 100).toFixed(1)}%</span>
            </div>
            {/* Meal Type Dropdown */}
      <div className="mt-4">
        <label htmlFor="meal-type" className="font-semibold mr-2">Meal Type:</label>
        <select
          id="meal-type"
          className="border rounded px-2 py-1"
          value={mealType}
          onChange={e => setMealType(e.target.value)}
        >
          <option value="" disabled>Select meal type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>
      {/* Add Food Item Button */}
    <div className="mt-4">
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        onClick={async () => {
          if (!analysis || !mealType) return;
          await fetch('/api/food-entries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              foodName: analysis.name, // <-- changed from 'name'
              calories: analysis.calories,
              protein: analysis.protein,
              carbs: analysis.carbs,
              fat: analysis.fat,
              confidence: analysis.confidence,
              mealType,
              imageUrl: preview, // If you store image URLs, otherwise send the file
            }),
          });
          onFoodAdded(); // This will refresh dashboard stats and logs
        }}
      >
        Add Food Item
      </button>
    </div>
    </div>
        ) : (
          <div className="text-gray-500">
            Upload and analyze a food image to see results here.
          </div>
        )}
      </div>
    </div>
  );
}

export default function Upload() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const handleFoodAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/food-entries/today'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/weekly'] });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Food Photo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Take a photo of your food and let AI analyze its nutritional content
          </p>
        </div>

        <ImageUpload onFoodAdded={handleFoodAdded} token={token} />
      </div>
    </Layout>
  );
}
