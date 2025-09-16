import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'node:fs';

export const runtime = 'nodejs'

function getDbSafe() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const rawKey = process.env.FIREBASE_PRIVATE_KEY
    const privateKey = rawKey ? (rawKey.startsWith('"') && rawKey.endsWith('"') ? rawKey.slice(1, -1) : rawKey).replace(/\\n/g, '\n') : undefined
    const gacPathRaw = process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
    const gacPath = gacPathRaw.startsWith('"') && gacPathRaw.endsWith('"') ? gacPathRaw.slice(1, -1) : gacPathRaw

    let serviceJsonPath: string | undefined = gacPath || undefined

    // 本地开发容错：若环境变量缺失，但默认下载路径存在，则使用之（仅开发环境）
    const devGuessPath = '/Users/brinny/Downloads/kiwispark-80e5d-firebase-adminsdk-fbsvc-90062c3fbd.json'
    if (!serviceJsonPath && process.env.NODE_ENV !== 'production' && existsSync(devGuessPath)) {
      serviceJsonPath = devGuessPath
    }

    if (serviceJsonPath) {
      const jsonRaw = readFileSync(serviceJsonPath, 'utf8')
      const svc = JSON.parse(jsonRaw)
      initializeApp({
        credential: cert({
          projectId: svc.project_id,
          clientEmail: svc.client_email,
          privateKey: svc.private_key,
        })
      })
    } else if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey })
      })
    } else {
      throw new Error('Missing Firebase Admin credentials for test-setup')
    }
  }
  return getFirestore()
}

async function parseJsonLenient(request: NextRequest): Promise<any> {
  const contentType = request.headers.get('content-type') || ''
  const raw = await request.text()
  if (contentType.includes('application/json')) {
    try { return JSON.parse(raw) } catch {}
  }
  // 尝试 URL-encoded 解析
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const obj: Record<string, string> = {}
    raw.split('&').forEach(kv => {
      const [k, v] = kv.split('=')
      if (k) obj[decodeURIComponent(k)] = decodeURIComponent(v || '')
    })
    return obj
  }
  // 最后尝试直接 JSON.parse
  try { return JSON.parse(raw) } catch { return {} }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseJsonLenient(request)
    console.log('[test-setup] payload:', payload)
    const action = (payload?.action ?? '').toString().trim()
    const userId = (payload?.userId ?? '').toString().trim() || undefined
    const email = (payload?.email ?? '').toString().trim() || undefined
    console.log('[test-setup] action:', action)

    if (action === 'create-test-institution') {
      const db = getDbSafe()
      // 创建测试教育机构用户
      const testUser = {
        id: 'test-institution-user',
        email: email || 'institution@test.com',
        displayName: '测试教育机构',
        role: 'institution',
        bio: '这是一个测试教育机构',
        location: '奥克兰',
        phoneNumber: '021-123-4567',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 创建用户文档
      await db.collection('users').doc('test-institution-user').set(testUser);

      // 创建教育机构文档
      const institutionDoc = {
        userId: 'test-institution-user',
        name: '新西兰编程学院',
        description: '专注于编程教育的专业机构',
        website: 'https://nz-coding-academy.com',
        address: '奥克兰市中心',
        phoneNumber: '021-123-4567',
        email: email || 'institution@test.com',
        licenseNumber: 'EDU-2024-001',
        establishedYear: 2020,
        specialties: ['编程开发', 'Web开发', '移动应用开发'],
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('institutions').doc('test-institution-user').set(institutionDoc);

      return NextResponse.json({
        success: true,
        message: '测试教育机构账号创建成功',
        user: testUser,
        institution: institutionDoc,
      });
    }

    if (action === 'create-test-coach') {
      const db = getDbSafe()
      // 创建测试教练
      const coachDoc = {
        userId: userId || 'test-coach-user',
        specialties: ['React', 'Node.js', 'JavaScript'],
        experience: 5,
        education: ['计算机科学学士', '软件工程硕士'],
        certifications: ['AWS认证', 'Google Cloud认证'],
        hourlyRate: 80,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
        rating: 4.8,
        totalReviews: 25,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('coaches').doc(userId || 'test-coach-user').set(coachDoc);

      return NextResponse.json({
        success: true,
        message: '测试教练创建成功',
        coach: coachDoc,
      });
    }

    if (action === 'create-test-course') {
      const db = getDbSafe()
      // 创建测试课程
      const courseDoc = {
        title: 'React 高级开发课程',
        description: '深入学习React的高级特性和最佳实践',
        coachId: userId || 'test-coach-user',
        categoryId: 'programming',
        price: 299,
        duration: 480, // 8小时
        maxStudents: 20,
        currentStudents: 15,
        level: 'intermediate',
        tags: ['React', 'JavaScript', '前端开发'],
        images: [],
        isActive: true,
        isPublished: true,
        rating: 4.7,
        totalReviews: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const courseRef = await db.collection('courses').add(courseDoc);

      return NextResponse.json({
        success: true,
        message: '测试课程创建成功',
        course: { id: courseRef.id, ...courseDoc },
      });
    }

    if (action === 'create-test-reviews') {
      const db = getDbSafe()
      // 创建测试评论
      const reviews = [
        {
          courseId: 'test-course-id',
          userId: 'test-student-1',
          rating: 5,
          title: '非常棒的课程！',
          content: '课程内容非常实用，老师讲解很详细，学到了很多React的高级技巧。',
          isVerified: true,
          helpfulCount: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          courseId: 'test-course-id',
          userId: 'test-student-2',
          rating: 4,
          title: '学到了很多知识',
          content: '课程内容很全面，从基础到高级都有涉及。推荐！',
          isVerified: true,
          helpfulCount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const reviewRefs = await Promise.all(
        reviews.map(review => db.collection('reviews').add(review))
      );

      return NextResponse.json({
        success: true,
        message: '测试评论创建成功',
        reviews: reviewRefs.map((ref, index) => ({ id: ref.id, ...reviews[index] })),
      });
    }

    return NextResponse.json({
      success: false,
      message: '未知的操作类型',
    });

  } catch (error) {
    console.error('测试设置错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: '设置失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
  const envProbe = {
    hasGOOGLE_APPLICATION_CREDENTIALS: Boolean(gac),
    GOOGLE_APPLICATION_CREDENTIALS_length: gac ? gac.length : 0,
    hasFIREBASE_PROJECT_ID: Boolean(process.env.FIREBASE_PROJECT_ID),
    hasFIREBASE_CLIENT_EMAIL: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
    hasFIREBASE_PRIVATE_KEY: Boolean(process.env.FIREBASE_PRIVATE_KEY),
  }

  return NextResponse.json({
    message: '测试设置API',
    availableActions: [
      'create-test-institution',
      'create-test-coach', 
      'create-test-course',
      'create-test-reviews'
    ],
    envProbe,
    usage: {
      createTestInstitution: 'POST /api/test-setup with { "action": "create-test-institution", "email": "your-email@example.com" }',
      createTestCoach: 'POST /api/test-setup with { "action": "create-test-coach", "userId": "coach-user-id" }',
      createTestCourse: 'POST /api/test-setup with { "action": "create-test-course", "userId": "coach-user-id" }',
      createTestReviews: 'POST /api/test-setup with { "action": "create-test-reviews" }',
    }
  });
}
