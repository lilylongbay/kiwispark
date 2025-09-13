import { notFound } from 'next/navigation';
import { getCourseDetailsServer } from '@/lib/courses-server';
import { CourseDetailsView } from '@/components/courses/CourseDetailsView';
import { CourseDetailsSkeleton } from '@/components/courses/CourseDetailsSkeleton';
import { CourseErrorBoundary } from '@/components/courses/CourseErrorBoundary';
import { Suspense } from 'react';

interface CourseDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { locale: 'zh', id: 'demo-course-1' },
    { locale: 'en', id: 'demo-course-1' },
    { locale: 'zh', id: 'demo-course-2' },
    { locale: 'en', id: 'demo-course-2' },
  ];
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    const course = await getCourseDetailsServer(id);

    if (!course) {
      notFound();
    }

    return (
      <CourseErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<CourseDetailsSkeleton />}>
              <CourseDetailsView course={course} />
            </Suspense>
          </div>
        </div>
      </CourseErrorBoundary>
    );
  } catch (error) {
    console.error('获取课程详情失败:', error);
    notFound();
  }
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata({ params }: CourseDetailsPageProps) {
  try {
    const { id } = await params;
    const course = await getCourseDetailsServer(id);
    
    if (!course) {
      return {
        title: '课程未找到 - SkillHub NZ',
        description: '抱歉，您要查找的课程不存在。',
      };
    }

    return {
      title: `${course.title} - SkillHub NZ`,
      description: course.description,
      openGraph: {
        title: course.title,
        description: course.description,
        images: course.coverImage ? [course.coverImage] : [],
      },
    };
  } catch (error) {
    return {
      title: '课程详情 - SkillHub NZ',
      description: '查看课程详细信息',
    };
  }
}


