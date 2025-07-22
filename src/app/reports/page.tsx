'use client';

import { ReportGenerator } from "@/components/report-generator";

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Monthly Reports</h1>
        <p className="text-muted-foreground">Generate and export attendance reports for any month.</p>
      </div>
      <ReportGenerator />
    </div>
  );
}
