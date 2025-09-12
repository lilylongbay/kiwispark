import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { i18n } from '../../../next-i18next.config'
import Header from '@/components/Header'
import { getServerUser } from '@/lib/auth-server'
import I18nProvider from '@/components/I18nProvider'

export const metadata: Metadata = {
  title: 'SkillHub NZ',
  description: 'New Zealand Skills Learning Platform',
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!i18n.locales.includes(locale as any)) notFound()

  const user = await getServerUser();

  return (
    <I18nProvider locale={locale}>
      <Header user={user} />
      <main>{children}</main>
    </I18nProvider>
  )
}
