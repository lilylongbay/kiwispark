# 课程服务器组件实现

本文档描述了使用服务器组件构建的课程列表和详情页面的实现。

## 功能特性

### 课程列表页面 (`/courses`)

- **服务器端渲染**: 使用Next.js 13+的服务器组件
- **类型安全**: 完整的TypeScript类型定义
- **Firestore集成**: 从Firestore获取课程、分类和教练数据
- **分页支持**: 基于游标的分页（使用`startAfter`）
- **排序功能**: 支持按最新、评分、价格排序
- **筛选功能**: 按分类、难度、价格范围筛选
- **搜索功能**: 基于标题、描述和教练名称的搜索
- **错误处理**: 完整的错误边界和回退机制
- **演示数据**: 当Firestore不可用时自动使用演示数据

### 课程详情页面 (`/courses/[id]`)

- **服务器端渲染**: 完整的课程详情页面
- **关联数据**: 自动获取分类、教练和用户信息
- **SEO优化**: 动态生成元数据
- **错误处理**: 404处理和错误边界
- **响应式设计**: 移动端友好的布局

## 文件结构

```
src/
├── lib/
│   └── courses-server.ts          # 服务器端数据获取函数
├── components/courses/
│   ├── CourseListServer.tsx       # 服务器端课程列表组件
│   ├── CourseCard.tsx             # 课程卡片组件
│   ├── CourseDetailsView.tsx      # 课程详情视图组件
│   ├── ServerPagination.tsx       # 服务器端分页组件
│   └── CourseErrorBoundary.tsx    # 错误边界组件
└── app/[locale]/courses/
    ├── page.tsx                   # 课程列表页面
    └── [id]/page.tsx              # 课程详情页面
```

## 数据流

### 课程列表数据流

1. **URL参数解析**: 从`searchParams`解析筛选和排序参数
2. **并行数据获取**: 同时获取课程列表和分类数据
3. **数据转换**: 将Firestore文档转换为类型安全的`CourseListItem`
4. **关联查询**: 并行获取每个课程的分类、教练和用户信息
5. **分页处理**: 使用游标分页返回结果

### 课程详情数据流

1. **课程获取**: 根据ID获取课程文档
2. **关联数据**: 并行获取分类、教练和用户信息
3. **数据转换**: 转换为`CourseDetails`类型
4. **元数据生成**: 为SEO生成动态元数据

## 类型定义

### 核心类型

```typescript
// 课程列表项
interface CourseListItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  category: { id: string; name: string; color?: string };
  coach: { id: string; name: string; location?: string };
  price: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  totalReviews: number;
  maxStudents: number;
  currentStudents: number;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
}

// 课程详情
interface CourseDetails extends CourseListItem {
  tags: string[];
  images: string[];
  coach: {
    id: string;
    name: string;
    bio?: string;
    location?: string;
    specialties: string[];
    experience: number;
    rating: number;
    totalReviews: number;
  };
  category: {
    id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
  };
}
```

## 性能优化

### 数据获取优化

- **并行查询**: 使用`Promise.all`并行获取关联数据
- **类型安全转换器**: 避免重复的类型转换逻辑
- **游标分页**: 使用Firestore的`startAfter`实现高效分页

### 渲染优化

- **服务器组件**: 在服务器端渲染，减少客户端JavaScript
- **Suspense边界**: 使用Suspense处理加载状态
- **错误边界**: 优雅处理错误状态

## 错误处理

### 多层错误处理

1. **数据获取层**: 捕获Firestore查询错误，回退到演示数据
2. **组件层**: 使用错误边界捕获渲染错误
3. **页面层**: 处理整个页面的错误状态

### 回退机制

- **演示数据**: 当Firestore不可用时自动使用内置演示数据
- **错误页面**: 提供用户友好的错误页面和重试选项
- **404处理**: 使用Next.js的`notFound()`处理不存在的课程

## 使用方法

### 开发环境

1. 确保Firebase配置正确
2. 运行开发服务器: `npm run dev`
3. 访问 `/courses` 查看课程列表
4. 访问 `/courses/[id]` 查看课程详情

### 生产环境

1. 配置Firebase环境变量
2. 部署到Vercel或其他支持Next.js的平台
3. 确保Firestore安全规则允许读取操作

## 扩展功能

### 可能的改进

- **缓存策略**: 添加Redis或内存缓存
- **搜索优化**: 集成Algolia或其他搜索引擎
- **图片优化**: 使用Next.js Image组件优化图片加载
- **国际化**: 支持多语言课程内容
- **实时更新**: 使用Firestore实时监听器

### 监控和日志

- 添加性能监控
- 记录数据获取时间
- 监控错误率
- 用户行为分析

## 注意事项

1. **Firestore配额**: 注意Firestore的读取配额限制
2. **安全规则**: 确保Firestore安全规则正确配置
3. **类型安全**: 保持TypeScript类型定义的准确性
4. **错误处理**: 在生产环境中提供详细的错误日志
5. **性能监控**: 监控页面加载时间和数据获取性能
