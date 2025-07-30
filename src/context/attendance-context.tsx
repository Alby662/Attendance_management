'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { AttendanceRecord } from '@/lib/types';
import { attendanceRecords as initialAttendance } from '@/lib/data';
import { usePersistence } from '@/hooks/use-persistence';
import { MembersContext } from './members-context';
import { logAuditEvent } from '@/lib/audit';

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  toggleAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  isLoading: boolean;
}

export const AttendanceContext = createContext<AttendanceContextType>({
  attendance: [],
  addAttendanceRecord: () => {},
  toggleAttendance: () => {},
  isLoading: true,
});

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const { members } = useContext(MembersContext);
  const [attendance, setAttendance, isLoading] = usePersistence<AttendanceRecord[]>('attendease_attendance', initialAttendance);

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendance((prev) => {
      const existing = prev.find(r => r.memberId === record.memberId && r.date === record.date);
      if (existing) {
        return prev;
      }
      const newRecord = [...prev, record];
      logAuditEvent('ADD_ATTENDANCE', { record });
      return newRecord;
    });
  };

  const toggleAttendance = (record: AttendanceRecord) => {
    setAttendance((prev) => {
      const existingIndex = prev.findIndex(r => r.memberId === record.memberId && r.date === record.date);
      if (existingIndex > -1) {
        // Record exists, so remove it (mark as absent)
        const newAttendance = [...prev];
        newAttendance.splice(existingIndex, 1);
        logAuditEvent('REMOVE_ATTENDANCE', { record });
        return newAttendance;
      } else {
        // Record does not exist, so add it (mark as present)
        logAuditEvent('ADD_ATTENDANCE', { record });
        return [...prev, record];
      }
    });
  };
  
  // This effect ensures that when a member is deleted, their attendance records are also cleaned up.
  React.useEffect(() => {
    if (isLoading) return;
    const memberIds = new Set(members.map(m => m.id));
    const filteredAttendance = attendance.filter(rec => memberIds.has(rec.memberId));
    if(filteredAttendance.length < attendance.length) {
        setAttendance(filteredAttendance);
    }
  }, [members, attendance, setAttendance, isLoading]);

  return (
    <AttendanceContext.Provider
      value={{ attendance, addAttendanceRecord, toggleAttendance, isLoading }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
