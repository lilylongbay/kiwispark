import { Timestamp } from 'firebase/firestore';

// 基础时间戳类型
export type FirestoreTimestamp = Timestamp;

// 用户文档类型
export interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'coach' | 'admin';
  bio?: string;
  location?: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 教练文档类型
export interface CoachDoc {
  id: string;
  userId: string; // 关联到UserDoc
  specialties: string[];
  experience: number; // 年数
  education: string[];
  certifications: string[];
  hourlyRate: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 课程文档类型
export interface CourseDoc {
  id: string;
  title: string;
  description: string;
  coachId: string; // 关联到CoachDoc
  categoryId: string; // 关联到CategoryDoc
  price: number;
  duration: number; // 分钟
  maxStudents: number;
  currentStudents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  images: string[]; // 图片URL数组
  isActive: boolean;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 评价文档类型
export interface ReviewDoc {
  id: string;
  courseId: string; // 关联到CourseDoc
  userId: string; // 关联到UserDoc
  rating: number; // 1-5
  title: string;
  content: string;
  isVerified: boolean; // 是否已验证购买
  helpfulCount: number;
  images?: string[]; // 评价图片
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 回复文档类型
export interface ReplyDoc {
  id: string;
  reviewId: string; // 关联到ReviewDoc
  userId: string; // 关联到UserDoc (教练或管理员)
  content: string;
  isFromCoach: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 分类文档类型
export interface CategoryDoc {
  id: string;
  name: string;
  description: string;
  icon?: string; // 图标URL或名称
  color?: string; // 主题色
  parentId?: string; // 父分类ID，用于层级结构
  isActive: boolean;
  sortOrder: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// 图片文档类型
export interface ImageDoc {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string; // 用户ID
  entityType: 'course' | 'profile' | 'review' | 'category';
  entityId: string; // 关联的实体ID
  isPublic: boolean;
  createdAt: FirestoreTimestamp;
}

// 课程列表项类型（用于列表页面）
export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string; // 封面图片URL
  category: {
    id: string;
    name: string;
    color?: string;
  };
  coach: {
    id: string;
    name: string;
    location?: string;
  };
  price: number;
  duration: number; // 分钟
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  totalReviews: number;
  maxStudents: number;
  currentStudents: number;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
}

// 课程详情类型（用于详情页面）
export interface CourseDetails extends CourseListItem {
  tags: string[];
  images: string[]; // 所有图片URL
  coach: {
    id: string;
    name: string;
    bio?: string;
    location?: string;
    specialties: string[];
    experience: number;
    rating: number;
    totalReviews: number;
  };
  category: {
    id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
  };
}

// 分页参数类型
export interface PaginationParams {
  limit?: number;
  startAfter?: string; // 文档ID，用于游标分页
  sortBy?: 'newest' | 'rating' | 'price';
  sortOrder?: 'asc' | 'desc';
}

// 分页结果类型
export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDocId?: string;
  total?: number;
}

// 课程搜索参数类型
export interface CourseSearchParams extends PaginationParams {
  categoryId?: string;
  coachId?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  minPrice?: number;
  maxPrice?: number;
  search?: string; // 搜索关键词
}
