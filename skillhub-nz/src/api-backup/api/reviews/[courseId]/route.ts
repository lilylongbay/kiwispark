import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/admin';
import type { ReviewDoc } from '@/types/domain';

interface ReviewWithUser extends ReviewDoc {
  user: {
    displayName: string;
    photoURL?: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: '课程ID是必填项' },
        { status: 400 }
      );
    }

    // 获取评论列表
    const reviewsSnapshot = await adminFirestore()
      .collection('reviews')
      .where('courseId', '==', courseId)
      .orderBy('createdAt', 'desc')
      .get();

    if (reviewsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        reviews: [],
      });
    }

    // 获取用户信息
    const userIds = [...new Set(reviewsSnapshot.docs.map((doc: any) => doc.data().userId))];
    const usersSnapshot = await adminFirestore()
      .collection('users')
      .where('__name__', 'in', userIds)
      .get();

    const usersMap = new Map();
    usersSnapshot.docs.forEach((doc: any) => {
      const userData = doc.data();
      usersMap.set(doc.id, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });
    });

    // 组合评论和用户信息
    const reviews: ReviewWithUser[] = reviewsSnapshot.docs.map((doc: any) => {
      const reviewData = doc.data() as ReviewDoc;
      const user = usersMap.get(reviewData.userId) || {
        displayName: '匿名用户',
        photoURL: undefined,
      };

      return {
        ...reviewData,
        id: doc.id,
        user,
      };
    });

    return NextResponse.json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
