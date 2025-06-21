import { useState } from 'react'
import TextEditor from "../src/components/custom/TextEditor"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import CodingDescription from '@/components/custom/CodingDescription'
import CodingNavbar from '@/components/custom/CodingNavbar'
import { useSelector } from 'react-redux'
import type { RootState } from 'Redux/store'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios, { AxiosError } from 'axios'
import { Badge } from "@/components/ui/badge"
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Base_Url } from "../utils/url"

// Define the Question type
interface QuestionType {
  _id:string,
  QuestionName: string | null;
  QuestionDescription: string | null;
  InputTestCase: string[];
  OutputTestCase: string[];
}

// Define Props for this component
interface CodingPageProps {
  SetDescription: boolean;
  Question: QuestionType;
}

function CodingPage({ SetDescription, Question }: CodingPageProps) {
  const source_code = useSelector((state: RootState) => state.code.code)
  const [language, setLanguage] = useState<string>("45")
  const [output, SetOutput] = useState("No submission yet...")
  const [Input, SetInput] = useState("")
  const [Terminal, SetTerminal] = useState("")

  const SubmitteSolution = async () => {
    try {
      SetOutput("Running Hiddin Test Cases...")
      const data = {
        language_id: language,
        source_code,
      }

      const res = await axios.post(`${Base_Url}/student-test-hub/Student/CodeQuestionSubmission`, {
        data,
        QuestionId: Question._id
      }, { withCredentials: true })

      SetOutput(res?.data?.data?.status?.description || "Unknown Status")

    } catch (err) {
      const error = err as AxiosError<{ message?: string; data?: string }>
      SetOutput(error?.response?.data?.message || "Unknown error")
      toast({
        title: error?.response?.data?.message || "Error",
        description: error?.response?.data?.data || "Something went wrong"
      })
    }
  }

  const handleRunButton = async () => {
    const data: { language_id: string, source_code: string, stdin?: string } = {
      language_id: language,
      source_code
    }
    if (Input) data.stdin = Input

    SetTerminal("compiling...")

    try {
      const res = await axios.post(`${Base_Url}/student-test-hub/test`, { data })

      SetTerminal("running...")
      setTimeout(() => {
        if (res?.data?.data?.status_id === 3) {
          SetTerminal(res?.data?.data?.stdout || "No output")
        } else {
          SetTerminal(res?.data?.data?.status?.description || "Error in execution")
        }
      }, 3000)

    } catch (err) {
      const error = err as AxiosError<{ message?: string; data?: string }>
      SetTerminal("Err in the server")
      toast({
        title: error?.response?.data?.message || "Execution error",
        description: error?.response?.data?.data || "Failed to execute code"
      })
    }
  }

  return (
    <div className=''>
      <CodingNavbar onRun={handleRunButton} SetDescription={SetDescription} onSubmit={SubmitteSolution} />
      <div className='h-screen '>
        {SetDescription ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <CodingDescription Question={Question} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction='vertical'>
                <ResizablePanel>
                  <TextEditor setLanguage={setLanguage} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <Tabs defaultValue="Terminal" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="Terminal">Terminal</TabsTrigger>
                      <TabsTrigger value="Output">Output</TabsTrigger>
                      <TabsTrigger value="Input">Input</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Terminal" className='p-2'>
                      <p className='text-lg font-mono'>Terminal: {Terminal}</p>
                    </TabsContent>
                    <TabsContent value="Output" className='p-2 text-lg'>
                      {output === "No submission yet..." || output === "Accepted" || output === "Running Hiddin Test Cases..." ? (
                        <div>Output: <Badge variant="secondary" className='text-lg'>{output}</Badge></div>
                      ) : (
                        <div>Output: <Badge className='text-lg' variant="destructive">{output}</Badge></div>
                      )}
                    </TabsContent>
                    <TabsContent value="Input" className='p-2'>
                      <label>
                        Enter Custom Input (To check your code)
                        <Textarea onChange={(e) => SetInput(e.target.value)} placeholder='The output will be displayed on the Terminal' />
                      </label>
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <TextEditor setLanguage={setLanguage} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <p className="p-4 text-lg">{Terminal}</p>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

export default CodingPage
