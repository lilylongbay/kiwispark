'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CourseSortSelectProps {
  currentSort?: string;
}

export function CourseSortSelect({ currentSort }: CourseSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortBy);
    router.push(`/courses?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'newest', label: '最新发布' },
    { value: 'rating', label: '评分最高' },
    { value: 'price', label: '价格排序' },
  ];

  return (
    <select
      value={currentSort || 'newest'}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}


