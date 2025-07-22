import { AttendanceTracker } from "@/components/attendance-tracker";
import { members, attendanceRecords } from "@/lib/data";

export default function Home() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Daily Attendance</h1>
        <p className="text-muted-foreground">{dateString}</p>
      </div>
      <AttendanceTracker members={members} initialAttendance={attendanceRecords} />
    </div>
  );
}
