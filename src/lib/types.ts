export type Member = {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string; // YYYY-MM-DD format
};

export type AttendanceRecord = {
  id?: string; // Optional: The doc ID from Firestore
  memberId: string;
  date: string; // YYYY-MM-DD format
};
