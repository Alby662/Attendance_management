'use client';

import { DashboardClient } from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Attendance Dashboard</h1>
        <p className="text-muted-foreground">Visualize attendance trends and statistics.</p>
      </div>
      <DashboardClient />
    </div>
  );
}
