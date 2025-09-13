'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building2, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalCourses: number;
  totalCoaches: number;
  totalStudents: number;
  totalReviews: number;
  pendingReviews: number;
  monthlyRevenue: number;
}

interface RecentCourse {
  id: string;
  title: string;
  coverImage?: string;
  students: number;
  rating: number;
  status: 'published' | 'draft';
  createdAt: string;
}

interface RecentReview {
  id: string;
  courseTitle: string;
  studentName: string;
  rating: number;
  content: string;
  hasReply: boolean;
  createdAt: string;
}

export default function InstitutionDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalCoaches: 0,
    totalStudents: 0,
    totalReviews: 0,
    pendingReviews: 0,
    monthlyRevenue: 0,
  });
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    // 暂时注释掉角色检查，允许所有登录用户访问
    // if (user && user.role !== 'institution') {
    //   router.push('/');
    //   return;
    // }

    // 模拟数据加载
    loadDashboardData();
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    // 这里应该从API获取真实数据
    // 现在使用模拟数据
    setStats({
      totalCourses: 12,
      totalCoaches: 8,
      totalStudents: 156,
      totalReviews: 89,
      pendingReviews: 5,
      monthlyRevenue: 12500,
    });

    setRecentCourses([
      {
        id: '1',
        title: 'React 高级开发课程',
        students: 45,
        rating: 4.8,
        status: 'published',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Node.js 后端开发',
        students: 32,
        rating: 4.6,
        status: 'published',
        createdAt: '2024-01-12',
      },
      {
        id: '3',
        title: 'Vue.js 实战项目',
        students: 0,
        rating: 0,
        status: 'draft',
        createdAt: '2024-01-10',
      },
    ]);

    setRecentReviews([
      {
        id: '1',
        courseTitle: 'React 高级开发课程',
        studentName: '张三',
        rating: 5,
        content: '课程内容非常实用，老师讲解很详细！',
        hasReply: false,
        createdAt: '2024-01-16',
      },
      {
        id: '2',
        courseTitle: 'Node.js 后端开发',
        studentName: '李四',
        rating: 4,
        content: '学到了很多后端开发的知识，推荐！',
        hasReply: true,
        createdAt: '2024-01-15',
      },
    ]);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!user) {
    return null;
  }

  // 暂时注释掉角色检查
  // if (user.role !== 'institution') {
  //   return null;
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                欢迎回来，{user.displayName}
              </h1>
              <p className="text-gray-600">教育机构管理面板</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/institution/courses/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              发布课程
            </Link>
            <Link
              href="/institution/coaches/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加教练
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总课程数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">教练数量</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCoaches}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">学员总数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待回复评论</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近课程</h3>
            <Link
              href="/institution/courses"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看全部
            </Link>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{course.students} 学员</span>
                    {course.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{course.rating}</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      course.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近评论</h3>
            <Link
              href="/institution/reviews"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看全部
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{review.courseTitle}</h4>
                    <p className="text-sm text-gray-600">by {review.studentName}</p>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{review.createdAt}</span>
                  {!review.hasReply && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      回复
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/institution/courses/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">发布新课程</h4>
              <p className="text-sm text-gray-600">创建并发布新的课程</p>
            </div>
          </Link>

          <Link
            href="/institution/coaches/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">添加教练</h4>
              <p className="text-sm text-gray-600">邀请新的教练加入</p>
            </div>
          </Link>

          <Link
            href="/institution/reviews"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">管理评论</h4>
              <p className="text-sm text-gray-600">查看和回复学员评论</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
