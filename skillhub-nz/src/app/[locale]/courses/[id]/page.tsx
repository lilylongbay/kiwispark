import { notFound } from 'next/navigation';
import { getCourseDetails } from '@/lib/courses';
import { CourseDetailsView } from '@/components/courses/CourseDetailsView';
import { CourseDetailsSkeleton } from '@/components/courses/CourseDetailsSkeleton';
import { Suspense } from 'react';

interface CourseDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  try {
    const course = await getCourseDetails(id);

    if (!course) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<CourseDetailsSkeleton />}>
            <CourseDetailsView course={course} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('获取课程详情失败:', error);
    notFound();
  }
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata({ params }: CourseDetailsPageProps) {
  try {
    const course = await getCourseDetails(params.id);
    
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


