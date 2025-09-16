import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  getDoc,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import type {
  CourseDoc,
  CoachDoc,
  CategoryDoc,
  UserDoc,
  CourseListItem,
  CourseDetails,
  PaginatedResult,
  CourseSearchParams
} from '@/types/domain';
import { demoCategories, demoUsers, demoCoaches, demoCourses } from './seed-data';

// 类型安全的数据转换器 - 服务器端版本
export const convertCourseDocToListItem = async (
  courseDoc: QueryDocumentSnapshot<DocumentData, DocumentData>
): Promise<CourseListItem> => {
  const courseData = courseDoc.data() as any; // 运行时校验由 Firestore 文档结构保证
  
  // 并行获取关联数据
  const [categoryDoc, coachDoc, userDoc] = await Promise.all([
    getDoc(doc(firestore, 'categories', courseData.categoryId)),
    getDoc(doc(firestore, 'coaches', courseData.coachId)),
    getDoc(doc(firestore, 'coaches', courseData.coachId)).then(coach => 
      coach.exists() ? getDoc(doc(firestore, 'users', coach.data().userId)) : null
    )
  ]);

  const categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
  const coachData = coachDoc.exists() ? coachDoc.data() : null;
  const userData = userDoc?.exists() ? userDoc.data() : null;

  return {
    id: courseDoc.id,
    title: courseData.title,
    description: courseData.description,
    coverImage: courseData.images?.[0], // 使用第一张图片作为封面
    category: {
      id: categoryData?.id || courseData.categoryId,
      name: categoryData?.name || '未知分类',
      color: categoryData?.color
    },
    coach: {
      id: coachData?.id || courseData.coachId,
      name: userData?.displayName || '未知教练',
      location: userData?.location
    },
    price: courseData.price,
    duration: courseData.duration,
    level: courseData.level,
    rating: courseData.rating,
    totalReviews: courseData.totalReviews,
    maxStudents: courseData.maxStudents,
    currentStudents: courseData.currentStudents,
    isActive: courseData.isActive,
    createdAt: courseData.createdAt
  };
};

export const convertCourseDocToDetails = async (
  courseDoc: DocumentSnapshot<DocumentData, DocumentData>
): Promise<CourseDetails | null> => {
  if (!courseDoc.exists()) {
    return null;
  }

  const courseData = courseDoc.data() as any;
  
  // 并行获取关联数据
  const [categoryDoc, coachDoc, userDoc] = await Promise.all([
    getDoc(doc(firestore, 'categories', courseData.categoryId)),
    getDoc(doc(firestore, 'coaches', courseData.coachId)),
    getDoc(doc(firestore, 'coaches', courseData.coachId)).then(coach => 
      coach.exists() ? getDoc(doc(firestore, 'users', coach.data().userId)) : null
    )
  ]);

  const categoryData = categoryDoc.exists() ? categoryDoc.data() : null;
  const coachData = coachDoc.exists() ? coachDoc.data() : null;
  const userData = userDoc?.exists() ? userDoc.data() : null;

  return {
    id: courseDoc.id,
    title: courseData.title,
    description: courseData.description,
    coverImage: courseData.images?.[0],
    images: courseData.images || [],
    tags: courseData.tags || [],
    category: {
      id: categoryData?.id || courseData.categoryId,
      name: categoryData?.name || '未知分类',
      description: categoryData?.description || '',
      color: categoryData?.color,
      icon: categoryData?.icon
    },
    coach: {
      id: coachData?.id || courseData.coachId,
      name: userData?.displayName || '未知教练',
      bio: userData?.bio,
      location: userData?.location,
      specialties: coachData?.specialties || [],
      experience: coachData?.experience || 0,
      rating: coachData?.rating || 0,
      totalReviews: coachData?.totalReviews || 0
    },
    price: courseData.price,
    duration: courseData.duration,
    level: courseData.level,
    rating: courseData.rating,
    totalReviews: courseData.totalReviews,
    maxStudents: courseData.maxStudents,
    currentStudents: courseData.currentStudents,
    isActive: courseData.isActive,
    createdAt: courseData.createdAt
  };
};

// 获取课程列表（带分页和排序）- 服务器端版本
export const getCoursesListServer = async (
  params: CourseSearchParams = {}
): Promise<PaginatedResult<CourseListItem>> => {
  try {
    const {
      limit: limitCount = 12,
      startAfter: startAfterId,
      sortBy = 'newest',
      sortOrder = 'desc',
      categoryId,
      coachId,
      level,
      minPrice,
      maxPrice,
      search
    } = params;

    // 构建查询条件
    let q = query(
      collection(firestore, 'courses'),
      where('isActive', '==', true),
      where('isPublished', '==', true)
    );

    // 添加过滤条件
    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }
    if (coachId) {
      q = query(q, where('coachId', '==', coachId));
    }
    if (level) {
      q = query(q, where('level', '==', level));
    }
    if (minPrice !== undefined) {
      q = query(q, where('price', '>=', minPrice));
    }
    if (maxPrice !== undefined) {
      q = query(q, where('price', '<=', maxPrice));
    }

    // 添加排序
    switch (sortBy) {
      case 'newest':
        q = query(q, orderBy('createdAt', sortOrder));
        break;
      case 'rating':
        q = query(q, orderBy('rating', sortOrder), orderBy('totalReviews', 'desc'));
        break;
      case 'price':
        q = query(q, orderBy('price', sortOrder));
        break;
    }

    // 添加分页
    q = query(q, limit(limitCount + 1)); // 多取一个来判断是否还有更多数据

    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(firestore, 'courses', startAfterId));
      if (startAfterDoc.exists()) {
        q = query(q, startAfter(startAfterDoc));
      }
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > limitCount;
    
    // 如果有多余的文档，移除最后一个
    const courseDocs = hasMore ? docs.slice(0, -1) : docs;
    
    // 转换数据
    const courses = await Promise.all(
      courseDocs.map(doc => convertCourseDocToListItem(doc))
    );

    // 如果有搜索条件，进行客户端过滤
    let filteredCourses = courses;
    if (search && search.trim()) {
      filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.coach.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      data: filteredCourses,
      hasMore,
      lastDocId: hasMore ? courseDocs[courseDocs.length - 1]?.id : undefined
    };
  } catch (error) {
    console.error('获取课程列表失败，使用演示数据:', error);
    
    // 如果Firestore查询失败，返回演示数据
    return getDemoCoursesList(params);
  }
};

// 获取课程详情 - 服务器端版本
export const getCourseDetailsServer = async (courseId: string): Promise<CourseDetails | null> => {
  try {
    const courseDoc = await getDoc(doc(firestore, 'courses', courseId));
    return await convertCourseDocToDetails(courseDoc);
  } catch (error) {
    console.error('获取课程详情失败，使用演示数据:', error);
    
    // 如果Firestore查询失败，返回演示数据
    const demoCourse = demoCourses.find(course => course.id === courseId);
    if (!demoCourse) return null;

    const category = demoCategories.find(cat => cat.id === demoCourse.categoryId);
    const coach = demoCoaches.find(coach => coach.id === demoCourse.coachId);
    const user = demoUsers.find(user => user.id === coach?.userId);

    const normalizeLevel = (lvl: string): 'beginner' | 'intermediate' | 'advanced' => {
      switch ((lvl || '').toLowerCase()) {
        case 'beginner':
          return 'beginner'
        case 'intermediate':
          return 'intermediate'
        case 'advanced':
          return 'advanced'
        default:
          return 'beginner'
      }
    }

    return {
      id: demoCourse.id,
      title: demoCourse.title,
      description: demoCourse.description,
      coverImage: demoCourse.images[0],
      images: demoCourse.images,
      tags: demoCourse.tags,
      category: {
        id: category?.id || demoCourse.categoryId,
        name: category?.name || '未知分类',
        description: category?.description || '',
        color: category?.color,
        icon: category?.icon
      },
      coach: {
        id: coach?.id || demoCourse.coachId,
        name: user?.displayName || '未知教练',
        bio: user?.bio,
        location: user?.location,
        specialties: coach?.specialties || [],
        experience: coach?.experience || 0,
        rating: coach?.rating || 0,
        totalReviews: coach?.totalReviews || 0
      },
      price: demoCourse.price,
      duration: demoCourse.duration,
      level: normalizeLevel(demoCourse.level as any),
      rating: demoCourse.rating,
      totalReviews: demoCourse.totalReviews,
      maxStudents: demoCourse.maxStudents,
      currentStudents: demoCourse.currentStudents,
      isActive: demoCourse.isActive,
      createdAt: demoCourse.createdAt
    };
  }
};

// 获取所有分类（用于筛选）- 服务器端版本
export const getCategoriesServer = async () => {
  try {
    const snapshot = await getDocs(
      query(
        collection(firestore, 'categories'),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      )
    );
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '未知分类',
        color: data.color
      };
    });
  } catch (error) {
    console.error('获取分类失败，使用演示数据:', error);
    
    // 如果Firestore查询失败，返回演示数据
    return demoCategories.map(category => ({
      id: category.id,
      name: category.name,
      color: category.color
    }));
  }
};

// 获取教练信息 - 服务器端版本
export const getCoachDetailsServer = async (coachId: string) => {
  try {
    const [coachDoc, userDoc] = await Promise.all([
      getDoc(doc(firestore, 'coaches', coachId)),
      getDoc(doc(firestore, 'coaches', coachId)).then(coach => 
        coach.exists() ? getDoc(doc(firestore, 'users', coach.data().userId)) : null
      )
    ]);

    if (!coachDoc.exists()) {
      return null;
    }

    const coachData = coachDoc.data();
    const userData = userDoc?.exists() ? userDoc.data() : null;

    return {
      id: coachDoc.id,
      userId: coachData.userId,
      specialties: coachData.specialties || [],
      experience: coachData.experience || 0,
      education: coachData.education || [],
      certifications: coachData.certifications || [],
      hourlyRate: coachData.hourlyRate || 0,
      availability: coachData.availability || {},
      rating: coachData.rating || 0,
      totalReviews: coachData.totalReviews || 0,
      isActive: coachData.isActive,
      createdAt: coachData.createdAt,
      updatedAt: coachData.updatedAt,
      // 用户信息
      displayName: userData?.displayName || '未知教练',
      bio: userData?.bio,
      location: userData?.location,
      photoURL: userData?.photoURL
    };
  } catch (error) {
    console.error('获取教练详情失败:', error);
    throw new Error('获取教练详情失败');
  }
};

// 获取演示课程列表
const getDemoCoursesList = (params: CourseSearchParams = {}): PaginatedResult<CourseListItem> => {
  const {
    limit: limitCount = 12,
    categoryId,
    coachId,
    level,
    minPrice,
    maxPrice,
    search,
    sortBy = 'newest',
    sortOrder = 'desc'
  } = params;

  const filteredCourses = demoCourses.filter(course => {
    if (categoryId && course.categoryId !== categoryId) return false;
    if (coachId && course.coachId !== coachId) return false;
    if (level && course.level !== level) return false;
    if (minPrice !== undefined && course.price < minPrice) return false;
    if (maxPrice !== undefined && course.price > maxPrice) return false;
    if (search && !course.title.toLowerCase().includes(search.toLowerCase()) && 
        !course.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // 排序
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return sortOrder === 'desc' ? 
          b.createdAt.toMillis() - a.createdAt.toMillis() : 
          a.createdAt.toMillis() - b.createdAt.toMillis();
      case 'rating':
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      case 'price':
        return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      default:
        return 0;
    }
  });

  // 分页
  const paginatedCourses = sortedCourses.slice(0, limitCount);
  const hasMore = sortedCourses.length > limitCount;

  const normalizeLevel = (lvl: string): 'beginner' | 'intermediate' | 'advanced' => {
    switch ((lvl || '').toLowerCase()) {
      case 'beginner':
        return 'beginner'
      case 'intermediate':
        return 'intermediate'
      case 'advanced':
        return 'advanced'
      default:
        return 'beginner'
    }
  }

  // 转换为CourseListItem格式
  const courses: CourseListItem[] = paginatedCourses.map(course => {
    const category = demoCategories.find(cat => cat.id === course.categoryId);
    const coach = demoCoaches.find(coach => coach.id === course.coachId);
    const user = demoUsers.find(user => user.id === coach?.userId);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      coverImage: course.images[0],
      category: {
        id: category?.id || course.categoryId,
        name: category?.name || '未知分类',
        color: category?.color
      },
      coach: {
        id: coach?.id || course.coachId,
        name: user?.displayName || '未知教练',
        location: user?.location
      },
      price: course.price,
      duration: course.duration,
      level: normalizeLevel(course.level as any),
      rating: course.rating,
      totalReviews: course.totalReviews,
      maxStudents: course.maxStudents,
      currentStudents: course.currentStudents,
      isActive: course.isActive,
      createdAt: course.createdAt
    };
  });

  return {
    data: courses,
    hasMore,
    lastDocId: hasMore ? courses[courses.length - 1]?.id : undefined
  };
};
