"use client";
import { Suspense } from 'react';
import CoachManagementForm from '@/components/institution/CoachManagementForm';
import { CoachManagementSkeleton } from '@/components/institution/CoachManagementSkeleton';
import RequireRole from '@/components/auth/RequireRole';

export default function NewCoachPage() {
  return (
    <RequireRole allow={["institution","admin","super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<CoachManagementSkeleton />}>
            <CoachManagementForm />
          </Suspense>
        </div>
      </div>
    </RequireRole>
  );
}
