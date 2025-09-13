import { getServerUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            欢迎回来，{user.displayName}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 我的课程 */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">我的课程</h2>
              <p className="text-gray-600 mb-4">查看您已报名的课程</p>
              <Link
                href="/courses"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                浏览课程
              </Link>
            </div>

            {/* 学习进度 */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">学习进度</h2>
              <p className="text-gray-600 mb-4">跟踪您的学习进展</p>
              <div className="text-sm text-gray-500">
                功能开发中...
              </div>
            </div>
          </div>

          {/* 用户信息 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">账户信息</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">邮箱:</span>
                <span className="ml-2 text-gray-600">{user.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">角色:</span>
                <span className="ml-2 text-gray-600">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

