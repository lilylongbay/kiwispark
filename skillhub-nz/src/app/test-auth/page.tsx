'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { institutionSignupSchema, type InstitutionSignupFormData } from '@/lib/validations';
import { createUserDoc } from '@/lib/firestore';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InstitutionSignupFormData>({
    resolver: zodResolver(institutionSignupSchema),
  });

  const testCreateUserDoc = (data: InstitutionSignupFormData) => {
    try {
      console.log('测试数据:', data);
      
      const userDoc = createUserDoc({
        email: data.email,
        displayName: data.institutionName || data.name || '教育机构',
        role: 'institution',
        isVerified: false,
      });
      
      console.log('创建的用户文档:', userDoc);
      setResult(userDoc);
      setError(null);
    } catch (err) {
      console.error('创建用户文档失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">测试教育机构注册</h1>
          
          <form onSubmit={form.handleSubmit(testCreateUserDoc)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                机构名称 *
              </label>
              <input
                {...form.register('institutionName')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入机构名称"
              />
              {form.formState.errors.institutionName && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.institutionName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系人姓名 *
              </label>
              <input
                {...form.register('name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入联系人姓名"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 *
              </label>
              <input
                {...form.register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入邮箱地址"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 *
              </label>
              <input
                {...form.register('phoneNumber')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入联系电话"
              />
              {form.formState.errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                机构地址 *
              </label>
              <input
                {...form.register('address')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入机构地址"
              />
              {form.formState.errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                成立年份 *
              </label>
              <input
                {...form.register('establishedYear', { valueAsNumber: true })}
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入成立年份"
              />
              {form.formState.errors.establishedYear && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.establishedYear.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 *
              </label>
              <input
                {...form.register('password')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入密码"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 *
              </label>
              <input
                {...form.register('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请再次输入密码"
              />
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              测试创建用户文档
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">错误:</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">成功创建用户文档:</h3>
              <pre className="mt-2 text-sm text-green-700 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
