import { MembersClient } from "@/components/members-client";
import { members } from "@/lib/data";

export default function MembersPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Members</h1>
        <p className="text-muted-foreground">Add, edit, or remove member profiles.</p>
      </div>
      <MembersClient initialMembers={members} />
    </div>
  );
}
