export function CourseDetailsSkeleton() {
  return (
    <div>
      {/* 返回按钮骨架 */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容骨架 */}
        <div className="lg:col-span-2">
          {/* 课程封面骨架 */}
          <div className="h-64 md:h-80 bg-gray-200 rounded-lg animate-pulse mb-6"></div>

          {/* 课程基本信息骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>

            {/* 课程统计骨架 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 课程标签骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* 课程图片骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* 评价区域骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* 侧边栏骨架 */}
        <div className="lg:col-span-1">
          {/* 报名卡片骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
            </div>

            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>

            <div className="text-center">
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
            </div>
          </div>

          {/* 教练信息骨架 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mx-auto mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="w-full h-8 bg-gray-200 rounded mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


