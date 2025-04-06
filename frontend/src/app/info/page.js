'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

export default function Info() {
  const router = useRouter();
  const {
    userId,
    password,
    unofficialTranscript,
    setUnofficialTranscript,
    catalogYear,
    setCatalogYear,
    major,
    setMajor,
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("onlineID", userId);
      formData.append("password", password);
      formData.append("major", major);
      formData.append("catalogYear", catalogYear);
      formData.append("transcript", unofficialTranscript);


      const response = await fetch("http://10.104.175.40:5000/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/builder");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="info">
      <div className="flex flex-col justify-start items-center h-screen py-10 bg-[#1a1a1a] text-[#fafafa]">
        <div className="header w-full flex flex-col justify-start items-center mb-10">
          <h1 className="text-5xl font-dmsans font-bold mb-3">Welcome to bldr</h1>
          <h2 className="text-3xl font-dmsans text-[#A8A8A8]">Flagship Schedule Builder</h2>
        </div>
        <div className="login-form flex flex-col justify-center items-center w-fit border border-[#404040] p-10 rounded-lg">
          <div className="form-header w-full flex flex-col justify-start items-start mb-2">
            <h1 className="text-3xl font-bold font-dmsans mb-2">Few more details...</h1>
            <h2 className="text-[#A8A8A8] text-xs font-inter mb-4">
              Help us personalize your experience
            </h2>
          </div>
          <form className="flex flex-col gap-4 w-96" onSubmit={handleSubmit}>
            <Label htmlFor="transcript" className="text-sm font-inter -mb-1">
              Unofficial Transcript
            </Label>
            <Input
              type="file"
              id="transcript"
              onChange={(e) => setUnofficialTranscript(e.target.files?.[0] || null)}
              className="font-figtree cursor-pointer [&::file-selector-button]:text-[#a8a8a8] border-[#404040] bg-[#1a1a1a] text-[#fafafa]"
              required
            />

            <Label htmlFor="major" className="text-sm font-inter -mb-1">
              Major
            </Label>
            <Select onValueChange={(value) => setMajor(value)} required>
              <SelectTrigger className="w-full bg-[#1a1a1a] dark:bg-[#fafafa] text-[#fafafa] border-[#404040]">
                <SelectValue placeholder="Select your major" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#404040] text-[#fafafa] px-2">
                <SelectGroup>
                  <SelectLabel className="font-figtree">Majors</SelectLabel>
                  <SelectItem className="font-inter" value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem className="font-inter" value="Computer Engineering">Computer Engineering</SelectItem>
                  <SelectItem className="font-inter" value="Computer Science">Computer Science</SelectItem>
                  <SelectItem className="font-inter" value="IC-Astronomy">IC-Astronomy</SelectItem>
                  <SelectItem className="font-inter" value="IC-Physics">IC-Physics</SelectItem>
                  <SelectItem className="font-inter" value="IC-Chemistry">IC-Chemistry</SelectItem>
                  <SelectItem className="font-inter" value="IC-Biology">IC-Biology</SelectItem>
                  <SelectItem className="font-inter" value="IC-Economics">IC-Economics</SelectItem>
                  <SelectItem className="font-inter" value="IC-Journalism">IC-Journalism</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label htmlFor="catalog" className="text-sm font-inter -mb-1">
              Select Catalog Version
            </Label>
            <Select onValueChange={(value) => setCatalogYear(value)} required>
              <SelectTrigger className="w-full bg-[#1a1a1a] text-[#fafafa] border-[#404040]">
                <SelectValue placeholder="Select your catalog" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-[#404040] text-[#fafafa] px-2">
                <SelectGroup>
                  <SelectLabel className="font-figtree">Versions</SelectLabel>
                  <SelectItem className="font-inter" value="2022-23">2022-23</SelectItem>
                  <SelectItem className="font-inter" value="2023-24">2023-24</SelectItem>
                  <SelectItem className="font-inter" value="2024-25">2024-25</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="bg-[#fafafa] text-[#1a1a1a] hover:bg-[#404040] hover:text-[#fafafa] cursor-pointer font-dmsans text-md my-3"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
