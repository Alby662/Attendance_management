'use client';

import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AttendanceRecord } from '@/lib/types';
import { logAuditEvent } from '@/lib/audit';

interface AttendanceContextType {
  attendance: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  toggleAttendance: (record: { memberId: string; date: string }) => Promise<void>;
  isLoading: boolean;
}

export const AttendanceContext = createContext<AttendanceContextType>({
  attendance: [],
  addAttendanceRecord: async () => {},
  toggleAttendance: async () => {},
  isLoading: true,
});

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'attendance'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const attendanceData: AttendanceRecord[] = [];
      querySnapshot.forEach((doc) => {
        attendanceData.push({ id: doc.id, ...doc.data() } as AttendanceRecord);
      });
      setAttendance(attendanceData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching attendance:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id'>) => {
    // Check if record already exists
    const q = query(collection(db, 'attendance'), where('memberId', '==', record.memberId), where('date', '==', record.date));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      try {
        const docRef = await addDoc(collection(db, 'attendance'), record);
        logAuditEvent('ADD_ATTENDANCE', { recordId: docRef.id, ...record });
      } catch (e) {
        console.error("Error adding attendance record: ", e);
      }
    }
  };

  const toggleAttendance = async (record: { memberId: string; date: string }) => {
    const { memberId, date } = record;
    const q = query(collection(db, 'attendance'), where('memberId', '==', memberId), where('date', '==', date));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Record does not exist, so add it (mark as present)
        await addDoc(collection(db, 'attendance'), record);
        logAuditEvent('ADD_ATTENDANCE', { record });
      } else {
        // Record exists, so remove it (mark as absent)
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, 'attendance', docId));
        logAuditEvent('REMOVE_ATTENDANCE', { record });
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
