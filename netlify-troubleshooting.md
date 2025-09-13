# Netlify 部署问题诊断指南

## 🔍 可能的问题和解决方案

### 1. 检查Netlify站点配置

在Netlify控制台中检查以下设置：

#### 构建设置 (Build Settings)
- **Base directory**: 留空或设置为 `.`
- **Build command**: 
  - 对于简单静态站点：留空或设置为 `echo "No build needed"`
  - 对于Next.js项目：`npm run build:netlify`
- **Publish directory**: 
  - 对于简单静态站点：`.`
  - 对于Next.js项目：`skillhub-nz/out`

#### 环境变量
确保以下环境变量已设置：
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kiwispark-80e5d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kiwispark-80e5d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kiwispark-80e5d.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=287274562407
NEXT_PUBLIC_FIREBASE_APP_ID=1:287274562407:web:1fac7d76f212e3843035c2
```

### 2. 检查GitHub集成

1. 进入Netlify控制台 → Site settings → Build & deploy → Continuous Deployment
2. 确认GitHub仓库连接正常
3. 检查webhook是否正常工作

### 3. 手动触发部署

1. 在Netlify控制台中点击 "Trigger deploy" → "Deploy site"
2. 观察构建日志，查看是否有错误信息

### 4. 测试不同的配置

#### 配置A：简单静态站点
- 构建设置：Base directory: `.`, Build command: 留空, Publish directory: `.`
- 访问：`https://your-site.netlify.app/netlify-test.html`

#### 配置B：Next.js项目
- 构建设置：Base directory: `skillhub-nz`, Build command: `npm run build:netlify`, Publish directory: `skillhub-nz/out`
- 访问：`https://your-site.netlify.app/zh/`

### 5. 常见错误和解决方案

#### 错误：Page not found
- **原因**：重定向规则配置错误
- **解决**：检查netlify.toml中的redirects配置

#### 错误：Build failed
- **原因**：构建命令或依赖问题
- **解决**：检查package.json和构建日志

#### 错误：Environment variables missing
- **原因**：环境变量未设置
- **解决**：在Netlify控制台添加环境变量

### 6. 调试步骤

1. **第一步**：测试简单静态页面
   - 访问 `https://your-site.netlify.app/netlify-test.html`
   - 如果能看到页面，说明基本部署正常

2. **第二步**：检查构建日志
   - 在Netlify控制台查看最近的部署日志
   - 寻找错误信息

3. **第三步**：手动触发部署
   - 在Netlify控制台手动触发部署
   - 观察构建过程

### 7. 联系信息

如果问题仍然存在，请提供：
- Netlify站点URL
- 最新的部署日志
- 具体的错误信息

---

**最后更新**: $(date)
