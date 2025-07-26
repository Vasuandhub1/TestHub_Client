import { useEffect, useState } from 'react'
import { Button } from "../src/components/ui/button"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from 'Redux/store'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { EndTest } from '../Redux/slices/MCQTestData'
import StudentMCQTest from "../src/components/custom/StudentMCQTest"
import { useNavigate } from 'react-router-dom'
import { Base_Url } from "../utils/url"

interface QuestionData {
  _id: string
  QuestionDescription: string
  options: string[]
}

function MCQTest() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const Questions: string[] = useSelector((state: RootState) => state.MCQTestData.Questions)

  const [CurrentQuestion, SetCurrentQuestion] = useState(0)

  const [Question, setQuestion] = useState<QuestionData>({
    _id: "",
    QuestionDescription: "",
    options: [],
  })

  const ExitTest = () => {
    dispatch(EndTest())
  }

  const SubmitteTest = async () => {
    try {
      const res = await axios.post(`${Base_Url}/student-test-hub/Student/TestCodeSubmit`, "", {
        withCredentials: true,
      })
      toast({ title: res?.data?.data?.message, description: res?.data?.data?.data })
      dispatch(EndTest())
      navigate("/StudentTests")
    } catch (err) {
      const error = err as AxiosError<{ message?: string; data?: string }>
      toast({ title: error?.response?.data?.message, description: error?.response?.data?.data })
    }
  }

  const GetQuestion = async () => {
    try {
      const res = await axios.get(`${Base_Url}/student-test-hub/Student/MCQQuestion/${Questions[CurrentQuestion]}`)
      setQuestion({
        _id: res.data.data._id,
        QuestionDescription: res.data.data.QuesDescription,
        options: [...res.data.data.options],
      })
    } catch (err) {
      const error = err as AxiosError<{ message?: string; data?: string }>
      toast({ title: error?.response?.data?.message, description: error?.response?.data?.data })
    }
  }

  useEffect(() => {
    GetQuestion()
    document.documentElement.requestFullscreen().catch(() => {})
  }, [CurrentQuestion])

  return (
    <div className="flex h-screen w-screen space-x-6 box-border">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-300 dark:bg-zinc-900 p-4">
        <h2 className="font-bold mb-4">Questions</h2>
        <ul className="space-y-5 p-4">
          {Questions.map((_, index) => (
            <li
              key={index}
              onClick={() => SetCurrentQuestion(index)}
              className={`p-1 rounded-md text-center cursor-pointer 
                ${
                  CurrentQuestion === index
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500"
                }`}
            >
              Question {index + 1}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <nav className="w-full bg-zinc-300 flex justify-between items-center dark:text-white text-black dark:bg-zinc-800 p-4 shadow-lg">
          <div className="font-bold">Test Name</div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (CurrentQuestion > 0) {
                  SetCurrentQuestion((prev) => prev - 1)
                } else {
                  toast({ title: "Reached at start Question" })
                }
              }}
            >
              Prev
            </Button>
            <Button
              onClick={() => {
                if (CurrentQuestion + 1 < Questions.length) {
                  SetCurrentQuestion((prev) => prev + 1)
                } else {
                  toast({ title: "Reached at last question" })
                }
              }}
            >
              Next
            </Button>
          </div>
          <div className="flex gap-4">
            <Button onClick={SubmitteTest}>Submit Test</Button>
            <Button onClick={ExitTest}>Exit</Button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex justify-center items-center bg-white dark:bg-zinc-900">
          <StudentMCQTest Question={Question} index={CurrentQuestion} />
        </div>
      </div>
    </div>
  )
}

export default MCQTest
