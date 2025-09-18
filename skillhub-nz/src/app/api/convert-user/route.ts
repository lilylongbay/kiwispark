import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// 标记为静态导出，避免在 output: 'export' 时构建报错
export const dynamic = 'force-static';

// 惰性、安全地初始化 Firebase Admin，避免在构建期抛错
function getDbSafe() {
  try {
    if (!getApps().length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawPrivateKey) {
        return null;
      }

      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    return getFirestore();
  } catch (error) {
    console.error('Firebase Admin 初始化失败:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDbSafe();
    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'Firebase Admin 未配置，无法执行转换。',
      }, { status: 503 });
    }

    const { email, institutionData } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: '邮箱地址是必需的',
      }, { status: 400 });
    }

    // 查找用户
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: '未找到该邮箱的用户',
      }, { status: 404 });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // 更新用户角色为教育机构
    await db.collection('users').doc(userId).update({
      role: 'institution',
      updatedAt: new Date(),
    });

    // 创建教育机构文档
    const institutionDoc = {
      userId: userId,
      name: institutionData?.name || userData.displayName || '教育机构',
      description: institutionData?.description || '',
      website: institutionData?.website || '',
      address: institutionData?.address || '',
      phoneNumber: institutionData?.phoneNumber || '',
      email: email,
      licenseNumber: institutionData?.licenseNumber || '',
      establishedYear: institutionData?.establishedYear || new Date().getFullYear(),
      specialties: institutionData?.specialties || [],
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('institutions').doc(userId).set(institutionDoc);

    return NextResponse.json({
      success: true,
      message: '用户已成功转换为教育机构',
      user: {
        id: userId,
        email: email,
        role: 'institution',
        displayName: userData.displayName,
      },
      institution: institutionDoc,
    });

  } catch (error) {
    console.error('转换用户失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '转换失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '用户转换API',
    usage: 'POST /api/convert-user with { "email": "user@example.com", "institutionData": { "name": "机构名称", "address": "地址", ... } }',
  });
}
