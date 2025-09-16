"use client";
import { Suspense } from 'react';
import InstitutionDashboard from '@/components/institution/InstitutionDashboard';
import { InstitutionDashboardSkeleton } from '@/components/institution/InstitutionDashboardSkeleton';
import RequireRole from '@/components/auth/RequireRole';

export default function InstitutionDashboardPage() {
  return (
    <RequireRole allow={["institution","admin","super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<InstitutionDashboardSkeleton />}>
            <InstitutionDashboard />
          </Suspense>
        </div>
      </div>
    </RequireRole>
  );
}
