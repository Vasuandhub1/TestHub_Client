import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Student_Base_URL } from "../../../utils/url.ts";

// Interface for Test ID
interface TestMeta {
  TestName: string;
  TestType: "MCQ" | "Code" | string;
  TestStartTime?: string;
}

// Interface for Result
interface TestResult {
  _id: string;
  TestId: TestMeta;
  TotalMarksObtained: number;
  TotalMarks: number;
}

export default function StudentResults() {
  const [results, setResults] = useState<TestResult[]>([]);

  const getAllResults = async () => {
    try {
      const res = await axios.get(`${Student_Base_URL}/StudentResult`, {
        withCredentials: true,
      });

      const mcq: TestResult[] = res?.data?.data?.mcq || [];
      const code: TestResult[] = res?.data?.data?.code || [];
      setResults([...code, ...mcq]);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching results:", error?.response?.data?.message || err);
    }
  };

  useEffect(() => {
    getAllResults();
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <Card className="border-black dark:border-slate-600">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="border-black dark:border-slate-600">
            <TableHeader>
              <TableRow className="border-black dark:border-slate-600">
                <TableHead>Test Name</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((test, index) => (
                <TableRow key={test._id || index} className="border-black dark:border-slate-600">
                  <TableCell>{test.TestId?.TestName || "N/A"}</TableCell>
                  <TableCell>{test.TestId?.TestType || "N/A"}</TableCell>
                  <TableCell>{test.TotalMarksObtained ?? "N/A"}</TableCell>
                  <TableCell>{test.TotalMarks ?? "N/A"}</TableCell>
                  <TableCell>
                    {test.TestId?.TestStartTime
                      ? new Date(test.TestId.TestStartTime).toLocaleString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
