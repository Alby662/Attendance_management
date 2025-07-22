'use client';

import { useState, useEffect, useContext } from 'react';
import { Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppContext } from '@/context/app-context';

export function AttendanceTracker() {
  const { members, attendance, addAttendanceRecord } = useContext(AppContext);
  const [presentMembers, setPresentMembers] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const todayString = new Date().toISOString().split('T')[0];
    const todaysPresents = new Set(
      attendance.filter((rec) => rec.date === todayString).map((rec) => rec.memberId)
    );
    setPresentMembers(todaysPresents);
  }, [attendance]);

  const handleMarkPresent = (memberId: string) => {
    const todayString = new Date().toISOString().split('T')[0];
    addAttendanceRecord({ memberId, date: todayString });
    setPresentMembers((prev) => new Set(prev).add(memberId));
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%] md:w-[40%]">Member</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isPresent = presentMembers.has(member.id);
                return (
                  <TableRow key={member.id} className="transition-colors hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${encodeURIComponent(member.name.charAt(0))}`} alt={member.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{member.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.department}</TableCell>
                    <TableCell className="text-right">
                      {isPresent ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-foreground">
                          <Check className="h-4 w-4 text-accent" />
                          Present
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPresent(member.id)}
                          className="transition-all duration-300 ease-in-out hover:bg-secondary hover:text-secondary-foreground"
                        >
                          Mark Present
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
