'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
  locale?: string
}

export default function I18nProvider({ children, locale }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initI18n = async () => {
      if (locale && i18n.language !== locale) {
        await i18n.changeLanguage(locale)
      }
      setIsReady(true)
    }
    
    initI18n()
  }, [locale])

  if (!isReady) {
    return <div>Loading...</div>
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
