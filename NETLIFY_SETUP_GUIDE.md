# 🚀 Netlify 部署设置指南

## ✅ 测试结果
- **简单测试页面**: ✅ 可以访问
- **问题诊断**: Netlify基本部署正常，问题在于Next.js项目配置

## 🔧 需要在Netlify控制台进行的设置

### 1. 构建设置 (Build Settings)

进入 Netlify 控制台 → 您的站点 → Site settings → Build & deploy → Build settings

#### 设置以下参数：
- **Base directory**: `skillhub-nz`
- **Build command**: `npm run build:netlify`
- **Publish directory**: `skillhub-nz/out`

### 2. 环境变量 (Environment Variables)

进入 Site settings → Environment variables → Add variable

添加以下环境变量：
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = kiwispark-80e5d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = kiwispark-80e5d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = kiwispark-80e5d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 287274562407
NEXT_PUBLIC_FIREBASE_APP_ID = 1:287274562407:web:1fac7d76f212e3843035c2
```

### 3. 手动触发部署

1. 在 Netlify 控制台点击 **"Trigger deploy"**
2. 选择 **"Deploy site"**
3. 等待构建完成

### 4. 测试访问

构建完成后，访问以下URL：
- **中文版**: `https://your-site.netlify.app/zh/`
- **英文版**: `https://your-site.netlify.app/en/`
- **根路径**: `https://your-site.netlify.app/` (会自动重定向到中文版)

## 🔍 如果仍然有问题

### 检查构建日志
1. 在 Netlify 控制台查看构建日志
2. 寻找错误信息
3. 确认所有依赖都正确安装

### 常见问题
1. **构建失败**: 检查 Node.js 版本是否为 18
2. **环境变量**: 确认所有 Firebase 环境变量都已设置
3. **依赖问题**: 确认 package.json 中的依赖都正确

## 📞 需要帮助？

如果按照以上步骤操作后仍有问题，请提供：
1. Netlify 构建日志的截图或错误信息
2. 具体的错误页面内容
3. 您的 Netlify 站点 URL

---

**配置完成后，您的 SkillHub NZ 网站应该能够正常访问！** 🎉
