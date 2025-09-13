import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { adminFirestore } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';
import type { ReplyDoc, ReviewDoc, CourseDoc, CoachDoc } from '@/types/domain';

// 回复创建验证schema
const createReplySchema = z.object({
  reviewId: z.string().min(1, '评论ID是必填项'),
  content: z.string().min(10, '回复内容至少需要10个字符').max(500, '回复内容不能超过500个字符'),
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
    if (userData?.role !== 'coach') {
      return NextResponse.json(
        { error: '只有教练可以回复评论' },
        { status: 403 }
      );
    }

    // 解析和验证请求数据
    const body = await request.json();
    const validatedData = createReplySchema.parse(body);
    const { reviewId, content } = validatedData;

    // 使用事务确保原子性
    const result = await adminFirestore().runTransaction(async (transaction: any) => {
      // 获取评论文档
      const reviewRef = adminFirestore().collection('reviews').doc(reviewId);
      const reviewDoc = await transaction.get(reviewRef);

      if (!reviewDoc.exists) {
        throw new Error('评论不存在');
      }

      const reviewData = reviewDoc.data() as ReviewDoc;

      // 获取课程文档
      const courseRef = adminFirestore().collection('courses').doc(reviewData.courseId);
      const courseDoc = await transaction.get(courseRef);

      if (!courseDoc.exists) {
        throw new Error('课程不存在');
      }

      const courseData = courseDoc.data() as CourseDoc;

      // 获取教练文档
      const coachRef = adminFirestore().collection('coaches').doc(courseData.coachId);
      const coachDoc = await transaction.get(coachRef);

      if (!coachDoc.exists) {
        throw new Error('教练不存在');
      }

      const coachData = coachDoc.data() as CoachDoc;

      // 验证当前用户是否为该课程的教练
      if (coachData.userId !== userId) {
        throw new Error('您只能回复自己课程的评论');
      }

      // 检查是否已经回复过该评论
      const existingReplyQuery = await adminFirestore()
        .collection('replies')
        .where('reviewId', '==', reviewId)
        .limit(1)
        .get();

      if (!existingReplyQuery.empty) {
        throw new Error('该评论已有回复');
      }

      // 创建回复文档
      const replyRef = adminFirestore().collection('replies').doc();
      const newReply: Omit<ReplyDoc, 'id'> = {
        reviewId,
        userId,
        content,
        isFromCoach: true,
        createdAt: Timestamp.now() as any,
        updatedAt: Timestamp.now() as any,
      };

      // 在事务中执行操作
      transaction.set(replyRef, newReply);

      return {
        replyId: replyRef.id,
        newReply: { ...newReply, id: replyRef.id },
      };
    });

    return NextResponse.json({
      success: true,
      reply: result.newReply,
    });

  } catch (error) {
    console.error('创建回复错误:', error);

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
