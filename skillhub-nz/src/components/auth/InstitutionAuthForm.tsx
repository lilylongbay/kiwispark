'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/client';
import { signinSchema, institutionSignupSchema, type SigninFormData, type InstitutionSignupFormData } from '@/lib/validations';
import { createUserDoc } from '@/lib/firestore';
import { Building2, Mail, Lock, User } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

interface InstitutionAuthFormProps {
  initialMode?: AuthMode;
}

// 使用导入的类型
type InstitutionSignupData = InstitutionSignupFormData;

export default function InstitutionAuthForm({ initialMode = 'signin' }: InstitutionAuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const isSignIn = mode === 'signin';

  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<InstitutionSignupData>({
    resolver: zodResolver(institutionSignupSchema),
  });

  const currentForm = isSignIn ? signinForm : signupForm;

  const handleEmailAuth = async (data: SigninFormData | InstitutionSignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      let userCredential;

      if (isSignIn) {
        // 登录
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      } else {
        // 注册
        const signupData = data as InstitutionSignupData;
        userCredential = await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );

        // 创建用户文档
        console.log('注册数据:', signupData);
        const userDoc = createUserDoc({
          email: signupData.email,
          displayName: signupData.institutionName || signupData.name || '教育机构',
          role: 'institution',
          isVerified: false,
        });
        console.log('用户文档:', userDoc);

        // 写入Firestore
        await setDoc(doc(firestore, 'users', userCredential.user.uid), userDoc);

        // 创建教育机构文档
        const institutionDoc = {
          userId: userCredential.user.uid,
          name: signupData.institutionName,
          description: '',
          website: signupData.website || '',
          address: signupData.address,
          phoneNumber: signupData.phoneNumber,
          email: signupData.email,
          licenseNumber: signupData.licenseNumber || '',
          establishedYear: signupData.establishedYear,
          specialties: [],
          isActive: true,
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(firestore, 'institutions', userCredential.user.uid), institutionDoc);
      }

      const user = userCredential.user;

      // 获取ID token
      const idToken = await user.getIdToken();

      // 发送到session API设置cookie
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('设置会话失败');
      }

      // 重定向到教育机构仪表板
      router.push(`/${i18n.language}/institution/dashboard`);
    } catch (err: any) {
      console.error('认证错误:', err);
      
      // 处理常见错误
      switch (err.code) {
        case 'auth/user-not-found':
          setError('用户不存在');
          break;
        case 'auth/wrong-password':
          setError('密码错误');
          break;
        case 'auth/invalid-email':
          setError('邮箱格式无效');
          break;
        case 'auth/user-disabled':
          setError('账户已被禁用');
          break;
        case 'auth/too-many-requests':
          setError('请求过于频繁，请稍后再试');
          break;
        case 'auth/email-already-in-use':
          setError('邮箱已被使用。如果您已有账号，请直接登录。如果没有账号，请使用其他邮箱注册。');
          break;
        case 'auth/weak-password':
          setError('密码强度不够');
          break;
        default:
          setError(isSignIn ? '登录失败' : '注册失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // 检查用户是否已存在
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // 新用户，创建用户文档
        const newUserDoc = createUserDoc({
          email: user.email || '',
          displayName: user.displayName || '',
          role: 'institution',
          isVerified: user.emailVerified,
        });

        await setDoc(userDocRef, newUserDoc);
      }

      // 获取ID token
      const idToken = await user.getIdToken();

      // 发送到session API设置cookie
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('设置会话失败');
      }

      // 重定向到教育机构仪表板
      router.push(`/${i18n.language}/institution/dashboard`);
    } catch (err: any) {
      console.error('Google认证错误:', err);
      setError(isSignIn ? 'Google登录失败' : 'Google注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isSignIn ? 'signup' : 'signin');
    setError(null);
    currentForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isSignIn ? '教育机构登录' : '教育机构注册'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn ? '还没有账户？' : '已有账户？'}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isSignIn ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form 
            className="space-y-6" 
            onSubmit={currentForm.handleSubmit(handleEmailAuth)}
          >
            {/* Institution Name field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  机构名称
                </label>
                <input
                  {...signupForm.register('institutionName')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入机构名称"
                />
              </div>
            )}

            {/* Name field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  联系人姓名
                </label>
                <input
                  {...signupForm.register('name')}
                  type="text"
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入联系人姓名"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                邮箱地址
              </label>
              <input
                {...currentForm.register('email')}
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入邮箱地址"
              />
            </div>

            {/* Phone Number field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  联系电话
                </label>
                <input
                  {...signupForm.register('phoneNumber')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入联系电话"
                />
              </div>
            )}

            {/* Address field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  机构地址
                </label>
                <input
                  {...signupForm.register('address')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入机构地址"
                />
              </div>
            )}

            {/* Website field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  官方网站 (可选)
                </label>
                <input
                  {...signupForm.register('website')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* Established Year field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="establishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  成立年份
                </label>
                <input
                  {...signupForm.register('establishedYear', { valueAsNumber: true })}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入成立年份"
                />
              </div>
            )}

            {/* License Number field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  教育许可证号 (可选)
                </label>
                <input
                  {...signupForm.register('licenseNumber')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入教育许可证号"
                />
              </div>
            )}

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                密码
              </label>
              <input
                {...currentForm.register('password')}
                type="password"
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="请输入密码"
              />
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  确认密码
                </label>
                <input
                  {...signupForm.register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请再次输入密码"
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignIn ? '登录中...' : '注册中...'}
                </div>
              ) : (
                isSignIn ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者</span>
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSignIn ? '使用Google登录' : '使用Google注册'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
