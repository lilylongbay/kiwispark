'use client';

import { useState } from 'react';
import { Building2, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ConvertUserSimplePage() {
  const [email, setEmail] = useState('lilylongbay@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 模拟转换过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功结果
      setResult({
        success: true,
        message: '用户已成功转换为教育机构',
        user: {
          id: 'demo-user-id',
          email: email.trim(),
          role: 'institution',
          displayName: '新西兰编程学院',
        },
        institution: {
          name: '新西兰编程学院',
          description: '专注于编程教育的专业机构',
          address: '奥克兰市中心',
          phoneNumber: '021-123-4567',
          email: email.trim(),
          establishedYear: 2020,
          specialties: ['编程开发', 'Web开发', '移动应用开发'],
        }
      });
    } catch (err) {
      setError('转换失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">转换用户为教育机构</h1>
              <p className="text-gray-600">将现有用户账号转换为教育机构账号</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 邮箱输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户邮箱 *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入用户邮箱地址"
              />
            </div>

            {/* 转换按钮 */}
            <button
              onClick={handleConvert}
              disabled={isLoading || !email.trim()}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '转换中...' : '转换为教育机构'}
            </button>
          </div>

          {/* 结果显示 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">转换失败</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">转换成功</h3>
                  <p className="mt-1 text-sm text-green-700">{result.message}</p>
                  <div className="mt-3 text-sm text-green-700">
                    <p><strong>用户邮箱:</strong> {result.user.email}</p>
                    <p><strong>角色:</strong> {result.user.role}</p>
                    <p><strong>机构名称:</strong> {result.institution.name}</p>
                    <p><strong>机构地址:</strong> {result.institution.address}</p>
                    <p><strong>联系电话:</strong> {result.institution.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">使用说明</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>1. 输入要转换的用户邮箱地址</p>
                  <p>2. 点击"转换为教育机构"按钮</p>
                  <p>3. 转换成功后，该用户就可以使用教育机构功能了</p>
                  <p>4. 现在可以使用该邮箱登录教育机构系统</p>
                </div>
              </div>
            </div>
          </div>

          {/* 登录链接 */}
          {result && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">下一步</h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <p>转换完成！现在您可以：</p>
                <div className="space-y-2">
                  <a
                    href="/zh/auth/institution-signin"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    登录教育机构系统
                  </a>
                  <a
                    href="/institution/dashboard"
                    className="inline-block ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    访问教育机构仪表板
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
