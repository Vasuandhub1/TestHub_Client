import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '../ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { Base_Url } from "../../../utils/url"

// Interfaces
interface Question {
  QuestionDescription: string;
  Subject: string;
  Option1: string;
  Option2: string;
  Option3: string;
  Option4: string;
  CorrectAns: string;
}

interface Subject {
  _id: string;
  Sname: string;
}

function FacultyCreateMCQQuestion() {
  const [data, Setdata] = useState<Question>({
    QuestionDescription: "",
    Subject: "",
    Option1: "",
    Option2: "",
    Option3: "",
    Option4: "",
    CorrectAns: ""
  })

  const [Subjects, SetSubjects] = useState<Subject[]>([])

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    Setdata({ ...data, [e.target.name]: e.target.value })
  }

  const getAllSubjects = async () => {
    try {
      const res = await axios.get(`${Base_Url}/Faculty-test-hub/Faculty/Subjects`, {
        withCredentials: true
      })
      SetSubjects(res?.data?.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreateCodeQuestion = async () => {
    const payload = {
      QuestionDescription: data.QuestionDescription,
      subject: data.Subject,
      options: [data.Option1, data.Option2, data.Option3, data.Option4],
      CorrectOption: data.CorrectAns
    }

    await axios
      .post(`${Base_Url}/Faculty-test-hub/Faculty/CreateMCQQuestions`, payload, {
        withCredentials: true
      })
      .then(() => {
        toast({ title: "Sucessfull", description: "Sucessfully created the question" })
        Setdata({
          QuestionDescription: "",
          Subject: "",
          Option1: "",
          Option2: "",
          Option3: "",
          Option4: "",
          CorrectAns: ""
        })
      })
      .catch((err) => {
        console.log(err)
        toast({
          title: err?.response?.data?.message,
          description: err?.response?.data?.data
        })
      })
  }

  useEffect(() => {
    getAllSubjects()
  }, [])

  return (
    <Card className='w-[70rem] border-black dark:border-white'>
      <CardHeader>
        <CardTitle>Create MCQ Question</CardTitle>
        <CardDescription>
          This (Multiple choice Question) question will be added to the MCQ Question Bank
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Card className='border-black dark:border-white'>
          <CardHeader>
            <CardTitle>MCQ Question Details</CardTitle>
            <CardDescription>Please fill all the Details</CardDescription>
          </CardHeader>

          <CardContent>
            <label>
              Question description *
              <Textarea
                onChange={handelChange}
                value={data.QuestionDescription}
                name="QuestionDescription"
                placeholder='Enter question description here...'
              />
            </label>
          </CardContent>

          <CardContent>
            <label>
              Correct Answer *
              <Select onValueChange={(val) => Setdata({ ...data, CorrectAns: val })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Correct Ans *</SelectLabel>
                    <SelectItem value='1'>1</SelectItem>
                    <SelectItem value='2'>2</SelectItem>
                    <SelectItem value='3'>3</SelectItem>
                    <SelectItem value='4'>4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          </CardContent>

          <CardContent>
            <label>
              Question Subject *
              <Select onValueChange={(val) => Setdata({ ...data, Subject: val })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>
                    {Subjects.map((elem, index) => (
                      <SelectItem value={elem._id} key={index}>
                        {elem.Sname}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          </CardContent>

          <CardContent>
            <label>
              Option - 1
              <Input onChange={handelChange} value={data.Option1} name="Option1" />
            </label>
          </CardContent>
          <CardContent>
            <label>
              Option - 2
              <Input onChange={handelChange} value={data.Option2} name="Option2" />
            </label>
          </CardContent>
          <CardContent>
            <label>
              Option - 3
              <Input onChange={handelChange} value={data.Option3} name="Option3" />
            </label>
          </CardContent>
          <CardContent>
            <label>
              Option - 4
              <Input onChange={handelChange} value={data.Option4} name="Option4" />
            </label>
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter>
        <Button onClick={handleCreateCodeQuestion}>Create</Button>
      </CardFooter>
    </Card>
  )
}

export default FacultyCreateMCQQuestion
