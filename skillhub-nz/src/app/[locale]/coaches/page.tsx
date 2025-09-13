import { getCoachesListServer, getSpecialtiesServer } from '@/lib/coaches-server';
import { CoachesPageClient } from '@/components/coaches/CoachesPageClient';
import { CoachesErrorPage } from '@/components/coaches/CoachesErrorPage';
import type { CoachSearchParams } from '@/types/domain';

interface CoachesPageProps {
  searchParams: Promise<{
    specialty?: string;
    location?: string;
    sort?: string;
    page?: string;
    search?: string;
    minRating?: string;
    maxHourlyRate?: string;
  }>;
}

export default async function CoachesPage({ searchParams }: CoachesPageProps) {
  // 等待搜索参数
  const resolvedSearchParams = await searchParams;
  
  // 解析搜索参数
  const params: CoachSearchParams = {
    specialty: resolvedSearchParams.specialty,
    location: resolvedSearchParams.location,
    sortBy: (resolvedSearchParams.sort as 'newest' | 'rating' | 'hourlyRate') || 'rating',
    sortOrder: 'desc',
    minRating: resolvedSearchParams.minRating ? Number(resolvedSearchParams.minRating) : undefined,
    maxHourlyRate: resolvedSearchParams.maxHourlyRate ? Number(resolvedSearchParams.maxHourlyRate) : undefined,
    search: resolvedSearchParams.search,
    limit: 12
  };

  try {
    // 并行获取数据
    const [coachesResult, specialties] = await Promise.all([
      getCoachesListServer(params),
      getSpecialtiesServer()
    ]);

    return (
      <CoachesPageClient
        coaches={coachesResult.data}
        hasMore={coachesResult.hasMore}
        lastDocId={coachesResult.lastDocId}
        specialties={specialties}
        currentParams={resolvedSearchParams}
      />
    );
  } catch (error) {
    console.error('获取教练数据失败:', error);
    
    // 返回错误页面 - 使用客户端组件处理国际化
    return <CoachesErrorPage />;
  }
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // 根据语言返回不同的元数据
  if (locale === 'en') {
    return {
      title: 'Coach List - SkillHub NZ',
      description: 'Browse our professional skill coaches, find the right mentor for you, and start your skill development journey.',
    };
  }
  
  return {
    title: '教练列表 - SkillHub NZ',
    description: '浏览我们专业的技能教练，找到适合您的导师，开启技能提升之旅。',
  };
}
