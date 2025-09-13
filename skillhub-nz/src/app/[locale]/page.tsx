import { demoCourses, demoCoaches, demoCategories, demoUsers } from '@/lib/seed-data';
import { HomeCourseList } from '@/components/courses/HomeCourseList';
import Link from "next/link";

export default async function Home() {
  // 直接使用演示数据，确保首页始终有内容展示
  const coursesWithDetails = demoCourses.map(course => {
    const coach = demoCoaches.find(c => c.id === course.coachId);
    const user = demoUsers.find(u => u.id === coach?.userId);
    const category = demoCategories.find(c => c.id === course.categoryId);
    
    return {
      ...course,
      coach: coach && user ? {
        id: coach.id,
        name: user.displayName,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        rating: coach.rating,
        totalReviews: coach.totalReviews,
      } : null,
      category: category ? {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
      } : null,
    };
  });

  // 模拟API返回格式
  const coursesResult = {
    courses: coursesWithDetails.slice(0, 6), // 只显示前6门课程
    hasMore: coursesWithDetails.length > 6,
    total: coursesWithDetails.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              专业运动技能学习平台
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              马术与高尔夫专业课程，名师指导，技能提升
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                浏览所有课程
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                立即注册
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 最新课程 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">最新课程</h2>
          <p className="text-lg text-gray-600">精选优质课程，立即开始学习</p>
        </div>
        
        <HomeCourseList courses={coursesResult.courses} />

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            查看更多课程
          </Link>
        </div>
      </div>

      {/* 特色介绍 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">专业教练</h3>
              <p className="text-gray-600">经验丰富的认证教练，个性化指导</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">系统教学</h3>
              <p className="text-gray-600">从基础到进阶，循序渐进的学习体系</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
              <p className="text-gray-600">专业设备，安全环境，放心学习</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
