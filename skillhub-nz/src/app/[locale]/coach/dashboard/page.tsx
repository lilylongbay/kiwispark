import { getServerUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CoachDashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth/signin');
  }

  if (user.role !== 'coach') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            教练管理面板
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* 我的课程 */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">我的课程</h2>
              <p className="text-gray-600 mb-4">管理您发布的课程</p>
              <Link
                href="/courses"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看课程
              </Link>
            </div>

            {/* 学员管理 */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">学员管理</h2>
              <p className="text-gray-600 mb-4">查看和管理您的学员</p>
              <div className="text-sm text-gray-500">
                功能开发中...
              </div>
            </div>

            {/* 收入统计 */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">收入统计</h2>
              <p className="text-gray-600 mb-4">查看您的收入情况</p>
              <div className="text-sm text-gray-500">
                功能开发中...
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                浏览所有课程
              </Link>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                发布新课程
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
