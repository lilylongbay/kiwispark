export function CoachListSkeleton() {
  return (
    <div>
      {/* 结果统计骨架 */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* 教练网格骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4 mb-4">
              {/* 头像骨架 */}
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              
              <div className="flex-1 min-w-0">
                {/* 姓名骨架 */}
                <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                {/* 位置骨架 */}
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>

            {/* 评分骨架 */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            {/* 专业领域骨架 */}
            <div className="mb-3">
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>

            {/* 简介骨架 */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* 经验骨架 */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>

            {/* 联系方式骨架 */}
            <div className="border-t border-gray-100 pt-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

