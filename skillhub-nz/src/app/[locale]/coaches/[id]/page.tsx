import { notFound } from 'next/navigation';
import { getCoachDetailsServer } from '@/lib/coaches-server';
import { CoachDetailsView } from '@/components/coaches/CoachDetailsView';
import { CoachDetailsSkeleton } from '@/components/coaches/CoachDetailsSkeleton';
import { CoachErrorBoundary } from '@/components/coaches/CoachErrorBoundary';
import { Suspense } from 'react';

interface CoachDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoachDetailsPage({ params }: CoachDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    const coach = await getCoachDetailsServer(id);

    if (!coach) {
      notFound();
    }

    return (
      <CoachErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<CoachDetailsSkeleton />}>
              <CoachDetailsView coach={coach} />
            </Suspense>
          </div>
        </div>
      </CoachErrorBoundary>
    );
  } catch (error) {
    console.error('获取教练详情失败:', error);
    notFound();
  }
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata({ params }: CoachDetailsPageProps) {
  try {
    const { id } = await params;
    const coach = await getCoachDetailsServer(id);
    
    if (!coach) {
      return {
        title: 'Coach Not Found - SkillHub NZ',
        description: 'Sorry, the coach you are looking for does not exist.',
      };
    }

    return {
      title: `${coach.name} - Professional Coach - SkillHub NZ`,
      description: coach.bio || `Professional ${coach.specialties.join(', ')} coach with ${coach.experience} years of experience, rated ${coach.rating} stars.`,
      openGraph: {
        title: `${coach.name} - Professional Coach`,
        description: coach.bio || `Professional ${coach.specialties.join(', ')} coach with ${coach.experience} years of experience.`,
        images: coach.avatar ? [coach.avatar] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Coach Details - SkillHub NZ',
      description: 'View coach detailed information',
    };
  }
}

