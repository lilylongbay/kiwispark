import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-static';
import { adminAuth } from '@/firebase/admin';
import { adminFirestore } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';
import type { ReviewDoc, CourseDoc } from '@/types/domain';
import { recalculateRating } from '@/lib/rating-utils';

// 评论创建验证schema
const createReviewSchema = z.object({
  courseId: z.string().min(1, '课程ID是必填项'),
  rating: z.number().int().min(1, '评分至少为1').max(5, '评分最多为5'),
  content: z.string().min(10, '评论内容至少需要10个字符').max(800, '评论内容不能超过800个字符'),
});

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: '未登录，请先登录' },
        { status: 401 }
      );
    }

    // 验证ID token
    const decodedToken = await adminAuth().verifyIdToken(sessionCookie);
    const userId = decodedToken.uid;

    // 获取用户信息
    const userDoc = await adminFirestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    if (userData?.role !== 'user') {
      return NextResponse.json(
        { error: '只有学生可以发表评论' },
        { status: 403 }
      );
    }

    // 解析和验证请求数据
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);
    const { courseId, rating, content } = validatedData;

    // 检查是否已经评论过该课程
    const existingReviewQuery = await adminFirestore()
      .collection('reviews')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .limit(1)
      .get();

    if (!existingReviewQuery.empty) {
      return NextResponse.json(
        { error: '您已经评论过该课程' },
        { status: 400 }
      );
    }

    // 使用事务确保原子性
    const result = await adminFirestore().runTransaction(async (transaction) => {
      // 获取课程文档
      const courseRef = adminFirestore().collection('courses').doc(courseId);
      const courseDoc = await transaction.get(courseRef);

      if (!courseDoc.exists) {
        throw new Error('课程不存在');
      }

      const courseData = courseDoc.data() as CourseDoc;
      const currentRating = courseData.rating || 0;
      const currentCount = courseData.totalReviews || 0;

      // 计算新的评分
      const { newAverage, newCount } = recalculateRating(currentRating, currentCount, rating);

      // 创建评论文档
      const reviewRef = adminFirestore().collection('reviews').doc();
      const newReview: Omit<ReviewDoc, 'id'> = {
        courseId,
        userId,
        rating,
        title: '', // 暂时为空，后续可以扩展
        content,
        isVerified: false, // 暂时设为false，后续可以验证购买记录
        helpfulCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // 在事务中执行所有操作
      transaction.set(reviewRef, newReview);
      transaction.update(courseRef, {
        rating: newAverage,
        totalReviews: newCount,
        updatedAt: Timestamp.now(),
      });

      return {
        reviewId: reviewRef.id,
        newReview: { ...newReview, id: reviewRef.id },
        courseRating: newAverage,
        courseReviewCount: newCount,
      };
    });

    return NextResponse.json({
      success: true,
      review: result.newReview,
      courseRating: result.courseRating,
      courseReviewCount: result.courseReviewCount,
    });

  } catch (error) {
    console.error('创建评论错误:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
