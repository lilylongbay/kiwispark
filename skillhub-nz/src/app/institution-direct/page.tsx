import { Suspense } from 'react';
import InstitutionDashboard from '@/components/institution/InstitutionDashboard';
import { InstitutionDashboardSkeleton } from '@/components/institution/InstitutionDashboardSkeleton';

export default function InstitutionDirectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<InstitutionDashboardSkeleton />}>
          <InstitutionDashboard />
        </Suspense>
      </div>
    </div>
  );
}
