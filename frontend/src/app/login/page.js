
'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { useState } from "react";
import Link from "next/link";


export default function Login() {
    return (
        <div className="login ">
            <div className="flex flex-col justify-start items-center h-screen py-10">
                <div className="header w-full flex flex-col justify-start items-center mb-10">
                    <h1 className="text-5xl font-dmsans font-bold mb-3">Welcome to bldr</h1>
                    <h2 className="text-3xl font-dmsans text-[#A8A8A8] ">Flagship Schedule Builder</h2>                
                </div>
                <div className="login-form flex flex-col justify-center items-center w-fit border border-[#404040] p-10 rounded-lg">
                    <div className="form-header w-full flex flex-col justify-start items-start mb-2">
                        <h1 className="text-3xl font-bold font-dmsans mb-2 ">Login</h1>
                        <h2 className="text-[#A8A8A8] text-xs font-inter mb-4">Please enter your Online ID and password to continue</h2>
                    </div>
                    <form className="flex flex-col gap-4 w-96">
                        <Label htmlFor="username" className="text-sm font-inter -mb-1">Online ID</Label>
                        <Input type="text" id="onlineid" placeholder="a123b456" className={`font-inter border-[#404040] border-2`} required />

                        <div className="w-full flex justify-between items-center -mb-1">
                        <Label htmlFor="password" className="text-sm font-inter ">Password</Label>
                        <p className="text-sm font-inter font-medium cursor-pointer">Forgot password?</p>
                        </div>
                        <Input type="password" id='password' className={`font-inter border-[#404040] border-2`} required />
                        <Button type="submit" className={`bg-[#fafafa] text-[#1a1a1a] hover:bg-[#404040] hover:text-[#fafafa] cursor-pointer font-dmsans text-md my-3`}>Login</Button>
                    </form>
                    <div className="text-[#a8a8a8] text-xs mt-3 font-inter">Don't have an account with us? <Link href={'/signup'} className="font-medium text-white font-inter">Sign up</Link></div>
                </div>
            </div>
        </div>
    );
}