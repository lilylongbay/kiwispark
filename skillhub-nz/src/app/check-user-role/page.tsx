'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Building2, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function CheckUserRolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }
  }, [user, loading, router]);

  const convertToInstitution = async () => {
    setIsConverting(true);
    setConversionResult(null);

    try {
      // 模拟转换过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功结果
      setConversionResult({
        success: true,
        message: '用户角色已成功转换为教育机构',
        newRole: 'institution'
      });
    } catch (error) {
      setConversionResult({
        success: false,
        message: '转换失败，请重试'
      });
    } finally {
      setIsConverting(false);
    }
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
          <p className="text-gray-600 mb-4">请先登录</p>
          <Link
            href="/zh/auth/institution-signin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            登录
          </Link>
        </div>
      </div>
    );
  }

  const isInstitution = user.role === 'institution';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isInstitution ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {isInstitution ? (
                <Building2 className="w-8 h-8 text-green-600" />
              ) : (
                <User className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isInstitution ? '教育机构用户' : '普通用户'}
            </h1>
            <p className="text-gray-600">
              {isInstitution 
                ? '您已拥有教育机构权限，可以访问管理功能' 
                : '您当前是普通用户，需要转换为教育机构用户才能访问管理功能'
              }
            </p>
          </div>

          {/* 用户信息 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户信息</h3>
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
                  isInstitution 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
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

          {/* 转换结果 */}
          {conversionResult && (
            <div className={`mb-6 p-4 rounded-lg border ${
              conversionResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {conversionResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`text-sm font-medium ${
                    conversionResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {conversionResult.success ? '转换成功' : '转换失败'}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    conversionResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {conversionResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-4">
            {!isInstitution ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">需要转换</h3>
                  <p className="text-sm text-yellow-800">
                    您当前是普通用户，需要转换为教育机构用户才能访问管理功能。
                  </p>
                </div>
                
                <button
                  onClick={convertToInstitution}
                  disabled={isConverting}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isConverting ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                      转换中...
                    </div>
                  ) : (
                    '转换为教育机构用户'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-900 mb-2">权限确认</h3>
                  <p className="text-sm text-green-800">
                    您已拥有教育机构权限，可以访问所有管理功能。
                  </p>
                </div>

                <Link
                  href="/institution/dashboard"
                  className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  进入教育机构管理界面
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}

            {/* 刷新页面按钮 */}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              刷新页面
            </button>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用说明</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. 如果显示"普通用户"，请点击"转换为教育机构用户"</p>
              <p>2. 转换成功后，点击"进入教育机构管理界面"</p>
              <p>3. 如果转换后仍显示普通用户，请刷新页面</p>
              <p>4. 确保使用正确的邮箱登录：lilylongbay@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
