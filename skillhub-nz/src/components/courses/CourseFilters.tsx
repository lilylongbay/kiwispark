'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { X, Filter } from 'lucide-react';

interface CourseFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  currentParams: Record<string, string | undefined>;
}

export function CourseFilters({ categories, currentParams }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('pages');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // 重置页码
    params.delete('page');
    
    router.push(`/courses?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/courses');
  };

  const hasActiveFilters = Object.values(currentParams).some(value => value !== undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 移动端筛选器头部 */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-sm font-medium text-gray-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('courses.filters.title')}
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.values(currentParams).filter(Boolean).length}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {t('courses.filters.clearAll')}
          </button>
        )}
      </div>

      {/* 筛选器内容 */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* 分类筛选 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            课程分类
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!currentParams.category}
                onChange={(e) => updateFilter('category', e.target.value || null)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">全部分类</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={currentParams.category === category.id}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </label>
            ))}
          </div>
        </div>


        {/* 清除筛选器 */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-4 h-4 mr-2" />
            {t('courses.filters.clearAllFilters')}
          </button>
        )}
      </div>
    </div>
  );
}


