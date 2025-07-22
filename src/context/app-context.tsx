'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Member, AttendanceRecord } from '@/lib/types';
import { members as initialMembers, attendanceRecords as initialAttendance } from '@/lib/data';

interface AppContextType {
  members: Member[];
  attendance: AttendanceRecord[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType>({
  members: [],
  attendance: [],
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addAttendanceRecord: () => {},
  isLoading: true,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedMembers = localStorage.getItem('attendease_members');
      const storedAttendance = localStorage.getItem('attendease_attendance');

      if (storedMembers && storedAttendance) {
        setMembers(JSON.parse(storedMembers));
        setAttendance(JSON.parse(storedAttendance));
      } else {
        // First time load, use initial data
        setMembers(initialMembers);
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Fallback to initial data if localStorage fails
      setMembers(initialMembers);
      setAttendance(initialAttendance);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('attendease_members', JSON.stringify(members));
      } catch (error) {
        console.error("Failed to save members to localStorage", error);
      }
    }
  }, [members, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('attendease_attendance', JSON.stringify(attendance));
      } catch (error) {
        console.error("Failed to save attendance to localStorage", error);
      }
    }
  }, [attendance, isLoading]);


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
    setAttendance((prev) => prev.filter((rec) => rec.memberId !== memberId));
  };
  
  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendance((prev) => {
      const existing = prev.find(r => r.memberId === record.memberId && r.date === record.date);
      if (existing) {
        return prev;
      }
      return [...prev, record];
    });
  };

  return (
    <AppContext.Provider
      value={{ members, attendance, addMember, updateMember, deleteMember, addAttendanceRecord, isLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};
