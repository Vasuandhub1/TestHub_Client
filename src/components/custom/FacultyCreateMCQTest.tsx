import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from 'axios';
import { Textarea } from '../ui/textarea';
import { DatePicker } from '../ui/datePicker';
import { toast } from '@/hooks/use-toast';
import { Base_Url } from "../../../utils/url";

interface Subject {
  _id: string;
  Sname: string;
}

interface Ques {
  _id: string;
  QuesName: string;
  SubjectName: string;
  questionType: string;
  QuesDescription: string;
  selected: boolean;
  Options: string[];
}

interface DataInter {
  TestName: string;
  TestDescription: string;
  AttemptDate: number;
  subject: string;
  Branch: string;
  Year: string;
  Hide: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      data?: string;
    };
  };
}

function FacultyCreateMCQTest() {
  const [Questions, Setquestions] = useState<Ques[]>([]);
  const [Page, SetPage] = useState(0);
  const [SelectedQuestions, SetSelectedQuestions] = useState<Ques[]>([]);
  const [Startdate, setStartDate] = useState<Date>();
  const [Enddate, setEndDate] = useState<Date>();
  const [Subjects, SetSubjects] = useState<Subject[]>([]);
  const [Data, Setdata] = useState<DataInter>({
    TestName: "",
    TestDescription: "",
    AttemptDate: 0,
    subject: "All",
    Branch: "",
    Year: "",
    Hide: "false",
  });

  const HandleSubmit = async () => {
    try {
      const payload = {
        TestName: Data.TestName,
        TestDescription: Data.TestDescription,
        AttemptTime: Data.AttemptDate,
        TestExpireTime: Enddate,
        TestStartTime: Startdate,
        Subject: Data.subject,
        Branch: Data.Branch,
        Year: Data.Year,
        Questions: [] as string[],
        TotalMarks: 0,
        Hide: Data.Hide,
      };

      if (
        !payload.TestName ||
        !payload.TestDescription ||
        !payload.AttemptTime ||
        !payload.TestStartTime ||
        !payload.TestExpireTime ||
        SelectedQuestions.length === 0
      ) {
        return toast({
          title: "Fill all the details",
          description: "Please fill all the required fields",
        });
      }

      SelectedQuestions.forEach((elem) => {
        payload.Questions.push(elem._id);
        payload.TotalMarks += 2;
      });

      await axios.post(`${Base_Url}/Faculty-test-hub/Faculty/CreateMCQTest`, payload, {
        withCredentials: true,
      });

      toast({ title: "Success", description: "Successfully created the MCQ test" });
    } catch (err) {
      const error = err as AxiosErrorResponse
      console.log(err);
      toast({
        title: error?.response?.data?.message || "Error",
        description: error?.response?.data?.data || "Something went wrong",
      });
    }
  };

  const HandleDate = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    Setdata({ ...Data, [e.target.name]: e.target.value });
  };

  const HandleSelect = (index: number) => {
    const temp = [...Questions];
    temp[index].selected = !temp[index].selected;

    if (temp[index].selected) {
      SetSelectedQuestions([...SelectedQuestions, temp[index]]);
    } else {
      const filtered = SelectedQuestions.filter((q) => q._id !== temp[index]._id);
      SetSelectedQuestions(filtered);
    }
    Setquestions(temp);
  };

  const GetAllQuestions = async (value = "All") => {
    const res = await axios.get(
      `${Base_Url}/Faculty-test-hub/Faculty/GetMCQquestion/${value}`,
      { withCredentials: true }
    );

    const updated = res.data.data.map((q: Ques) => ({
      ...q,
      selected: SelectedQuestions.some((sel) => sel._id === q._id),
    }));

    Setquestions(updated);
  };

  const GetAllSubjects = async () => {
    try {
      const res = await axios.get(`${Base_Url}/Faculty-test-hub/Faculty/Subjects`, {
        withCredentials: true,
      });
      SetSubjects(res?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetAllSubjects();
    GetAllQuestions(Data.subject);
  }, [Page]);

  return (
    <div>
      <Card className="w-[70rem] border-black dark:border-white">
        <CardHeader>
          <CardTitle>Create MCQ Test</CardTitle>
          <CardDescription>Create MCQ test (please fill all the details)</CardDescription>
        </CardHeader>

        <CardContent>
          <label>
            Test name*
            <Input
              onChange={HandleDate}
              name="TestName"
              value={Data.TestName}
              placeholder="Enter the test name"
            />
          </label>
        </CardContent>

        <CardContent>
          <label>
            Test description*
            <Textarea
              onChange={HandleDate}
              name="TestDescription"
              value={Data.TestDescription}
              placeholder="Enter the test description"
            />
          </label>
        </CardContent>

        <CardContent>
          <label className="flex flex-col">
            Test start date*
            <DatePicker setDate={setStartDate} date={Startdate} />
          </label>
        </CardContent>

        <CardContent>
          <label className="flex flex-col">
            Test end date*
            <DatePicker setDate={setEndDate} date={Enddate} />
          </label>
        </CardContent>

        <CardContent>
          <label className="flex flex-col">
            Attempt time (hours)*
            <Input
              type="number"
              onChange={HandleDate}
              value={Data.AttemptDate}
              name="AttemptDate"
              placeholder="Enter time in hours"
            />
          </label>
        </CardContent>

        <CardContent>
          <label>
            Branch
            <Select onValueChange={(val) => Setdata({ ...Data, Branch: val })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="CIVIL">CIVIL</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="AI & DS">AI & DS</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>

        <CardContent>
          <label>
            Year
            <Select onValueChange={(val) => Setdata({ ...Data, Year: val })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>

        <CardContent>
          <label>
            Subject
            <Select
              defaultValue="All"
              onValueChange={(val) => {
                Setdata({ ...Data, subject: val });
                GetAllQuestions(val);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {Subjects.map((elem, index) => (
                  <SelectItem key={index} value={elem._id}>
                    {elem.Sname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </CardContent>

        <CardContent>
          <label>
            Hide Results from Students
            <Select onValueChange={(val) => Setdata({ ...Data, Hide: val })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Hide" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </CardContent>

        <CardContent>
          <label>Questions for Test*</label>
          <Input placeholder="Search by question name" />
          <Table>
            <TableCaption>Select the questions to provide in the test</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Questions.map((q, i) => (
                <TableRow key={i} onClick={() => HandleSelect(i)}>
                  <TableCell>
                    <Checkbox checked={q.selected} />
                  </TableCell>
                  <TableCell>{q.QuesDescription}</TableCell>
                  <TableCell>{q.questionType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <div className="flex justify-around mt-2">
              <Button onClick={() => SetPage((p) => Math.max(p - 1, 0))}>Prev</Button>
              <Button onClick={() => SetPage((p) => p + 1)}>Next</Button>
            </div>
          </Table>
        </CardContent>

        <CardFooter>
          <Button onClick={HandleSubmit}>Create MCQ Test</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FacultyCreateMCQTest;
