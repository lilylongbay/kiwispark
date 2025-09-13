'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Search,
  Reply,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  Calendar
} from 'lucide-react';

interface Review {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  helpfulCount: number;
  images?: string[];
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userRole: 'institution' | 'coach';
  content: string;
  createdAt: string;
}

type FilterType = 'all' | 'pending' | 'replied';

export default function InstitutionReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, filter, searchTerm]);

  const loadReviews = async () => {
    // 模拟数据
    const mockReviews: Review[] = [
      {
        id: '1',
        courseId: '1',
        courseTitle: 'React 高级开发课程',
        studentId: '1',
        studentName: '张三',
        rating: 5,
        title: '非常棒的课程！',
        content: '课程内容非常实用，老师讲解很详细，学到了很多React的高级技巧。推荐给所有想深入学习React的开发者！',
        isVerified: true,
        helpfulCount: 12,
        createdAt: '2024-01-16',
        replies: []
      },
      {
        id: '2',
        courseId: '2',
        courseTitle: 'Node.js 后端开发',
        studentId: '2',
        studentName: '李四',
        rating: 4,
        title: '学到了很多后端知识',
        content: '课程内容很全面，从基础到高级都有涉及。不过希望能增加更多实战项目的讲解。',
        isVerified: true,
        helpfulCount: 8,
        createdAt: '2024-01-15',
        replies: [
          {
            id: '1',
            userId: user?.uid || '',
            userName: user?.displayName || '机构管理员',
            userRole: 'institution',
            content: '感谢您的反馈！我们正在准备更多实战项目的内容，敬请期待。',
            createdAt: '2024-01-15'
          }
        ]
      },
      {
        id: '3',
        courseId: '1',
        courseTitle: 'React 高级开发课程',
        studentId: '3',
        studentName: '王五',
        rating: 3,
        title: '课程还可以，但有些地方不够清晰',
        content: '整体来说课程质量不错，但在某些复杂概念的讲解上还可以更清晰一些。',
        isVerified: true,
        helpfulCount: 3,
        createdAt: '2024-01-14',
        replies: []
      }
    ];

    setReviews(mockReviews);
    setIsLoading(false);
  };

  const filterReviews = () => {
    let filtered = reviews;

    // 按状态过滤
    if (filter === 'pending') {
      filtered = filtered.filter(review => review.replies.length === 0);
    } else if (filter === 'replied') {
      filtered = filtered.filter(review => review.replies.length > 0);
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  };

  const handleReply = async (reviewId: string) => {
    if (!replyContent.trim()) return;

    setIsReplying(true);
    try {
      // 这里应该调用API提交回复
      console.log('提交回复:', { reviewId, content: replyContent });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新本地状态
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              replies: [
                ...review.replies,
                {
                  id: Date.now().toString(),
                  userId: user?.uid || '',
                  userName: user?.displayName || '机构管理员',
                  userRole: 'institution',
                  content: replyContent,
                  createdAt: new Date().toISOString().split('T')[0]
                }
              ]
            }
          : review
      ));
      
      setReplyContent('');
      setSelectedReview(null);
    } catch (error) {
      console.error('回复失败:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const getFilterCount = (filterType: FilterType) => {
    switch (filterType) {
      case 'pending':
        return reviews.filter(review => review.replies.length === 0).length;
      case 'replied':
        return reviews.filter(review => review.replies.length > 0).length;
      default:
        return reviews.length;
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">学员评论管理</h1>
            <p className="text-gray-600">查看和回复学员对课程的评论</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="搜索课程、学员或评论内容..."
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: '全部', icon: MessageSquare },
              { key: 'pending', label: '待回复', icon: Clock },
              { key: 'replied', label: '已回复', icon: CheckCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
                <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                  {getFilterCount(key as FilterType)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无评论</h3>
            <p className="text-gray-600">
              {filter === 'pending' ? '没有待回复的评论' : 
               filter === 'replied' ? '没有已回复的评论' : 
               '暂无任何评论'}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                {/* Student Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {review.studentName.charAt(0)}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{review.studentName}</h4>
                      <span className="text-sm text-gray-500">对</span>
                      <span className="text-sm font-medium text-blue-600">{review.courseTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
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
                      <span className="text-sm text-gray-500">{review.rating}</span>
                    </div>
                  </div>

                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {review.createdAt}
                      </span>
                      {review.isVerified && (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          已验证购买
                        </span>
                      )}
                    </div>
                    <span>{review.helpfulCount} 人觉得有用</span>
                  </div>

                  {/* Replies */}
                  {review.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{reply.userName}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reply.userRole === 'institution' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {reply.userRole === 'institution' ? '机构回复' : '教练回复'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{reply.createdAt}</span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {review.replies.length === 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        回复评论
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">回复评论</h3>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setReplyContent('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Original Review */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{selectedReview.studentName}</span>
                  <span className="text-sm text-gray-500">对</span>
                  <span className="text-sm font-medium text-blue-600">{selectedReview.courseTitle}</span>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">{selectedReview.title}</h5>
                <p className="text-gray-700">{selectedReview.content}</p>
              </div>

              {/* Reply Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  您的回复
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="请输入您的回复内容..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => handleReply(selectedReview.id)}
                  disabled={!replyContent.trim() || isReplying}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReplying ? '回复中...' : '发送回复'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
