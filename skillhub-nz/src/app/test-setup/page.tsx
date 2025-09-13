'use client';

import { useState } from 'react';
import { Building2, Users, BookOpen, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const setupActions = [
    {
      id: 'institution',
      title: '创建测试教育机构',
      description: '创建一个测试教育机构账号和相关数据',
      icon: Building2,
      action: 'create-test-institution',
      color: 'blue',
    },
    {
      id: 'coach',
      title: '创建测试教练',
      description: '创建一个测试教练账号',
      icon: Users,
      action: 'create-test-coach',
      color: 'green',
    },
    {
      id: 'course',
      title: '创建测试课程',
      description: '创建一个测试课程',
      icon: BookOpen,
      action: 'create-test-course',
      color: 'purple',
    },
    {
      id: 'reviews',
      title: '创建测试评论',
      description: '创建一些测试评论数据',
      icon: MessageSquare,
      action: 'create-test-reviews',
      color: 'yellow',
    },
  ];

  const handleSetup = async (action: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action,
          email: 'test@example.com' // 您可以修改这个邮箱
        }),
      });

      const result = await response.json();
      
      setResults(prev => [...prev, {
        action,
        success: result.success,
        message: result.message,
        data: result,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        action,
        success: false,
        message: '请求失败',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">测试数据设置</h1>
          <p className="text-gray-600">快速创建测试数据来验证教育机构功能</p>
        </div>

        {/* 设置操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {setupActions.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSetup(item.action)}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 bg-${item.color}-600 text-white rounded-lg hover:bg-${item.color}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {isLoading ? '设置中...' : '创建'}
                </button>
              </div>
            );
          })}
        </div>

        {/* 结果展示 */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">设置结果</h3>
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清除结果
              </button>
            </div>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {setupActions.find(a => a.action === result.action)?.title}
                        </span>
                        <span className="text-sm text-gray-500">{result.timestamp}</span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">使用说明</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>1. 创建测试数据：</strong> 点击上面的按钮创建测试数据
            </div>
            <div>
              <strong>2. 测试教育机构登录：</strong> 
              <ul className="ml-4 mt-1 space-y-1">
                <li>• 访问 <code className="bg-blue-100 px-1 rounded">/auth/institution-signin</code></li>
                <li>• 使用邮箱 <code className="bg-blue-100 px-1 rounded">test@example.com</code> 登录</li>
                <li>• 密码：您注册时设置的密码</li>
              </ul>
            </div>
            <div>
              <strong>3. 测试功能：</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• 教育机构仪表板：<code className="bg-blue-100 px-1 rounded">/institution/dashboard</code></li>
                <li>• 发布课程：<code className="bg-blue-100 px-1 rounded">/institution/courses/new</code></li>
                <li>• 添加教练：<code className="bg-blue-100 px-1 rounded">/institution/coaches/new</code></li>
                <li>• 管理评论：<code className="bg-blue-100 px-1 rounded">/institution/reviews</code></li>
              </ul>
            </div>
            <div>
              <strong>4. 注意事项：</strong> 这是测试环境，数据不会影响生产环境
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
