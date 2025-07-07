import { Layout } from '../components/layout/layout';
import { ProfileForm } from '../components/profile/profile-form';

export default function Profile() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your personal information and nutrition goals
          </p>
        </div>

        <ProfileForm />
      </div>
    </Layout>
  );
}
