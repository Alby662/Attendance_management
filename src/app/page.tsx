'use client';

import { useState, useEffect } from 'react';
import { AttendanceTracker } from "@/components/attendance-tracker";

export default function Home() {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDateString(formattedDate);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Daily Attendance</h1>
        <p className="text-muted-foreground">{dateString || 'Loading...'}</p>
      </div>
      <AttendanceTracker />
    </div>
  );
}
