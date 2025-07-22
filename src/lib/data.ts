import type { Member, AttendanceRecord } from './types';
import { subDays, format } from 'date-fns';

export const members: Member[] = [
  { id: '1', name: 'Alice Johnson', department: 'Engineering', role: 'Software Engineer', joinDate: '2023-01-15' },
  { id: '2', name: 'Bob Williams', department: 'Design', role: 'UX Designer', joinDate: '2023-02-20' },
  { id: '3', name: 'Charlie Brown', department: 'Product', role: 'Product Manager', joinDate: '2023-03-10' },
  { id: '4', name: 'Diana Prince', department: 'Marketing', role: 'Marketing Lead', joinDate: '2023-04-05' },
  { id: '5', name: 'Ethan Hunt', department: 'Engineering', role: 'QA Tester', joinDate: '2023-05-25' },
  { id: '6', name: 'Fiona Glenanne', department: 'HR', role: 'HR Manager', joinDate: '2023-06-12' },
  { id: '7', name: 'George Costanza', department: 'Sales', role: 'Sales Associate', joinDate: '2023-07-18' },
  { id: '8', name: 'Hannah Abbott', department: 'Engineering', role: 'DevOps Engineer', joinDate: '2023-08-22' },
];

const today = new Date();
const attendance: AttendanceRecord[] = [];
for (let i = 0; i < 90; i++) { // Generate for more days
  const date = subDays(today, i);
  const dateString = format(date, 'yyyy-MM-dd');

  members.forEach(member => {
    // Only generate attendance if the date is on or after join date
    if (new Date(dateString) >= new Date(member.joinDate)) {
      // ~80% chance of being present
      if (Math.random() > 0.2) {
        attendance.push({ memberId: member.id, date: dateString });
      }
    }
  });
}

export const attendanceRecords: AttendanceRecord[] = attendance;
