'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
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
          筛选器
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
            清除全部
          </button>
        )}
      </div>

      {/* 筛选器内容 */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* 搜索 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜索课程
          </label>
          <input
            type="text"
            placeholder="输入课程名称或教练..."
            value={currentParams.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

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

        {/* 难度等级 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            难度等级
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value=""
                checked={!currentParams.level}
                onChange={(e) => updateFilter('level', e.target.value || null)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">全部等级</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value="beginner"
                checked={currentParams.level === 'beginner'}
                onChange={(e) => updateFilter('level', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">初级</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value="intermediate"
                checked={currentParams.level === 'intermediate'}
                onChange={(e) => updateFilter('level', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">中级</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="level"
                value="advanced"
                checked={currentParams.level === 'advanced'}
                onChange={(e) => updateFilter('level', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">高级</span>
            </label>
          </div>
        </div>

        {/* 价格范围 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            价格范围 (NZD)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="最低价格"
              value={currentParams.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="最高价格"
              value={currentParams.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* 清除筛选器 */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-4 h-4 mr-2" />
            清除所有筛选器
          </button>
        )}
      </div>
    </div>
  );
}


