# Firebase 认证系统设置指南

## 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下环境变量：

### Firebase 客户端配置
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase 管理端配置
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
```

## 获取 Firebase 配置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 在项目设置中获取 Web 应用配置
4. 在服务账户中生成新的私钥

## 功能特性

### 已实现的功能
- ✅ 用户注册（邮箱/密码）
- ✅ 用户登录（邮箱/密码）
- ✅ 会话管理（HTTP-only cookies）
- ✅ 路由保护（中间件）
- ✅ 服务端用户验证
- ✅ 响应式UI组件
- ✅ 表单验证（Zod + React Hook Form）
- ✅ 单元测试

### 页面路由
- `/auth/signup` - 用户注册
- `/auth/signin` - 用户登录
- `/dashboard` - 受保护的仪表板
- `/api/session` - 会话管理API

### 用户角色
- `student` - 学生用户（默认）
- `coach` - 教练用户
- `admin` - 管理员用户

## 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build

# 运行测试
npm run test:run
```

## 测试

运行验证器测试：
```bash
npm run test:run
```

测试覆盖：
- 注册表单验证
- 登录表单验证
- 密码强度验证
- 邮箱格式验证
- 姓名格式验证

