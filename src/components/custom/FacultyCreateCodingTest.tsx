import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,   
} from "@/components/ui/select"

import axios from 'axios'
import { Textarea } from '../ui/textarea'
import { DatePicker } from '../ui/datePicker'
import { toast } from '@/hooks/use-toast'
import { Base_Url } from "../../../utils/url";

// Interfaces
interface Ques {
  _id: string;
  QuesName: string;
  DifficultyLevel: string;
  QuesDescrition: string;
  selected: boolean;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      data?: string;
    };
  };
}


interface datainter {
  TestName: string;
  TestDescription: string;
  AttemptDate: number;
  Hide: string;
  Branch: string;
  Year: string;
}

function FacultyCreateCodingTest() {
  const [Questions, Setquestions] = useState<Ques[]>([])
  const [Page, SetPage] = useState<number>(0)
  const [SelectedQuestions, SetSelectedQuestions] = useState<Ques[]>([])
  const [Startdate, setStartDate] = useState<Date>()
  const [Enddate, setEndDate] = useState<Date>()
  const [Data, Setdata] = useState<datainter>({
    TestName: "",
    TestDescription: "",
    AttemptDate: 0,
    Hide: "false",
    Branch: "",
    Year: ""
  })

  const HandleSubmit = async () => {
    try {
      const payload = {
        TestName: Data.TestName,
        TestDescription: Data.TestDescription,
        AttemptTime: Data.AttemptDate,
        TestExpireTime: Enddate,
        TestStartTime: Startdate,
        Hide: Data.Hide,
        Branch: Data.Branch,
        Year: Data.Year,
        Questions: [] as string[],
        TotalMarks: 0
      }

      if (!payload.TestName || !payload.TestDescription || !payload.AttemptTime || !payload.TestStartTime || !payload.TestExpireTime) {
        return toast({ title: "Fill all the detials", description: "Please fill all th detils" })
      }

      SelectedQuestions.forEach((elem) => {
        payload.Questions.push(elem._id)
        if (elem.DifficultyLevel === "Easy") {
          payload.TotalMarks += 5
        } else if (elem.DifficultyLevel === "Medium") {
          payload.TotalMarks += 10
        } else {
          payload.TotalMarks += 15
        }
      })

      const res = await axios.post(`${Base_Url}/Faculty-test-hub/Faculty/CreateCodeTest`, payload, { withCredentials: true })
      console.log(res)

      return toast({ title: "Sucessfully", description: "Sucessfully created the code test" })

    } catch (err) {
       const error = err as AxiosErrorResponse;
      return toast({ title: error?.response?.data?.message??"sds", description: error?.response?.data?.data })
    }
  }

  const HandleDate = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    Setdata({ ...Data, [e.target.name]: e.target.value })
  }

  const HandleSelect = (index: number) => {
    const temp = [...Questions]
    temp[index].selected = !temp[index].selected

    if (temp[index].selected) {
      SetSelectedQuestions([...SelectedQuestions, temp[index]])
    } else {
      const filteredQuestions = SelectedQuestions.filter(q => q._id !== temp[index]._id)
      SetSelectedQuestions(filteredQuestions)
    }

    Setquestions(temp)
  }

  const GetAllQuestions = async () => {
    const res = await axios.get(`${Base_Url}/Faculty-test-hub/Faculty/CodeQuestions/${Page}`, { withCredentials: true })

    res.data.data.forEach((element: Ques) => {
      element.selected = false
      SelectedQuestions.forEach((value) => {
        if (value._id === element._id) {
          element.selected = true
        }
      })
    })

    Setquestions([...res.data.data])
  }

  useEffect(() => {
    GetAllQuestions()
  }, [Page])

  return (
    <div>
      <Card className='w-[70rem] border-black dark:border-white'>
        <CardHeader>
          <CardTitle>Crete Coding Test</CardTitle>
          <CardDescription>Create Coding test (please fill all the details)</CardDescription>
        </CardHeader>

        <CardContent>
          <label>
            Test name*
            <Input onChange={HandleDate} name='TestName' value={Data.TestName} placeholder='Enter the test name' />
          </label>
        </CardContent>

        <CardContent>
          <label>
            Test description*
            <Textarea onChange={HandleDate} name='TestDescription' value={Data.TestDescription} placeholder='Enter the test description' />
          </label>
        </CardContent>

        <CardContent>
          <label className='flex flex-col'>
            Test start date*
            <DatePicker setDate={setStartDate} date={Startdate} />
          </label>
        </CardContent>

        <CardContent>
          <label className='flex flex-col'>
            Test end date*
            <DatePicker setDate={setEndDate} date={Enddate} />
          </label>
        </CardContent>

        <CardContent>
          <label className='flex flex-col'>
            Attemp time (Enter time in hours)*
            <Input type='number' onChange={HandleDate} value={Data.AttemptDate} name="AttemptDate" placeholder='Enter the time in hours number only' />
          </label>
        </CardContent>

        <CardContent>
          <label>
            Branch
            <Select onValueChange={(value) => Setdata({ ...Data, Branch: value })}>
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
            <Select onValueChange={(value) => Setdata({ ...Data, Year: value })}>
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
            Hide Results from Students
            <Select onValueChange={(value) => Setdata({ ...Data, Hide: value })}>
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
          <label>Question for Test*
            <Input placeholder='Search with Question Name' />
          </label>
          <Table>
            <TableCaption>Select the question to provide in the Test</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Question Name</TableHead>
                <TableHead>Question Level</TableHead>
                <TableHead>Question Descriptions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Questions.map((elem, index) => (
                <TableRow key={index} onClick={() => HandleSelect(index)}>
                  <TableCell><Checkbox checked={elem.selected} /></TableCell>
                  <TableCell>{elem.QuesName}</TableCell>
                  <TableCell>{elem.DifficultyLevel}</TableCell>
                  <TableCell className='overflow-hidden'>{elem.QuesDescrition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='flex justify-around gap-1 mt-2'>
            <Button onClick={() => SetPage(Page - 1)}>Prev</Button>
            <Button onClick={() => SetPage(Page + 1)}>Next</Button>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={HandleSubmit}>Create Coding Test</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FacultyCreateCodingTest
