'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/client';
import { signinSchema, signupSchema, type SigninFormData, type SignupFormData } from '@/lib/validations';
import { createUserDoc } from '@/lib/firestore';

type AuthMode = 'signin' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
}

export default function AuthForm({ initialMode = 'signin' }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const isSignIn = mode === 'signin';

  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const currentForm = isSignIn ? signinForm : signupForm;

  const handleEmailAuth = async (data: SigninFormData | SignupFormData) => {
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
        const signupData = data as SignupFormData;
        userCredential = await createUserWithEmailAndPassword(
          auth,
          signupData.email,
          signupData.password
        );

        // 创建用户文档
        const userDoc = createUserDoc({
          email: signupData.email,
          displayName: signupData.name,
          role: 'user',
          isVerified: false,
        });

        // 写入Firestore
        await setDoc(doc(firestore, 'users', userCredential.user.uid), userDoc);
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

      // 重定向到首页
      router.push(`/${i18n.language}`);
    } catch (err: any) {
      console.error('认证错误:', err);
      
      // 处理常见错误
      switch (err.code) {
        case 'auth/user-not-found':
          setError(t('auth.errors.userNotFound'));
          break;
        case 'auth/wrong-password':
          setError(t('auth.errors.wrongPassword'));
          break;
        case 'auth/invalid-email':
          setError(t('auth.errors.invalidEmail'));
          break;
        case 'auth/user-disabled':
          setError(t('auth.errors.userDisabled'));
          break;
        case 'auth/too-many-requests':
          setError(t('auth.errors.tooManyRequests'));
          break;
        case 'auth/email-already-in-use':
          setError(t('auth.errors.emailAlreadyInUse'));
          break;
        case 'auth/weak-password':
          setError(t('auth.errors.weakPassword'));
          break;
        default:
          setError(isSignIn ? t('auth.errors.signInFailed') : t('auth.errors.signUpFailed'));
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
      console.log('开始Google认证...');
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log('Google认证成功:', user.uid);

      // 检查用户是否已存在
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // 新用户，创建用户文档
        const newUserDoc = createUserDoc({
          email: user.email || '',
          displayName: user.displayName || '',
          role: 'user',
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

      // 重定向到首页
      router.push(`/${i18n.language}`);
    } catch (err: any) {
      console.error('Google认证错误:', err);
      console.error('错误详情:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      setError(isSignIn ? t('auth.errors.googleSignInFailed') : t('auth.errors.googleSignUpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isSignIn ? 'signup' : 'signin');
    setError(null);
    signinForm.reset();
    signupForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isSignIn ? t('auth.signInTitle') : t('auth.signUpTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignIn ? t('auth.switchToSignUp') : t('auth.switchToSignIn')}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isSignIn ? t('auth.signUp') : t('auth.signIn')}
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
            onSubmit={(isSignIn ? signinForm.handleSubmit(handleEmailAuth) : signupForm.handleSubmit(handleEmailAuth))}
          >
            {/* Name field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.name')}
                </label>
                <input
                  {...signupForm.register('name')}
                  type="text"
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t('auth.namePlaceholder')}
                />
                {signupForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                {...(isSignIn ? signinForm.register('email') : signupForm.register('email'))}
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder={t('auth.emailPlaceholder')}
              />
              {(isSignIn ? signinForm.formState.errors.email : signupForm.formState.errors.email) && (
                <p className="mt-1 text-sm text-red-600">
                  {(isSignIn ? signinForm.formState.errors.email : signupForm.formState.errors.email)?.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                {...(isSignIn ? signinForm.register('password') : signupForm.register('password'))}
                type="password"
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder={t('auth.passwordPlaceholder')}
              />
              {(isSignIn ? signinForm.formState.errors.password : signupForm.formState.errors.password) && (
                <p className="mt-1 text-sm text-red-600">
                  {(isSignIn ? signinForm.formState.errors.password : signupForm.formState.errors.password)?.message}
                </p>
              )}
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isSignIn && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  {...signupForm.register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignIn ? t('auth.signInLoading') : t('auth.signUpLoading')}
                </div>
              ) : (
                isSignIn ? t('auth.signInButton') : t('auth.signUpButton')
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
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSignIn ? t('auth.signInWithGoogle') : t('auth.signUpWithGoogle')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
