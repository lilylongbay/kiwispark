"use client";
import { Suspense } from 'react';
import InstitutionReviews from '@/components/institution/InstitutionReviews';
import { InstitutionReviewsSkeleton } from '@/components/institution/InstitutionReviewsSkeleton';
import RequireRole from '@/components/auth/RequireRole';

export default function InstitutionReviewsPage() {
  return (
    <RequireRole allow={["institution","admin","super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<InstitutionReviewsSkeleton />}>
            <InstitutionReviews />
          </Suspense>
        </div>
      </div>
    </RequireRole>
  );
}
