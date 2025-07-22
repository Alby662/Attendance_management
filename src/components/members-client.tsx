'use client';

import { useState, useContext } from 'react';
import { PlusCircle } from 'lucide-react';

import type { Member } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberFormDialog } from '@/components/member-form-dialog';
import { MemberTable } from '@/components/member-table';
import { AppContext } from '@/context/app-context';

export function MembersClient() {
  const { members, addMember, updateMember, deleteMember } = useContext(AppContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteMember = (memberId: string) => {
    deleteMember(memberId);
  };

  const handleSaveMember = (memberData: Omit<Member, 'id'> & { id?: string }) => {
    if (memberData.id) {
      updateMember({ ...memberData, id: memberData.id });
    } else {
      addMember(memberData);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Member List</CardTitle>
            <Button onClick={handleAddMember}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MemberTable
            members={members}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        </CardContent>
      </Card>
      <MemberFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveMember}
        member={selectedMember}
      />
    </>
  );
}
