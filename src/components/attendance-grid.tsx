'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Member, AttendanceRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import { isBefore, parseISO, getDay, format } from 'date-fns';

interface AttendanceGridProps {
  members: Member[];
  attendance: AttendanceRecord[];
  days: number[];
  month: number;
  year: number;
  onCellClick?: (memberId: string, date: string, status: 'P' | 'A') => void;
}

export function AttendanceGrid({ members, attendance, days, month, year, onCellClick }: AttendanceGridProps) {
  const attendanceMap = new Map<string, Set<string>>();
  attendance.forEach(rec => {
    if (!attendanceMap.has(rec.date)) {
      attendanceMap.set(rec.date, new Set());
    }
    attendanceMap.get(rec.date)?.add(rec.memberId);
  });

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
        <p className="text-muted-foreground">No members to display.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full rounded-md border print:border-0">
      <Table className="min-w-full border-collapse">
        <TableHeader>
          <TableRow className="hover:bg-card">
            <TableHead className="sticky left-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 print:bg-white">
              Member
            </TableHead>
            {days.map((day) => {
              const dayDate = new Date(year, month - 1, day);
              const dayOfWeek = getDay(dayDate); // 0 for Sunday, 6 for Saturday
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              return (
                <TableHead key={day} className={cn("w-20 text-center", isWeekend && "bg-red-50/50 print:bg-red-50")}>
                  {day} <br/> {format(dayDate, 'E')}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="sticky left-0 z-10 font-medium bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 print:bg-white">
                {member.name}
              </TableCell>
              {days.map((day) => {
                const dayDate = new Date(year, month - 1, day);
                const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const dayOfWeek = getDay(dayDate);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                if (member.joinDate && isBefore(dayDate, parseISO(member.joinDate))) {
                  return <TableCell key={day} className="text-center bg-muted/20"></TableCell>;
                }
                
                if (isWeekend) {
                   return <TableCell key={day} className="text-center bg-red-50/50 print:bg-red-50 text-muted-foreground">--</TableCell>;
                }

                const isPresent = attendanceMap.get(date)?.has(member.id) ?? false;
                
                return (
                  <TableCell 
                    key={day} 
                    className={cn(
                      "text-center font-semibold",
                       isPresent ? 'text-primary' : 'text-destructive/80',
                       onCellClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onCellClick?.(member.id, date, isPresent ? 'A' : 'P')}
                  >
                      {isPresent ? 'P' : 'A'}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" className="print:hidden" />
    </ScrollArea>
  );
}
