'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  user?: {
    uid: string;
    displayName: string;
    role: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation(['nav', 'common']);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      
      // 清除session cookie
      await fetch('/api/session', {
        method: 'DELETE',
      });
      
      router.push('/');
    } catch (error) {
      console.error('登出错误:', error);
    }
  };


  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              {t('common:appName')}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('nav:courses')}
            </Link>
            <Link
              href="/coaches"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('nav:coaches')}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('nav:about')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={i18n.language} />

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  <span>{user.displayName}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      仪表板
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      个人资料
                    </Link>
                    {user.role === 'coach' && (
                      <Link
                        href="/dashboard/coach"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        教练面板
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  {t('nav:signin')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav:signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

