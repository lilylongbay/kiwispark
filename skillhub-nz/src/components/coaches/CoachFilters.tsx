'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CoachFiltersProps {
  specialties: string[];
  currentParams: Record<string, string | undefined>;
}

export function CoachFilters({ specialties, currentParams }: CoachFiltersProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // 重置页码
    params.delete('page');
    
    router.push(`/coaches?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/coaches');
  };

  const hasActiveFilters = Object.values(currentParams).some(value => value !== undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{t('coaches.filters.title')}</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            {t('coaches.filters.clearAll')}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* 搜索 */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            {t('coaches.searchPlaceholder')}
          </label>
          <input
            type="text"
            id="search"
            placeholder={t('coaches.searchPlaceholder')}
            value={currentParams.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 专业领域 */}
        {specialties.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('coaches.filters.specialty')}
            </label>
            <select
              value={currentParams.specialty || ''}
              onChange={(e) => updateFilter('specialty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('coaches.filters.allSpecialties')}</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 位置 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            {t('coaches.filters.location')}
          </label>
          <input
            type="text"
            id="location"
            placeholder={t('coaches.filters.locationPlaceholder')}
            value={currentParams.location || ''}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 高级筛选 */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <span>{t('coaches.filters.advancedFilters')}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* 最低评分 */}
              <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coaches.filters.minRating')}
                </label>
                <select
                  id="minRating"
                  value={currentParams.minRating || ''}
                  onChange={(e) => updateFilter('minRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('coaches.filters.noLimit')}</option>
                  <option value="4.5">{t('coaches.filters.ratingAbove', { rating: '4.5' })}</option>
                  <option value="4.0">{t('coaches.filters.ratingAbove', { rating: '4.0' })}</option>
                  <option value="3.5">{t('coaches.filters.ratingAbove', { rating: '3.5' })}</option>
                  <option value="3.0">{t('coaches.filters.ratingAbove', { rating: '3.0' })}</option>
                </select>
              </div>

              {/* 最高时薪 */}
              <div>
                <label htmlFor="maxHourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coaches.filters.maxHourlyRate')}
                </label>
                <select
                  id="maxHourlyRate"
                  value={currentParams.maxHourlyRate || ''}
                  onChange={(e) => updateFilter('maxHourlyRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('coaches.filters.noLimit')}</option>
                  <option value="50">{t('coaches.filters.hourlyRateBelow', { rate: '50' })}</option>
                  <option value="100">{t('coaches.filters.hourlyRateBelow', { rate: '100' })}</option>
                  <option value="150">{t('coaches.filters.hourlyRateBelow', { rate: '150' })}</option>
                  <option value="200">{t('coaches.filters.hourlyRateBelow', { rate: '200' })}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 排序 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('coaches.filters.sortBy')}
          </label>
          <select
            value={currentParams.sort || 'rating'}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="rating">{t('coaches.filters.sortOptions.rating')}</option>
            <option value="newest">{t('coaches.filters.sortOptions.newest')}</option>
            <option value="hourlyRate">{t('coaches.filters.sortOptions.hourlyRate')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

