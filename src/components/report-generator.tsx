'use client';

import { useState } from 'react';
import { Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceGrid } from './attendance-grid';
import type { Member, AttendanceRecord } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface ReportGeneratorProps {
  allMembers: Member[];
  allAttendance: AttendanceRecord[];
}

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(0, i), 'MMMM'),
}));

const MEMBERS_PER_PAGE = 10;

export function ReportGenerator({ allMembers, allAttendance }: ReportGeneratorProps) {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [reportData, setReportData] = useState<{
    attendance: AttendanceRecord[];
    days: number;
    month: number;
    year: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleGenerateReport = () => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const monthStr = month.toString().padStart(2, '0');
    const filteredAttendance = allAttendance.filter((rec) =>
      rec.date.startsWith(`${year}-${monthStr}`)
    );
    
    setCurrentPage(1);
    setReportData({
      attendance: filteredAttendance,
      days: daysInMonth,
      month: month,
      year: year,
    });
  };
  
  const handleExport = (format: 'CSV' | 'PDF') => {
    toast({
      title: "Export Initiated",
      description: `Your ${format} export will be downloaded shortly. (This is a demo action)`,
    });
    console.log(`Exporting report as ${format}...`);
  }

  const totalPages = reportData ? Math.ceil(allMembers.length / MEMBERS_PER_PAGE) : 0;
  const paginatedMembers = reportData
    ? allMembers.slice((currentPage - 1) * MEMBERS_PER_PAGE, currentPage * MEMBERS_PER_PAGE)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-end">
          <div className="grid gap-2 sm:flex-1">
            <label htmlFor="year-select" className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:flex-1">
            <label htmlFor="month-select" className="text-sm font-medium">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month-select">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
            Generate
          </Button>
        </div>
      </CardHeader>
      {reportData && (
        <CardContent>
          <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row print:hidden">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
             <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={() => handleExport('CSV')}>
                 <FileText className="mr-2 h-4 w-4" /> Export as CSV
               </Button>
               <Button variant="outline" onClick={() => handleExport('PDF')}>
                 <Download className="mr-2 h-4 w-4" /> Export as PDF
               </Button>
            </div>
          </div>

          <div className="printable-area">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <div key={page} className={`page-break ${page === currentPage ? 'block' : 'hidden'} print:block`}>
                <div className="mb-4 hidden print:block">
                  <h2 className="text-2xl font-bold">Attendance Report - {months.find(m => m.value.toString() === selectedMonth)?.label} {selectedYear}</h2>
                  <p className="text-muted-foreground">Page {page} of {totalPages}</p>
                </div>
                <AttendanceGrid
                  members={allMembers.slice((page - 1) * MEMBERS_PER_PAGE, page * MEMBERS_PER_PAGE)}
                  attendance={reportData.attendance}
                  days={reportData.days}
                  month={reportData.month}
                  year={reportData.year}
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}