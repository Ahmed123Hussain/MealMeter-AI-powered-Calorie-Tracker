import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/layout/layout';
import { StatsCard } from '../components/dashboard/stats-card';
import { WeeklyChart } from '../components/dashboard/weekly-chart';
import { FoodLog } from '../components/dashboard/food-log';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'wouter';
import { Plus, Zap, Activity, Droplets } from 'lucide-react';
import { foodApi } from '../lib/food-data';
import { useToast } from '../hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => foodApi.getDashboardStats(),
  });

  const { data: todayEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ['/api/food-entries/today'],
    queryFn: () => foodApi.getTodayEntries(),
  });

  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ['/api/dashboard/weekly'],
    queryFn: () => foodApi.getWeeklyData(),
  });

  const handleDeleteEntry = async (id: number) => {
    try {
      await foodApi.deleteFoodEntry(id);
      queryClient.invalidateQueries({ queryKey: ['/api/food-entries/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Food entry deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete food entry.",
        variant: "destructive",
      });
    }
  };

  if (statsLoading || entriesLoading || weeklyLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Dashboard Overview */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your daily nutrition goals</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/upload">
                <Plus className="w-5 h-5 mr-2" />
                Add Food
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Calories Consumed"
            value={stats?.totalCalories || 0}
            unit="cal"
            goal={stats?.calorieGoal || 2000}
            icon={<Zap className="w-8 h-8 text-white" />}
            color="bg-primary text-white"
          />
          <StatsCard
            title="Protein"
            value={stats?.totalProtein || 0}
            unit="g"
            goal={120}
            icon={<Activity className="w-8 h-8 text-white" />}
            color="bg-blue-500 text-white"
          />
          <StatsCard
            title="Water"
            value={6.2}
            unit="L"
            goal={8}
            icon={<Droplets className="w-8 h-8 text-white" />}
            color="bg-cyan-500 text-white"
          />
        </div>

        {/* Charts and Food Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeeklyChart data={weeklyData || []} />
          <FoodLog 
            entries={todayEntries || []} 
            onDelete={handleDeleteEntry}
          />
        </div>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nutrition Tip</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.totalCalories && stats?.calorieGoal
                    ? stats.totalCalories < stats.calorieGoal
                      ? `You're ${stats.calorieGoal - stats.totalCalories} calories under your goal. Consider adding a healthy snack like nuts or Greek yogurt.`
                      : "Great job meeting your calorie goal! Focus on nutrient-dense foods for optimal health."
                    : "Start tracking your meals to get personalized nutrition recommendations."}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hydration Reminder</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're 1.8L short of your water goal. Try to drink a glass of water every hour to stay properly hydrated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
