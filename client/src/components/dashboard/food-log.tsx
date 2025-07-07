import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { FoodEntry } from '@shared/schema';
import { format } from 'date-fns';

interface FoodLogProps {
  entries: FoodEntry[];
  onDelete: (id: number) => void;
}

export const FoodLog: React.FC<FoodLogProps> = ({ entries, onDelete }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Food Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No food entries yet. Start by uploading a photo of your meal!
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt={entry.foodName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {entry.foodName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.mealType} • {format(new Date(entry.createdAt), 'h:mm a')}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {entry.calories} cal
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.protein}g protein
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
