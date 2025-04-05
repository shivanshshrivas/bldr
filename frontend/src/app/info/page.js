'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select";

import { useState } from "react";
import Link from "next/link";


export default function Info() {
    return (
        <div className="info">
            <div className="flex flex-col justify-start items-center h-screen py-10 bg-[#1a1a1a] text-[#fafafa]">
                <div className="header w-full flex flex-col justify-start items-center mb-10">
                    <h1 className="text-5xl font-dmsans font-bold mb-3">Welcome to bldr</h1>
                    <h2 className="text-3xl font-dmsans text-[#A8A8A8] dark:text-[#5a5a5a]">Flagship Schedule Builder</h2>                
                </div>
                <div className="login-form flex flex-col justify-center items-center w-fit border border-[#404040] p-10 rounded-lg">
                    <div className="form-header w-full flex flex-col justify-start items-start mb-2">
                        <h1 className="text-3xl font-bold font-dmsans mb-2">Few more details...</h1>
                        <h2 className="text-[#A8A8A8] text-xs font-inter mb-4 dark:text-[#5a5a5a]">Help us personalize your experience</h2>
                    </div>
                    <form className="flex flex-col gap-4 w-96">
                        <Label htmlFor="transcript" className="text-sm font-inter -mb-1">Unofficial Transcript</Label>
                        <Input type="file" id="transcript" className="font-figtree [&::file-selector-button]:text-[#404040] border-[#404040] bg-[#1a1a1a] text-[#fafafa] placeholder:text-[#a8a8a8]" required />

                        <Label htmlFor="major" className="text-sm font-inter -mb-1">Major</Label>
                        <Select >
                            <SelectTrigger className="w-full bg-[#1a1a1a] dark:bg-[#fafafa] text-[#fafafa] border-[#404040] ">
                                <SelectValue placeholder="Select your major" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-[#404040]  text-[#fafafa] px-2">
                                <SelectGroup>
                                <SelectLabel className={`font-figtree`}>Majors</SelectLabel>
                                <SelectItem className='font-inter' value="electricalEngineering">Electrical Engineering</SelectItem>
                                <SelectItem className='font-inter' value="computerEngineering">Computer Engineering</SelectItem>
                                <SelectItem className='font-inter' value="computerScience">Computer Science</SelectItem>
                                <SelectItem className='font-inter' value="interdisciplinaryCS">Interdisciplinary Computer Science</SelectItem>
                                <SelectItem className='font-inter' value="engineeringPhysics">Engineering Physics</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        
                        <Label htmlFor="confirm-password" className="text-sm font-inter -mb-1">Select Catalog Version</Label>
                        <Select >
                            <SelectTrigger className="w-full bg-[#1a1a1a] text-[#fafafa] border-[#404040] ">
                                <SelectValue placeholder="Select your catalog" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-[#404040]  text-[#fafafa] px-2">
                                <SelectGroup>
                                <SelectLabel className={`font-figtree`}>Versions</SelectLabel>
                                <SelectItem className='font-inter' value="f2025">Fall 2025</SelectItem>
                                <SelectItem className='font-inter' value="s2025">Spring 2025</SelectItem>
                                <SelectItem className='font-inter' value="f2024">Fall 2024</SelectItem>
                                <SelectItem className='font-inter' value="s2024">Spring 2024</SelectItem>
                                <SelectItem className='font-inter' value="f2023">Fall 2023</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button type="submit" className={`bg-[#fafafa] text-[#1a1a1a] hover:bg-[#404040] hover:text-[#fafafa] cursor-pointer font-dmsans text-md my-3`}>Continue</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}