export type Member = {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string; // YYYY-MM-DD format
};

export type AttendanceRecord = {
  id?: string; // Optional: The doc ID from Firestore, which is the date string YYYY-MM-DD
  memberId: string;
  date: string; // YYYY-MM-DD format
  status: 'P' | 'A';
};
