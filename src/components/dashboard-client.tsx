'use client';

import { useState, useContext, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MembersContext } from '@/context/members-context';
import { AttendanceContext } from '@/context/attendance-context';
import { format, getDaysInMonth, subDays, getDay, isAfter, parseISO } from 'date-fns';

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(0, i), 'MMMM'),
}));

export function DashboardClient() {
  const { members, isLoading: isMembersLoading } = useContext(MembersContext);
  const { attendance, isLoading: isAttendanceLoading } = useContext(AttendanceContext);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());

  const isLoading = isMembersLoading || isAttendanceLoading;

  const monthlyAttendanceData = useMemo(() => {
    if (isLoading) return [];

    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const monthStr = selectedMonth.padStart(2, '0');
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const monthAttendance = attendance.filter(rec => rec.date.startsWith(`${year}-${monthStr}`));

    return members.map(member => {
      const memberJoinDate = parseISO(member.joinDate);
      let effectiveWorkingDays = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = getDay(date);
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isAfter(memberJoinDate, date)) {
          effectiveWorkingDays++;
        }
      }

      const presentCount = monthAttendance.filter(rec => rec.memberId === member.id && rec.status === 'P').length;
      const absentCount = effectiveWorkingDays - presentCount;
      
      return {
        name: member.name,
        Present: presentCount,
        Absent: absentCount < 0 ? 0 : absentCount,
      };
    });
  }, [members, attendance, selectedYear, selectedMonth, isLoading]);

  const historicalTrendData = useMemo(() => {
     if (isLoading) return [];

     const trendData = [];
     for (let i = 89; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayOfWeek = getDay(date);

        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const presentCount = attendance.filter(rec => rec.date === dateStr && rec.status === 'P').length;
        trendData.push({
            date: format(date, 'MMM d'),
            'Present Members': presentCount,
        });
     }
     return trendData;
  }, [attendance, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Monthly Attendance Summary</CardTitle>
              <CardDescription>Present vs. Absent days for each member.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="hsl(var(--primary))" />
              <Bar dataKey="Absent" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
         <CardHeader>
            <CardTitle>Overall Attendance Trend</CardTitle>
            <CardDescription>Daily number of present members over the last 90 days.</CardDescription>
         </CardHeader>
         <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Present Members" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
    </div>
  );
}
