'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Member } from '@/lib/types';
import { MemberActions } from './member-actions';

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export function MemberTable({ members, onEdit, onDelete }: MemberTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role/Year</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <MemberActions
                    onEdit={() => onEdit(member)}
                    onDelete={() => onDelete(member.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
