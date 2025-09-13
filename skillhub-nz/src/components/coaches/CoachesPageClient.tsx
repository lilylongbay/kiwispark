'use client';

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { CoachListServer } from './CoachListServer';
import { CoachFilters } from './CoachFilters';
import { CoachListSkeleton } from './CoachListSkeleton';
import { CoachErrorBoundary } from './CoachErrorBoundary';
import type { CoachListItem, CoachSearchParams } from '@/types/domain';

interface CoachesPageClientProps {
  coaches: CoachListItem[];
  hasMore: boolean;
  lastDocId?: string;
  specialties: string[];
  currentParams: Record<string, string | undefined>;
}

export function CoachesPageClient({ 
  coaches, 
  hasMore, 
  lastDocId, 
  specialties, 
  currentParams 
}: CoachesPageClientProps) {
  const { t } = useTranslation('common');

  return (
    <CoachErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('coaches.pageTitle')}</h1>
            <p className="mt-2 text-gray-600">
              {t('coaches.pageDescription')}
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* 侧边栏筛选器 */}
            <div className="xl:w-64 flex-shrink-0">
              <CoachFilters 
                specialties={specialties}
                currentParams={currentParams}
              />
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1">
              <Suspense fallback={<CoachListSkeleton />}>
                <CoachListServer 
                  coaches={coaches}
                  hasMore={hasMore}
                  lastDocId={lastDocId}
                  currentParams={currentParams}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </CoachErrorBoundary>
  );
}
