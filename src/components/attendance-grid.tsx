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
import { Check, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Member, AttendanceRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import { isBefore, parseISO } from 'date-fns';

interface AttendanceGridProps {
  members: Member[];
  attendance: AttendanceRecord[];
  days: number;
  month: number;
  year: number;
}

export function AttendanceGrid({ members, attendance, days, month, year }: AttendanceGridProps) {
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
        <p className="text-muted-foreground">No members to display for this page.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <ScrollArea className="w-full rounded-md border">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-card">
              <TableHead className="sticky left-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                Member
              </TableHead>
              {Array.from({ length: days }, (_, i) => i + 1).map((day) => (
                <TableHead key={day} className="w-12 text-center">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="sticky left-0 z-10 font-medium bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                  {member.name}
                </TableCell>
                {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                  const dayDate = new Date(year, month - 1, day);
                  const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  
                  // Check if the date is before the member's join date
                  if (member.joinDate && isBefore(dayDate, parseISO(member.joinDate))) {
                    return <TableCell key={day} className="p-0 text-center bg-muted/20"></TableCell>;
                  }
                  
                  const isPresent = attendanceMap.get(date)?.has(member.id) ?? false;
                  
                  return (
                    <TableCell key={day} className="p-0 text-center">
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                           <div className={cn(
                            "flex h-full w-full items-center justify-center p-2",
                             isPresent ? 'bg-accent/20' : 'bg-muted/50'
                          )}>
                            {isPresent ? (
                              <Check className="h-5 w-5 text-accent-foreground" style={{color: '#29B6F6'}}/>
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground" style={{color: '#90CAF9'}} />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{member.name}</p>
                          <p>{new Date(date).toLocaleDateString()}: {isPresent ? 'Present' : 'Absent'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </TooltipProvider>
  );
}
