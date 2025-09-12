'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const router = useRouter()
  const [isChanging, setIsChanging] = useState(false)

  const languages = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLocale || isChanging) return

    setIsChanging(true)
    
    try {
      // Update i18n instance
      await i18n.changeLanguage(locale)
      
      // Set cookie for persistence
      Cookies.set('NEXT_LOCALE', locale, { 
        expires: 365, 
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
      
      // Reload the page to apply the new locale
      router.refresh()
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          disabled={isChanging}
          className={`
            px-3 py-1 text-sm font-medium rounded-md transition-colors
            ${currentLocale === lang.code
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
            }
            ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={`Switch to ${lang.name}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  )
}
