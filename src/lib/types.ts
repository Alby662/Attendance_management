export type Member = {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string; // YYYY-MM-DD format
};

export type AttendanceRecord = {
  // This type represents a single user's status on a single day.
  // It is derived from the Firestore structure: attendance/{date}/users/{memberId}
  memberId: string;
  date: string; // YYYY-MM-DD format
  status: 'P' | 'A';
  name?: string; // Member's name, often stored with the record for convenience
};
