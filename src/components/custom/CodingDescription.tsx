import type { RootState } from 'Redux/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuestionType {
  _id:string,
  QuestionName: string | null;
  QuestionDescription: string | null;
  InputTestCase: string[];
  OutputTestCase: string[];
}

interface Props {
  Question: QuestionType;
}

function CodingDescription({ Question }: Props) {
  const isDarkMode = useSelector((state: RootState) => state.DarkLight.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className='p-5 h-screen overflow-auto bg-white text-black dark:bg-inherit dark:text-white dark:from-zinc-900 dark:to-zinc-700'>
      <h1 className='my-2 font-semibold text-2xl'>
        {Question.QuestionName != null ? Question.QuestionName : "loading.."}
      </h1>

      <div className='my-4'>
        <h4 className='text-lg font-medium'>Description</h4>
        <p>{Question.QuestionDescription != null ? Question.QuestionDescription : "loading..."}</p>
      </div>

      <div className='my-4'>
        <h4 className='text-lg font-medium'>Sample Test Case</h4>
        <Table>
          <TableCaption>Sample Test Cases</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sample Input</TableHead>
              <TableHead>Sample Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Question.InputTestCase.map((elem, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium overflow-auto">{elem}</TableCell>
                <TableCell className="overflow-auto">{Question.OutputTestCase[index]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='my-4'>
        <h4 className='text-lg font-medium'>Time Constraints</h4>
        <p>{/* Fill in if needed */}</p>
      </div>

      <div className='my-4'>
        <h4 className='text-lg font-medium'>Space Constraints</h4>
        <p>{/* Fill in if needed */}</p>
      </div>
    </div>
  );
}

export default CodingDescription;
