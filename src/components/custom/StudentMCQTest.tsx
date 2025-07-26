import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Student_Base_URL } from "../../../utils/url.ts";

interface QuestionType {
  _id: string;
  QuestionDescription: string;
  options: string[];
}

interface Props {
  Question: QuestionType;
  index: number;
}

export default function StudentMCQTest({ Question }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleSelect = (value: string) => {
    setSelectedAnswer(value);
    // const ans={QuesId:Question._id,ans:value,index:index}
    // dispatch(AddAns(ans))
  };

  const handleSave = async () => {
    try {
      const data = { _id: Question._id, ans: selectedAnswer };
      await axios.post(`${Student_Base_URL}/Student/MCQQuestionSubmission`, { data }, { withCredentials: true });
      toast({ title: "Success", description: "Answer saved (cannot be reverted)" });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-2 flex flex-col items-center">
      <Card className="w-[50rem] h-[27rem] shadow-xl border border-gray-200 rounded-lg p-3 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">MCQ Test</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{Question.QuestionDescription}</h2>
            <RadioGroup onValueChange={handleSelect} value={selectedAnswer} className="space-y-3">
              {Question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-2 border rounded-lg cursor-pointer transition ${
                    selectedAnswer === String(idx) ? "bg-blue-200" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(String(idx))}
                >
                  <RadioGroupItem value={String(idx)} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="text-gray-700 text-lg">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button onClick={handleSave}>Save And Continue</Button>
        </CardContent>
      </Card>
    </div>
  );
}
