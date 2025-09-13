import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-server';
import { z } from 'zod';

const enrollmentSchema = z.object({
  courseId: z.string().min(1, '课程ID不能为空'),
});

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 验证请求数据
    const body = await request.json();
    const { courseId } = enrollmentSchema.parse(body);

    // 这里可以添加实际的报名逻辑
    // 目前只是模拟成功响应
    return NextResponse.json({
      success: true,
      message: '报名成功！',
      enrollmentId: `enrollment_${Date.now()}`,
    });

  } catch (error) {
    console.error('报名失败:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '请求数据格式错误' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '报名失败，请稍后重试' },
      { status: 500 }
    );
  }
}
