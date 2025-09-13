'use client';

import { useTranslation } from 'react-i18next';
import { CoachCard } from './CoachCard';
import type { CoachListItem } from '@/types/domain';

interface CoachListServerProps {
  coaches: CoachListItem[];
  hasMore: boolean;
  lastDocId?: string;
  currentParams: Record<string, string | undefined>;
}

export function CoachListServer({ 
  coaches, 
  hasMore, 
  lastDocId, 
  currentParams 
}: CoachListServerProps) {
  const { t } = useTranslation('common');

  if (coaches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('coaches.noCoaches')}
        </h3>
        <p className="text-gray-600">
          {t('coaches.noCoachesDescription')}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 结果统计 */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {t('coaches.foundCoaches', { count: coaches.length })}
          {currentParams.search && (
            <span>，搜索关键词：<span className="font-medium text-gray-900">"{currentParams.search}"</span></span>
          )}
        </p>
      </div>

      {/* 教练网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {coaches.map((coach) => (
          <CoachCard 
            key={coach.id} 
            coach={coach}
            isLoggedIn={false} // 这里应该从认证状态获取
          />
        ))}
      </div>

      {/* 加载更多提示 */}
      {hasMore && (
        <div className="flex justify-center">
          <div className="text-center py-4">
            <p className="text-gray-600 text-sm">
              {t('coaches.loadMoreHint')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
