'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { Member, AttendanceRecord } from '@/lib/types';
import { members as initialMembers, attendanceRecords as initialAttendance } from '@/lib/data';

interface AppContextType {
  members: Member[];
  attendance: AttendanceRecord[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
}

export const AppContext = createContext<AppContextType>({
  members: [],
  attendance: [],
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addAttendanceRecord: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);

  const addMember = (member: Omit<Member, 'id'>) => {
    setMembers((prev) => [...prev, { ...member, id: Date.now().toString() }]);
  };

  const updateMember = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  const deleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    // Optional: also remove attendance records for the deleted member
    setAttendance((prev) => prev.filter((rec) => rec.memberId !== memberId));
  };
  
  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendance((prev) => {
      // Avoid duplicate records for the same member on the same day
      const existing = prev.find(r => r.memberId === record.memberId && r.date === record.date);
      if (existing) {
        return prev;
      }
      return [...prev, record];
    });
  };

  return (
    <AppContext.Provider
      value={{ members, attendance, addMember, updateMember, deleteMember, addAttendanceRecord }}
    >
      {children}
    </AppContext.Provider>
  );
};
