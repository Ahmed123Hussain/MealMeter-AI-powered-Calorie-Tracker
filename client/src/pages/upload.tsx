import { useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/layout/layout';
import { ImageUpload } from '../components/upload/image-upload';

export default function Upload() {
  const queryClient = useQueryClient();

  const handleFoodAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/food-entries/today'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/weekly'] });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Food Photo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Take a photo of your food and let AI analyze its nutritional content
          </p>
        </div>

        <ImageUpload onFoodAdded={handleFoodAdded} />
      </div>
    </Layout>
  );
}
