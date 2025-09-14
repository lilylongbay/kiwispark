# 🚨 紧急修复指南 - Netlify 404 问题

## 当前状态
- ✅ 测试页面可以访问：`kiwispark.netlify.app/netlify-test.html`
- ❌ 主项目页面404：`kiwispark.netlify.app/en/`

## 问题诊断
Netlify 构建设置不正确，需要手动在控制台配置。

## 🔧 立即执行的修复步骤

### 1. 登录 Netlify 控制台
访问：https://app.netlify.com/

### 2. 找到您的站点
点击站点名称进入站点管理页面

### 3. 进入构建设置
**Site settings** → **Build & deploy** → **Build settings**

### 4. 设置以下参数

#### Build settings:
- **Base directory**: `skillhub-nz`
- **Build command**: `npm run build:netlify`
- **Publish directory**: `skillhub-nz/out`

### 5. 添加环境变量
**Environment variables** → **Add variable**，添加：

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = kiwispark-80e5d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = kiwispark-80e5d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = kiwispark-80e5d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 287274562407
NEXT_PUBLIC_FIREBASE_APP_ID = 1:287274562407:web:1fac7d76f212e3843035c2
```

### 6. 手动触发部署
点击 **"Trigger deploy"** → **"Deploy site"**

### 7. 等待构建完成
构建过程大约需要 2-3 分钟

### 8. 测试访问
构建完成后访问：
- `https://kiwispark.netlify.app/zh/`
- `https://kiwispark.netlify.app/en/`

## 🎯 关键点
- **Base directory** 必须设置为 `skillhub-nz`
- **Publish directory** 必须设置为 `skillhub-nz/out`
- 所有环境变量必须正确添加

## 📞 如果仍有问题
请提供 Netlify 构建日志的截图，我会进一步协助解决。

---

**执行这些步骤后，您的网站应该能正常访问！** 🚀
