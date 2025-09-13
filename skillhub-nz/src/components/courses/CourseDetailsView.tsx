import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  // Award,
  BookOpen,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import type { CourseDetails } from '@/types/domain';
import ReviewSection from './ReviewSection';
import { EnrollmentButton } from './EnrollmentButton';

interface CourseDetailsViewProps {
  course: CourseDetails;
}

export function CourseDetailsView({ course }: CourseDetailsViewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    }
    return `${mins}分钟`;
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
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return level;
    }
  };

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link 
          href="/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回课程列表
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-2">
          {/* 课程封面 */}
          <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden mb-6">
            {course.coverImage ? (
              <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <BookOpen className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* 课程基本信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}
                  >
                    {getLevelText(course.level)}
                  </span>
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      course.category.color 
                        ? `bg-${course.category.color}-100 text-${course.category.color}-800`
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {course.category.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {course.description}
            </p>

            {/* 课程统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {course.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {course.totalReviews} 条评价
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {formatDuration(course.duration)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">课程时长</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {course.currentStudents}/{course.maxStudents}
                  </span>
                </div>
                <p className="text-sm text-gray-600">学员人数</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">
                    {new Date(course.createdAt.toDate()).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">发布时间</p>
              </div>
            </div>
          </div>

          {/* 课程标签 */}
          {course.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程标签</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 课程图片 */}
          {course.images.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程图片</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {course.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${course.title} - 图片 ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 评价区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ReviewSection courseId={course.id} courseCoachId={course.coach.id} />
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          {/* 报名卡片 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(course.price)}
              </div>
            </div>

            <EnrollmentButton courseId={course.id} price={course.price} />
          </div>

          {/* 教练信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">关于教练</h3>
            <div className="text-center">
              {/* 教练头像 */}
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {course.coach.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">{course.coach.name}</h4>
              
              {course.coach.location && (
                <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {course.coach.location}
                </div>
              )}
              
              {/* 教练简介 */}
              {course.coach.bio && (
                <div className="text-left mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{course.coach.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


