import { Suspense } from 'react';
import CoachManagementForm from '@/components/institution/CoachManagementForm';
import { CoachManagementSkeleton } from '@/components/institution/CoachManagementSkeleton';

export default function NewCoachPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<CoachManagementSkeleton />}>
          <CoachManagementForm />
        </Suspense>
      </div>
    </div>
  );
}
