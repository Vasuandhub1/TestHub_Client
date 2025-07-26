import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
// import { DatePicker } from "../ui/datePicker";
import { useSelector } from "react-redux";
import type { RootState } from "Redux/store";

export default function Profile() {
  const { name, email, Enroll, section, branch } = useSelector((state: RootState) => state.student);

  const [data, SetData] = useState({ Name: "", Password: "", ConfirmPassword: "" });

  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className=" border-black dark:border-white">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 text-black dark:text-white">
              <AvatarImage src="/default-avatar.png" alt="Profile Picture" />
              <AvatarFallback className="text-3xl flex justify-center items-center">
                {name?.split(" ")[0]?.charAt(0)}
                {name?.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label className="text-sm">Student</Label>
              <p className="text-lg font-semibold">{name}</p>
            </div>
          </div>
          <Separator className="my-4 dark:bg-white bg-black" />
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={handleData}
                name="Name"
                className="border-black dark:border-slate-700"
                placeholder={name}
              />
            </div>
            {/* <div className="flex flex-col gap-1">
              <Label htmlFor="dob">Date Of Birth</Label>
              <DatePicker />
            </div> */}
            <div>
              <Label htmlFor="enroll">Enroll</Label>
              <Input
                type="text"
                placeholder={String(Enroll)}
                className="border-black dark:border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                disabled
                type="text"
                placeholder={section}
                className="border-black dark:border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input
                disabled
                type="text"
                placeholder={branch}
                className="border-black dark:border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                type="email"
                placeholder={email}
                className="border-black dark:border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                onChange={handleData}
                name="Password"
                className="border-black dark:border-slate-700"
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                onChange={handleData}
                name="ConfirmPassword"
                className="border-black dark:border-slate-700"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
