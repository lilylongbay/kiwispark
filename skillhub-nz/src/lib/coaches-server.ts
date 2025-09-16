import { firestore } from '@/firebase/client';
import { collection, query, where, orderBy, limit, startAfter, getDocs, doc, getDoc } from 'firebase/firestore';
import type { CoachListItem, CoachDetails, CoachSearchParams, PaginatedResult, CourseListItem } from '@/types/domain';
import { demoCoaches, demoUsers, demoCourses } from './seed-data';

// 获取教练列表（服务端）
export async function getCoachesListServer(params: CoachSearchParams = {}): Promise<PaginatedResult<CoachListItem>> {
  try {
    const {
      limit: limitCount = 12,
      startAfter: startAfterDocId,
      sortBy = 'rating',
      sortOrder = 'desc',
      specialty,
      location,
      minRating,
      maxHourlyRate,
      search
    } = params;

    const db = firestore;
    
    // 构建查询
    let q = query(
      collection(db, 'coaches'),
      where('isActive', '==', true)
    );

    // 添加筛选条件
    if (specialty) {
      q = query(q, where('specialties', 'array-contains', specialty));
    }

    if (minRating) {
      q = query(q, where('rating', '>=', minRating));
    }

    if (maxHourlyRate) {
      q = query(q, where('hourlyRate', '<=', maxHourlyRate));
    }

    // 添加排序
    const sortField = sortBy === 'newest' ? 'createdAt' : sortBy === 'rating' ? 'rating' : 'hourlyRate';
    q = query(q, orderBy(sortField, sortOrder));

    // 添加分页
    if (startAfterDocId) {
      const startAfterDoc = await getDoc(doc(db, 'coaches', startAfterDocId));
      if (startAfterDoc.exists()) {
        q = query(q, startAfter(startAfterDoc));
      }
    }

    q = query(q, limit(limitCount + 1)); // 多获取一个用于判断是否有更多数据

    const snapshot = await getDocs(q);
    const coaches: CoachListItem[] = [];

    for (const docSnapshot of snapshot.docs) {
      const coachData = docSnapshot.data();
      
      // 获取用户信息
      const userDoc = await getDoc(doc(db, 'users', coachData.userId));
      if (!userDoc.exists()) continue;

      const userData = userDoc.data();
      
      // 检查位置筛选（如果指定了位置）
      if (location && userData.location && !userData.location.toLowerCase().includes(location.toLowerCase())) {
        continue;
      }

      // 检查搜索关键词（如果指定了搜索）
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = userData.displayName?.toLowerCase().includes(searchLower);
        const matchesBio = userData.bio?.toLowerCase().includes(searchLower);
        const matchesSpecialties = coachData.specialties?.some((s: string) => 
          s.toLowerCase().includes(searchLower)
        );
        
        if (!matchesName && !matchesBio && !matchesSpecialties) {
          continue;
        }
      }

      const coach: CoachListItem = {
        id: docSnapshot.id,
        name: userData.displayName || '未知教练',
        avatar: (userData as any).photoURL,
        bio: userData.bio,
        specialties: coachData.specialties || [],
        experience: coachData.experience || 0,
        rating: coachData.rating || 0,
        totalReviews: coachData.totalReviews || 0,
        location: userData.location,
        isActive: coachData.isActive,
        contact: {
          email: userData.email,
          phone: (userData as any).phoneNumber
        }
      };

      coaches.push(coach);
    }

    // 检查是否有更多数据
    const hasMore = coaches.length > limitCount;
    if (hasMore) {
      coaches.pop(); // 移除多获取的那一个
    }

    const lastDocId = coaches.length > 0 ? coaches[coaches.length - 1].id : undefined;

    return {
      data: coaches,
      hasMore,
      lastDocId
    };
  } catch (error) {
    console.error('获取教练列表失败，使用演示数据:', error);
    
    // 重新获取参数（在 catch 块中重新定义）
    const {
      limit: limitCount = 12,
      startAfter: startAfterDocId,
      sortBy = 'rating',
      sortOrder = 'desc',
      specialty,
      location,
      minRating,
      maxHourlyRate,
      search
    } = params;
    
    // 使用演示数据作为后备
    let coaches = demoCoaches.map(coach => {
      const user = demoUsers.find(u => u.id === coach.userId);
      return {
        id: coach.id,
        name: user?.displayName || '未知教练',
        avatar: (user as any)?.photoURL,
        bio: user?.bio,
        specialties: coach.specialties,
        experience: coach.experience,
        rating: coach.rating,
        totalReviews: coach.totalReviews,
        location: user?.location,
        isActive: coach.isActive,
        contact: {
          email: user?.email,
          phone: (user as any)?.phoneNumber
        }
      };
    });

    // 应用筛选条件
    if (specialty) {
      coaches = coaches.filter(coach => 
        coach.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    if (location) {
      coaches = coaches.filter(coach => 
        coach.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minRating) {
      coaches = coaches.filter(coach => coach.rating >= minRating);
    }

    if (maxHourlyRate) {
      coaches = coaches.filter(coach => {
        const coachData = demoCoaches.find(c => c.id === coach.id);
        return coachData && coachData.hourlyRate <= maxHourlyRate;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      coaches = coaches.filter(coach => 
        coach.name.toLowerCase().includes(searchLower) ||
        coach.bio?.toLowerCase().includes(searchLower) ||
        coach.specialties.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    // 应用排序
    coaches.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'hourlyRate':
          const aCoach = demoCoaches.find(c => c.id === a.id);
          const bCoach = demoCoaches.find(c => c.id === b.id);
          aValue = aCoach?.hourlyRate || 0;
          bValue = bCoach?.hourlyRate || 0;
          break;
        case 'newest':
        default:
          aValue = 0; // 演示数据没有创建时间
          bValue = 0;
          break;
      }

      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    // 应用分页
    const startIndex = startAfterDocId ? 
      coaches.findIndex(c => c.id === startAfterDocId) + 1 : 0;
    const endIndex = startIndex + limitCount;
    const paginatedCoaches = coaches.slice(startIndex, endIndex);
    const hasMore = endIndex < coaches.length;

    return {
      data: paginatedCoaches,
      hasMore,
      lastDocId: paginatedCoaches.length > 0 ? paginatedCoaches[paginatedCoaches.length - 1].id : undefined
    };
  }
}

// 获取教练详情（服务端）
export async function getCoachDetailsServer(coachId: string): Promise<CoachDetails | null> {
  try {
    const db = firestore;
    
    // 获取教练信息
    const coachDoc = await getDoc(doc(db, 'coaches', coachId));
    if (!coachDoc.exists()) {
      return null;
    }

    const coachData = coachDoc.data();
    
    // 获取用户信息
    const userDoc = await getDoc(doc(db, 'users', coachData.userId));
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    // 获取教练的课程
    const coursesQuery = query(
      collection(db, 'courses'),
      where('coachId', '==', coachId),
      where('isActive', '==', true),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );

    const coursesSnapshot = await getDocs(coursesQuery);
    const courses: CourseListItem[] = [];

    for (const courseDoc of coursesSnapshot.docs) {
      const courseData = courseDoc.data();
      
      // 获取分类信息
      const categoryDoc = await getDoc(doc(db, 'categories', courseData.categoryId));
      const categoryData = categoryDoc.exists() ? categoryDoc.data() : null;

      // 获取教练信息（用于课程中的教练信息）
      const courseCoachDoc = await getDoc(doc(db, 'users', coachData.userId));
      const courseCoachData = courseCoachDoc.exists() ? courseCoachDoc.data() : null;

      const course: CourseListItem = {
        id: courseDoc.id,
        title: courseData.title,
        description: courseData.description,
        coverImage: courseData.images?.[0],
        category: {
          id: courseData.categoryId,
          name: categoryData?.name || '未分类',
          color: categoryData?.color
        },
        coach: {
          id: coachId,
          name: courseCoachData?.displayName || '未知教练',
          location: courseCoachData?.location
        },
        price: courseData.price,
        duration: courseData.duration,
        level: courseData.level,
        rating: courseData.rating || 0,
        totalReviews: courseData.totalReviews || 0,
        maxStudents: courseData.maxStudents,
        currentStudents: courseData.currentStudents,
        isActive: courseData.isActive,
        createdAt: courseData.createdAt
      };

      courses.push(course);
    }

    const coachDetails: CoachDetails = {
      id: coachDoc.id,
      name: userData.displayName || '未知教练',
      avatar: (userData as any).photoURL,
      bio: userData.bio,
      fullBio: userData.bio, // 可以扩展为更详细的简介
      specialties: coachData.specialties || [],
      experience: coachData.experience || 0,
      rating: coachData.rating || 0,
      totalReviews: coachData.totalReviews || 0,
      location: userData.location,
      isActive: coachData.isActive,
      education: coachData.education || [],
      certifications: coachData.certifications || [],
      hourlyRate: coachData.hourlyRate || 0,
      availability: coachData.availability || {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      courses,
      contact: {
        email: userData.email,
        phone: userData.phoneNumber
      }
    };

    return coachDetails;
  } catch (error) {
    console.error('获取教练详情失败，使用演示数据:', error);
    
    // 使用演示数据作为后备
    const coach = demoCoaches.find(c => c.id === coachId);
    if (!coach) {
      return null;
    }

    const user = demoUsers.find(u => u.id === coach.userId);
    if (!user) {
      return null;
    }

    // 获取教练的课程
    const coachCourses = demoCourses.filter(course => course.coachId === coachId);
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
    const courses: CourseListItem[] = coachCourses.slice(0, 6).map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      coverImage: course.images?.[0],
      category: {
        id: course.categoryId,
        name: '演示分类',
        color: 'blue'
      },
      coach: {
        id: coachId,
        name: user.displayName,
        location: user.location
      },
      price: course.price,
      duration: course.duration,
      level: normalizeLevel(course.level as any),
      rating: course.rating || 0,
      totalReviews: course.totalReviews || 0,
      maxStudents: course.maxStudents,
      currentStudents: course.currentStudents,
      isActive: course.isActive,
      createdAt: course.createdAt
    }));

    const coachDetails: CoachDetails = {
      id: coach.id,
      name: user.displayName,
      avatar: (user as any).photoURL,
      bio: user.bio,
      fullBio: user.bio,
      specialties: coach.specialties,
      experience: coach.experience,
      rating: coach.rating,
      totalReviews: coach.totalReviews,
      location: user.location,
      isActive: coach.isActive,
      education: coach.education,
      certifications: coach.certifications,
      hourlyRate: coach.hourlyRate,
      availability: coach.availability,
      courses,
      contact: {
        email: user.email,
        phone: (user as any).phoneNumber
      }
    };

    return coachDetails;
  }
}

// 获取所有专业领域（用于筛选器）
export async function getSpecialtiesServer(): Promise<string[]> {
  try {
    const db = firestore;
    
    const coachesQuery = query(
      collection(db, 'coaches'),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(coachesQuery);
    const specialtiesSet = new Set<string>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.specialties && Array.isArray(data.specialties)) {
        data.specialties.forEach((specialty: string) => {
          specialtiesSet.add(specialty);
        });
      }
    });

    return Array.from(specialtiesSet).sort();
  } catch (error) {
    console.error('获取专业领域失败，使用演示数据:', error);
    
    // 使用演示数据作为后备
    const specialtiesSet = new Set<string>();
    demoCoaches.forEach(coach => {
      coach.specialties.forEach(specialty => {
        specialtiesSet.add(specialty);
      });
    });

    return Array.from(specialtiesSet).sort();
  }
}
