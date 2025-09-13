'use client';

import { useEffect, useState } from 'react';
import { auth, firestore } from '@/firebase/client';
import { GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>('检查中...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // 测试Firebase配置
        setStatus('Firebase配置正常');
        
        // 测试Firestore连接
        const testDocRef = doc(firestore, 'test', 'connection');
        const testDoc = await getDoc(testDocRef);
        setDetails({
          auth: !!auth,
          firestore: !!firestore,
          googleProvider: !!new GoogleAuthProvider(),
          testDocExists: testDoc.exists(),
          currentUser: auth.currentUser?.uid || '未登录'
        });
        
        setStatus('所有测试通过');
      } catch (error: any) {
        setStatus('测试失败');
        setDetails({
          error: error.message,
          code: error.code,
          stack: error.stack
        });
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Firebase连接测试</h3>
      <p className="mb-2">状态: {status}</p>
      {details && (
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </div>
  );
}
