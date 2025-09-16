import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CourseListItem } from '@/types/domain';

// 序列化后的课程数据类型
interface SerializedCourseListItem extends Omit<CourseListItem, 'createdAt'> {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface CourseCardProps {
  course: SerializedCourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation('pages');
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}${t('courses.card.hours')}${mins}${t('courses.card.minutes')}` : `${hours}${t('courses.card.hour')}`;
    }
    return `${mins}${t('courses.card.minute')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return t('courses.card.beginner');
      case 'intermediate':
        return t('courses.card.intermediate');
      case 'advanced':
        return t('courses.card.advanced');
      default:
        return level;
    }
  };

  return (
    <Link href={`/courses/${course.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* 课程封面 */}
        <div className="relative h-48 bg-gray-200">
          {course.coverImage ? (
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              priority={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          
          {/* 分类标签 */}
          <div className="absolute top-3 left-3">
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course.category.color 
                  ? `bg-${course.category.color}-100 text-${course.category.color}-800`
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {course.category.name}
            </span>
          </div>

          {/* 难度等级 */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {getLevelText(course.level)}
            </span>
          </div>
        </div>

        {/* 课程信息 */}
        <div className="p-4">
          {/* 标题和描述 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>

          {/* 教练信息 */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="font-medium">{course.coach.name}</span>
            {course.coach.location && (
              <>
                <span className="mx-1">•</span>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {course.coach.location}
                </div>
              </>
            )}
          </div>

          {/* 课程详情 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(course.duration)}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.currentStudents}/{course.maxStudents}
              </div>
            </div>
          </div>

          {/* 评分和价格 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {course.rating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({course.totalReviews})
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(course.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


