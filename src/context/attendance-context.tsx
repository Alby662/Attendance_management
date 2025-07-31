'use client';

import React, { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AttendanceRecord } from '@/lib/types';
import { logAuditEvent } from '@/lib/audit';
import { MembersContext } from './members-context';

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  addAttendanceRecord: (record: { memberId: string; date: string; status: 'P' }) => Promise<void>;
  toggleAttendance: (record: { memberId: string; date: string; status: 'P' | 'A' }) => Promise<void>;
  isLoading: boolean;
}

export const AttendanceContext = createContext<AttendanceContextType>({
  attendance: [],
  addAttendanceRecord: async () => {},
  toggleAttendance: async () => {},
  isLoading: true,
});

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const { members } = useContext(MembersContext);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This listener watches the top-level 'attendance' collection for new date documents.
    const attendanceCol = collection(db, 'attendance');

    const unsubscribe = onSnapshot(attendanceCol, async (snapshot) => {
      setIsLoading(true);
      const attendancePromises: Promise<AttendanceRecord[]>[] = snapshot.docs.map(async (dateDoc) => {
        const date = dateDoc.id;
        const usersCol = collection(db, `attendance/${date}/users`);
        const usersSnapshot = await getDocs(usersCol);
        
        return usersSnapshot.docs.map((userDoc) => {
          const userData = userDoc.data();
          return {
            date: date,
            memberId: userDoc.id,
            status: userData.status || 'A', // Default to Absent if status is missing
            name: userData.name,
          };
        });
      });

      const allAttendanceArrays = await Promise.all(attendancePromises);
      const flattenedAttendance = allAttendanceArrays.flat();
      
      setAttendance(flattenedAttendance);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching attendance:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const addAttendanceRecord = async (record: { memberId: string; date: string; status: 'P' }) => {
    const { memberId, date } = record;
    const member = members.find(m => m.id === memberId);
    if (!member) {
      console.error("Cannot add attendance for unknown member");
      return;
    }
    
    // Path: /attendance/{YYYY-MM-DD}/users/{memberId}
    const userDocRef = doc(db, `attendance/${date}/users/${memberId}`);
    try {
      await setDoc(userDocRef, { name: member.name, status: 'P' }, { merge: true });
      logAuditEvent('ADD_ATTENDANCE', { memberId, date, status: 'P' });
    } catch (e) {
      console.error("Error adding attendance record: ", e);
    }
  };

  const toggleAttendance = async (record: { memberId: string; date: string; status: 'P' | 'A' }) => {
    const { memberId, date, status } = record;
    const member = members.find(m => m.id === memberId);
    if (!member) {
      console.error("Cannot toggle attendance for unknown member");
      return;
    }
    const userDocRef = doc(db, `attendance/${date}/users/${memberId}`);
    
    try {
      if (status === 'P') { // If currently present, mark as absent (delete the record)
        await deleteDoc(userDocRef);
        logAuditEvent('REMOVE_ATTENDANCE', { memberId, date });
      } else { // If currently absent, mark as present (add/update the record)
        await setDoc(userDocRef, { name: member.name, status: 'P' }, { merge: true });
        logAuditEvent('ADD_ATTENDANCE', { memberId, date, status: 'P' });
      }
    } catch (e) {
      console.error("Error toggling attendance: ", e);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{ attendance, addAttendanceRecord, toggleAttendance, isLoading }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
