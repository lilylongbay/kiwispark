import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, MapPin } from 'lucide-react';

// 课程数据类型（支持演示数据和Firebase数据）
interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxStudents: number;
  currentStudents: number;
  level: string;
  rating: number;
  totalReviews: number;
  images?: string[];
  coach: {
    id: string;
    name: string;
    location: string;
    avatar?: string;
  } | null;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | any;
}

interface ServerCourseCardProps {
  course: CourseData;
  isFirst?: boolean;
}

export function ServerCourseCard({ course, isFirst = false }: ServerCourseCardProps) {
  const formatPrice = (price: number) => {
    return `¥${price}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    }
    return `${mins}分钟`;
  };

  const formatDate = (timestamp: any) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('zh-CN');
    }
    return '最近发布';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/courses/${course.id}`}>
        {/* 课程封面 */}
        <div className="relative h-48 bg-gray-200">
          {course.images && course.images.length > 0 ? (
            <Image
              src={course.images[0]}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isFirst}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-4xl">
                {course.category?.name === '马术' ? '🐎' : '⛳'}
              </span>
            </div>
          )}
          
          {/* 分类标签 */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
              {course.category?.name ?? '未分类'}
            </span>
          </div>
        </div>

        {/* 课程信息 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>

          {/* 教练信息 */}
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {(course.coach?.name?.charAt(0) ?? '?').toUpperCase()}
            </div>
            <span className="text-sm text-gray-700">{course.coach?.name ?? '未知教练'}</span>
            {course.coach?.location && (
              <div className="flex items-center ml-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {course.coach.location}
              </div>
            )}
          </div>

          {/* 课程统计 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{course.rating.toFixed(1)}</span>
              <span className="ml-1">({course.totalReviews})</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(course.duration)}
            </div>
          </div>

          {/* 学员信息 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course.currentStudents}/{course.maxStudents} 人
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(course.createdAt)}
            </span>
          </div>

          {/* 价格 */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(course.price)}
            </div>
            <span className="text-sm text-gray-500">
              {course.level === 'beginner' ? '初级' : 
               course.level === 'intermediate' ? '中级' : '高级'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
