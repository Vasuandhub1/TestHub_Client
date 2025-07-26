
import CodingPage from '../../../page/CodingPage'

interface QuestionType {
  _id:string,
  QuestionName: string | null;
  QuestionDescription: string | null;
  InputTestCase: string[];
  OutputTestCase: string[];
}

const question:QuestionType= {
   _id:"",
  QuestionName: "",
  QuestionDescription:"",
  InputTestCase: [],
  OutputTestCase:[],
}

function StudentCodeCompiler() {
  return (
    <div>
      <CodingPage SetDescription={false} Question={question}/>
    </div>
  )
}

export default StudentCodeCompiler
