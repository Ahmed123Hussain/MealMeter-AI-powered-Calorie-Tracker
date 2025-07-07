import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  goal: number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  goal,
  icon,
  color,
}) => {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              of {goal.toLocaleString()} {unit}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
