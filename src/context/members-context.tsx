'use client';

import React, { createContext, ReactNode } from 'react';
import type { Member } from '@/lib/types';
import { members as initialMembers } from '@/lib/data';
import { usePersistence } from '@/hooks/use-persistence';
import { logAuditEvent } from '@/lib/audit';

interface MembersContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;
  isLoading: boolean;
}

export const MembersContext = createContext<MembersContextType>({
  members: [],
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  isLoading: true,
});

const sortMembers = (m: Member[]) => [...m].sort((a, b) => a.name.localeCompare(b.name));

export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers, isLoading] = usePersistence<Member[]>('attendease_members', initialMembers, sortMembers);

  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    setMembers((prev) => sortMembers([...prev, newMember]));
    logAuditEvent('ADD_MEMBER', { member: newMember });
  };

  const updateMember = (updatedMember: Member) => {
    setMembers((prev) =>
      sortMembers(prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
    );
    logAuditEvent('UPDATE_MEMBER', { memberId: updatedMember.id });
  };

  const deleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    logAuditEvent('DELETE_MEMBER', { memberId });
  };

  return (
    <MembersContext.Provider
      value={{ members, addMember, updateMember, deleteMember, isLoading }}
    >
      {children}
    </MembersContext.Provider>
  );
};
