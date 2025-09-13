'use client';

// import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface ServerPaginationProps {
  hasMore: boolean;
  lastDocId?: string;
  currentParams: Record<string, string | undefined>;
}

export function ServerPagination({ hasMore, lastDocId }: ServerPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    if (!lastDocId) return;
    
    // 构建新的URL参数
    const params = new URLSearchParams(searchParams.toString());
    params.set('startAfter', lastDocId);
    
    // 导航到下一页
    router.push(`/courses?${params.toString()}`);
  };

  if (!hasMore) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <button
        onClick={handleLoadMore}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        加载更多课程
        <ChevronRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
}
