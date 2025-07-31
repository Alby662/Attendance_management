'use client';

import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Member } from '@/lib/types';
import { logAuditEvent } from '@/lib/audit';

interface MembersContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  isLoading: boolean;
}

export const MembersContext = createContext<MembersContextType>({
  members: [],
  addMember: async () => {},
  updateMember: async () => {},
  deleteMember: async () => {},
  isLoading: true,
});

export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const membersData: Member[] = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(membersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching members:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMember = async (member: Omit<Member, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'members'), member);
      logAuditEvent('ADD_MEMBER', { memberId: docRef.id, ...member });
    } catch (e) {
      console.error("Error adding member: ", e);
    }
  };

  const updateMember = async (updatedMember: Member) => {
    const memberDocRef = doc(db, 'members', updatedMember.id);
    try {
      // Omit the 'id' field from the data being sent to Firestore
      const { id, ...memberData } = updatedMember;
      await updateDoc(memberDocRef, memberData);
      logAuditEvent('UPDATE_MEMBER', { memberId: id });
    } catch (e) {
      console.error("Error updating member: ", e);
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, 'members', memberId));
      logAuditEvent('DELETE_MEMBER', { memberId });
    } catch (e) {
      console.error("Error deleting member: ", e);
    }
  };

  return (
    <MembersContext.Provider
      value={{ members, addMember, updateMember, deleteMember, isLoading }}
    >
      {children}
    </MembersContext.Provider>
  );
};
