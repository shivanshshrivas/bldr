'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";
import Class from "./Class";






export default function ClassSearch () {

    const { selectedClasses, setSelectedClasses } = useAuth();

    return (
        <div className="flex flex-col justify-start items-center my-5 min-w-[420px] max-w-[500px] bg-[#080808] transition-all duration-150 border-2 border-[#303030] rounded-2xl">
            <div className="flex flex-col justify-start items-center w-full h-full p-5">
                <h1 className="text-xl self-start font-figtree font-bold text-[#fafafa]">Search for classes</h1>
                <div className="class-search-form flex flex-row justify-start items-center gap-2 w-full mt-5">
                    <Input placeholder="Class name" className={`font-inter border-[#404040] border-1 placeholder:text-xs text-xs `} />
                    <svg viewBox="0 0 24 24" height={25} width={25} fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z" fill="#fafafa"></path> 
                                </g>
                        </svg>
                </div>
                <div className="w-full max-w-full">
                <Accordion type="single" collapsible className={`font-figtree`}>
                        <AccordionItem value="item-1">
                        <AccordionTrigger className={'text-lg text-green-400 font-bold'}>Searched</AccordionTrigger>
                        <AccordionContent className={'font-inter'}>
                            < Class name = 'Signals and Systems Analysis' classID = '14324' code='361' dept = 'EECS' days = 'TuTh' startTime = '09:30 AM' endTime = '10:45 AM' instructor = 'Frost, Victor' seats={20} />           
                        </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                        <AccordionTrigger className={'text-lg text-purple-400 font-bold'}>Currently Added</AccordionTrigger>
                        <AccordionContent>
                            {
                                selectedClasses.length === 0 ? <div className="text-sm text-[#888888] font-figtree">No classes added</div> :
                                selectedClasses.map((cls, idx) => {
                                    return (
                                        <Class key={idx} name={cls.name} classID={cls.classID} code={cls.code} dept={cls.dept} days={cls.days} startTime={cls.startTime} endTime={cls.endTime} instructor={cls.instructor} seats={cls.seats} />
                                    );
                                })
                            }
                        </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                        <AccordionTrigger className={'text-lg text-blue-400 font-bold '}>Suggested</AccordionTrigger>
                        <AccordionContent>

                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );

}