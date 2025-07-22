export type Member = {
  id: string;
  name: string;
  department: string;
  role: string;
};

export type AttendanceRecord = {
  memberId: string;
  date: string; // YYYY-MM-DD format
};
