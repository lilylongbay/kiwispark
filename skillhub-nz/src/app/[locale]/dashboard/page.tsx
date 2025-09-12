import { getServerUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            欢迎来到仪表板
          </h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">用户信息</h2>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">姓名:</span> {user.displayName}</p>
                <p><span className="font-medium">邮箱:</span> {user.email}</p>
                <p><span className="font-medium">角色:</span> {user.role}</p>
                <p><span className="font-medium">用户ID:</span> {user.uid}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h2 className="text-lg font-medium text-gray-900">快速操作</h2>
              <div className="mt-2 space-x-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  查看课程
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  我的学习
                </button>
                {user.role === 'coach' && (
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                    教练面板
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

