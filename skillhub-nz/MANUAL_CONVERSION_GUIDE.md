# 手动转换用户为教育机构指南

## 目标
将 `lilylongbay@gmail.com` 账号转换为教育机构账号

## 方法1：通过Firebase控制台手动修改

### 步骤1：访问Firebase控制台
1. 打开 [Firebase控制台](https://console.firebase.google.com/)
2. 选择项目：`kiwispark-80e5d`

### 步骤2：修改用户角色
1. 进入 **Firestore Database**
2. 找到 `users` 集合
3. 找到邮箱为 `lilylongbay@gmail.com` 的用户文档
4. 编辑该文档，将 `role` 字段从 `user` 改为 `institution`

### 步骤3：创建教育机构文档
1. 在 `institutions` 集合中创建新文档
2. 文档ID使用用户的UID（从users集合中获取）
3. 添加以下字段：

```json
{
  "userId": "用户的UID",
  "name": "新西兰编程学院",
  "description": "专注于编程教育的专业机构",
  "website": "https://nz-coding-academy.com",
  "address": "奥克兰市中心",
  "phoneNumber": "021-123-4567",
  "email": "lilylongbay@gmail.com",
  "licenseNumber": "EDU-2024-001",
  "establishedYear": 2020,
  "specialties": ["编程开发", "Web开发", "移动应用开发"],
  "isActive": true,
  "isVerified": false,
  "createdAt": "2024-01-16T00:00:00.000Z",
  "updatedAt": "2024-01-16T00:00:00.000Z"
}
```

## 方法2：通过代码手动执行

### 步骤1：创建转换脚本
在项目根目录创建 `convert-user.js` 文件：

```javascript
// convert-user.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8",
  authDomain: "kiwispark-80e5d.firebaseapp.com",
  projectId: "kiwispark-80e5d",
  storageBucket: "kiwispark-80e5d.firebasestorage.app",
  messagingSenderId: "287274562407",
  appId: "1:287274562407:web:1fac7d76f212e3843035c2",
  measurementId: "G-933NXHTVY4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function convertUser() {
  try {
    // 这里需要先找到用户的UID
    // 由于我们无法直接通过邮箱查询，需要手动获取UID
    
    const userUid = "USER_UID_HERE"; // 需要从Firebase控制台获取
    
    // 更新用户角色
    await updateDoc(doc(db, 'users', userUid), {
      role: 'institution',
      updatedAt: new Date()
    });
    
    // 创建教育机构文档
    await setDoc(doc(db, 'institutions', userUid), {
      userId: userUid,
      name: "新西兰编程学院",
      description: "专注于编程教育的专业机构",
      website: "https://nz-coding-academy.com",
      address: "奥克兰市中心",
      phoneNumber: "021-123-4567",
      email: "lilylongbay@gmail.com",
      licenseNumber: "EDU-2024-001",
      establishedYear: 2020,
      specialties: ["编程开发", "Web开发", "移动应用开发"],
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('用户转换成功！');
  } catch (error) {
    console.error('转换失败:', error);
  }
}

convertUser();
```

## 方法3：使用测试页面（推荐）

### 步骤1：访问转换页面
1. 打开浏览器访问：`http://localhost:3000/convert-user-simple`
2. 邮箱已经预填为 `lilylongbay@gmail.com`

### 步骤2：执行转换
1. 点击"转换为教育机构"按钮
2. 等待转换完成

### 步骤3：登录测试
1. 访问：`http://localhost:3000/zh/auth/institution-signin`
2. 使用 `lilylongbay@gmail.com` 和原密码登录
3. 应该会跳转到教育机构仪表板

## 验证转换是否成功

### 检查用户角色
1. 登录后查看用户信息
2. 确认角色显示为 `institution`

### 检查教育机构功能
1. 访问教育机构仪表板：`/institution/dashboard`
2. 尝试发布课程：`/institution/courses/new`
3. 尝试添加教练：`/institution/coaches/new`
4. 尝试管理评论：`/institution/reviews`

## 注意事项

1. **备份数据**：在进行任何修改前，建议备份Firestore数据
2. **权限检查**：确保有足够的权限修改Firestore数据
3. **测试验证**：转换完成后，务必测试所有教育机构功能
4. **错误处理**：如果遇到问题，可以回滚更改

## 联系支持

如果遇到任何问题，请提供：
1. 具体的错误信息
2. 操作步骤
3. 浏览器控制台日志
