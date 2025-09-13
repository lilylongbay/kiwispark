import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/admin';
import type { ReplyDoc } from '@/types/domain';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;

    if (!reviewId) {
      return NextResponse.json(
        { error: '评论ID是必填项' },
        { status: 400 }
      );
    }

    // 获取该评论的所有回复
    const repliesQuery = await adminFirestore()
      .collection('replies')
      .where('reviewId', '==', reviewId)
      .orderBy('createdAt', 'asc')
      .get();

    if (repliesQuery.empty) {
      return NextResponse.json({
        success: true,
        replies: [],
      });
    }

    // 获取回复者信息
    const repliesWithUsers = await Promise.all(
      repliesQuery.docs.map(async (replyDoc: any) => {
        const replyData = replyDoc.data() as ReplyDoc;
        
        // 获取回复者信息
        const userDoc = await adminFirestore()
          .collection('users')
          .doc(replyData.userId)
          .get();

        const userData = userDoc.exists ? userDoc.data() : null;

        return {
          ...replyData,
          id: replyDoc.id,
          user: {
            displayName: userData?.displayName || '未知用户',
            photoURL: userData?.photoURL,
            role: userData?.role,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      replies: repliesWithUsers,
    });

  } catch (error) {
    console.error('获取回复错误:', error);

    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
