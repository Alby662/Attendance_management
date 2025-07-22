import type { Member, AttendanceRecord } from './types';

export const members: Member[] = [
  { id: '1', name: 'Alice Johnson', department: 'Engineering', role: 'Software Engineer' },
  { id: '2', name: 'Bob Williams', department: 'Design', role: 'UX Designer' },
  { id: '3', name: 'Charlie Brown', department: 'Product', role: 'Product Manager' },
  { id: '4', name: 'Diana Prince', department: 'Marketing', role: 'Marketing Lead' },
  { id: '5', name: 'Ethan Hunt', department: 'Engineering', role: 'QA Tester' },
  { id: '6', name: 'Fiona Glenanne', department: 'HR', role: 'HR Manager' },
  { id: '7', name: 'George Costanza', department: 'Sales', role: 'Sales Associate' },
  { id: '8', name: 'Hannah Abbott', department: 'Engineering', role: 'DevOps Engineer' },
];

// Generate some random attendance data for the last 30 days
const today = new Date();
const attendance: AttendanceRecord[] = [];
for (let i = 0; i < 30; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() - i);
  const dateString = date.toISOString().split('T')[0];

  members.forEach(member => {
    // ~80% chance of being present
    if (Math.random() > 0.2) {
      attendance.push({ memberId: member.id, date: dateString });
    }
  });
}

export const attendanceRecords: AttendanceRecord[] = attendance;
