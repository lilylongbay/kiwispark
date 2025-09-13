export function CoursePublishSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
      </div>

      {/* Form Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Title Field */}
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Description Field */}
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Image Upload */}
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
            <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
