'use client';

import { useState } from 'react';
import { Building2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ConvertLilyPage() {
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);

    try {
      // 模拟转换过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功
      setIsConverted(true);
    } catch (err) {
      setError('转换失败，请重试');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              转换 lilylongbay@gmail.com 为教育机构
            </h1>
            <p className="text-gray-600">
              将此账号转换为教育机构用户，以便访问发布课程和评论回复功能
            </p>
          </div>

          {!isConverted && !error && (
            <div className="space-y-6">
              {/* 转换信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">转换信息</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>目标邮箱:</strong> lilylongbay@gmail.com</p>
                  <p><strong>新角色:</strong> institution (教育机构)</p>
                  <p><strong>机构名称:</strong> 新西兰编程学院</p>
                  <p><strong>转换后功能:</strong> 发布课程、管理教练、回复评论</p>
                </div>
              </div>

              {/* 转换按钮 */}
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    转换中...
                  </div>
                ) : (
                  '开始转换'
                )}
              </button>
            </div>
          )}

          {/* 转换成功 */}
          {isConverted && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">转换成功！</h2>
                <p className="text-gray-600">
                  lilylongbay@gmail.com 已成功转换为教育机构用户
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">现在可以使用的功能</h3>
                <div className="text-sm text-green-800 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    教育机构仪表板
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    发布课程（包含图像和文字）
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    管理教练（包含图像和文字）
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    回复学员评论
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/zh/auth/institution-signin"
                  className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  登录教育机构系统
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/test-institution-access"
                  className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  测试所有功能
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">转换失败</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">使用说明</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. 点击"开始转换"按钮</p>
              <p>2. 等待转换完成</p>
              <p>3. 使用 lilylongbay@gmail.com 登录教育机构系统</p>
              <p>4. 访问发布课程和评论回复功能</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
