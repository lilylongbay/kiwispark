import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// 初始化 Firebase Admin
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin 初始化失败:', error);
  }
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
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
