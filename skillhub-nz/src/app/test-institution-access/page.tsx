'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  BookOpen, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function TestInstitutionAccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }
  }, [user, loading, router]);

  const runTests = () => {
    const results = [];

    // 测试1：用户角色检查
    results.push({
      test: '用户角色检查',
      status: user?.role === 'institution' ? 'pass' : 'fail',
      message: user?.role === 'institution' 
        ? `用户角色正确: ${user.role}` 
        : `用户角色错误: ${user?.role}，应该是 institution`,
      details: {
        email: user?.email,
        role: user?.role,
        displayName: user?.displayName
      }
    });

    // 测试2：教育机构仪表板访问
    results.push({
      test: '教育机构仪表板访问',
      status: user?.role === 'institution' ? 'pass' : 'fail',
      message: user?.role === 'institution' 
        ? '可以访问教育机构仪表板' 
        : '无法访问教育机构仪表板',
      link: '/institution/dashboard'
    });

    // 测试3：课程发布功能
    results.push({
      test: '课程发布功能',
      status: user?.role === 'institution' ? 'pass' : 'fail',
      message: user?.role === 'institution' 
        ? '可以访问课程发布页面' 
        : '无法访问课程发布页面',
      link: '/institution/courses/new'
    });

    // 测试4：教练管理功能
    results.push({
      test: '教练管理功能',
      status: user?.role === 'institution' ? 'pass' : 'fail',
      message: user?.role === 'institution' 
        ? '可以访问教练管理页面' 
        : '无法访问教练管理页面',
      link: '/institution/coaches/new'
    });

    // 测试5：评论回复功能
    results.push({
      test: '评论回复功能',
      status: user?.role === 'institution' ? 'pass' : 'fail',
      message: user?.role === 'institution' 
        ? '可以访问评论管理页面' 
        : '无法访问评论管理页面',
      link: '/institution/reviews'
    });

    setTestResults(results);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未登录</h2>
          <p className="text-gray-600 mb-4">请先登录以测试教育机构功能</p>
          <Link
            href="/zh/auth/institution-signin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            登录教育机构账号
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">教育机构功能测试</h1>
              <p className="text-gray-600">验证教育机构用户的完整功能访问权限</p>
            </div>
          </div>

          {/* 用户信息 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">当前用户信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">邮箱:</span>
                <span className="ml-2 text-gray-900">{user.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">显示名称:</span>
                <span className="ml-2 text-gray-900">{user.displayName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">用户角色:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'institution' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.role}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">验证状态:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  user.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isVerified ? '已验证' : '未验证'}
                </span>
              </div>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="mb-6">
            <button
              onClick={runTests}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              运行功能测试
            </button>
          </div>

          {/* 测试结果 */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">测试结果</h3>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'pass'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      {result.status === 'pass' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{result.test}</h4>
                        <p className={`text-sm mt-1 ${
                          result.status === 'pass' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                        {result.details && (
                          <div className="mt-2 text-xs text-gray-600">
                            <pre>{JSON.stringify(result.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                    {result.link && (
                      <Link
                        href={result.link}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        访问
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 快速访问链接 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/institution/dashboard"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">仪表板</h4>
                <p className="text-sm text-gray-600">管理概览</p>
              </div>
            </Link>

            <Link
              href="/institution/courses/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">发布课程</h4>
                <p className="text-sm text-gray-600">创建新课程</p>
              </div>
            </Link>

            <Link
              href="/institution/coaches/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">添加教练</h4>
                <p className="text-sm text-gray-600">管理教练团队</p>
              </div>
            </Link>

            <Link
              href="/institution/reviews"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">评论管理</h4>
                <p className="text-sm text-gray-600">回复学员评论</p>
              </div>
            </Link>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. 点击"运行功能测试"按钮检查所有功能访问权限</p>
              <p>2. 使用上方的快速访问链接直接进入各个功能页面</p>
              <p>3. 如果测试失败，请检查用户角色是否正确设置为 'institution'</p>
              <p>4. 确保已正确登录教育机构账号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
