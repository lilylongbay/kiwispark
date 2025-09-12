export function CourseListSkeleton() {
  return (
    <div>
      {/* 排序和结果统计骨架 */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* 课程网格骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* 封面骨架 */}
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            
            {/* 内容骨架 */}
            <div className="p-4">
              {/* 标题骨架 */}
              <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              
              {/* 描述骨架 */}
              <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
              
              {/* 教练信息骨架 */}
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
              
              {/* 课程详情骨架 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              
              {/* 评分和价格骨架 */}
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


