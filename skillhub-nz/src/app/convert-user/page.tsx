'use client';

import { useState } from 'react';
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConvertUserPage() {
  const [email, setEmail] = useState('');
  const [institutionData, setInstitutionData] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    website: '',
    licenseNumber: '',
    establishedYear: new Date().getFullYear(),
    specialties: [] as string[],
  });
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
      const response = await fetch('/api/convert-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          institutionData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('请求失败，请重试');
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
              <h1 className="text-2xl font-bold text-gray-900">转换现有用户为教育机构</h1>
              <p className="text-gray-600">将现有用户账号转换为教育机构账号</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 邮箱输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                现有用户邮箱 *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入现有用户的邮箱地址"
              />
            </div>

            {/* 教育机构信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">教育机构信息</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构名称 *
                  </label>
                  <input
                    type="text"
                    value={institutionData.name}
                    onChange={(e) => setInstitutionData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入机构名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构描述
                  </label>
                  <textarea
                    value={institutionData.description}
                    onChange={(e) => setInstitutionData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入机构描述"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={institutionData.phoneNumber}
                      onChange={(e) => setInstitutionData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入联系电话"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      成立年份
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={institutionData.establishedYear}
                      onChange={(e) => setInstitutionData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构地址
                  </label>
                  <input
                    type="text"
                    value={institutionData.address}
                    onChange={(e) => setInstitutionData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入机构地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    官方网站
                  </label>
                  <input
                    type="url"
                    value={institutionData.website}
                    onChange={(e) => setInstitutionData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* 转换按钮 */}
            <button
              onClick={handleConvert}
              disabled={isLoading || !email.trim() || !institutionData.name.trim()}
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
                    <p><strong>用户ID:</strong> {result.user.id}</p>
                    <p><strong>邮箱:</strong> {result.user.email}</p>
                    <p><strong>角色:</strong> {result.user.role}</p>
                    <p><strong>机构名称:</strong> {result.institution.name}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. 输入现有用户的邮箱地址</p>
              <p>2. 填写教育机构信息</p>
              <p>3. 点击"转换为教育机构"按钮</p>
              <p>4. 转换成功后，该用户就可以使用教育机构功能了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
