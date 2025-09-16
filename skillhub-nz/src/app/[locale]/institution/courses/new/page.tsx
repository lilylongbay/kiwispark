"use client";
import { Suspense } from 'react';
import CoursePublishForm from '@/components/institution/CoursePublishForm';
import { CoursePublishSkeleton } from '@/components/institution/CoursePublishSkeleton';
import RequireRole from '@/components/auth/RequireRole';

export default function NewCoursePage() {
  return (
    <RequireRole allow={["institution","admin","super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<CoursePublishSkeleton />}>
            <CoursePublishForm />
          </Suspense>
        </div>
      </div>
    </RequireRole>
  );
}
