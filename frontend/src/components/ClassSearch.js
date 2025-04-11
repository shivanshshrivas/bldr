'use client';

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import Class from "./Class";
import NewClass from "./NewClass";
export default function ClassSearch() {
    const {
        userId,
        suggestedClasses,
        setSuggestedClasses,
        selectedClasses,
        setSelectedClasses,
        activeSchedule,
    } = useAuth();

    useEffect(() => {
        const fetchSuggestedClasses = async () => {
            try {
                const response = await fetch('http://10.104.175.40:5000/api/suggest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID: userId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch suggested classes');
                }

                const data = await response.json();
                console.log("Suggested classes:", data);
                setSuggestedClasses(data.suggestedClasses || []);
            } catch (error) {
                console.error("Error fetching suggested classes:", error);
            }
        };

        if (userId) {
            fetchSuggestedClasses();
        }
    }, [userId]);

    return (
        <div className="flex flex-col justify-start items-center my-5 min-w-[420px] max-w-[500px] max-h-[600px] overflow-y-scroll bg-[#080808] transition-all duration-150 border-2 border-[#303030] rounded-2xl">
            <div className="flex flex-col justify-start items-center w-full h-full p-5">
                <h1 className="text-xl self-start font-figtree font-bold text-[#fafafa]">Search for classes</h1>
                <div className="class-search-form flex flex-row justify-start items-center gap-2 w-full mt-5">
                    <Input placeholder="Class name" className="font-inter border-[#404040] border-1 placeholder:text-xs text-xs" />
                    <TooltipProvider>
                        <Tooltip delayDuration={300} >
                        <TooltipTrigger asChild >
                            <svg viewBox="0 0 24 24" height={34} width={34} fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer hover:bg-[#404040] p-1 rounded-md transition duration-300">
                            <path d="M11.5 19C15.6421 19 19 15.6421 19 11.5C19 7.35786 15.6421 4 11.5 4C7.35786 4 4 7.35786 4 11.5C4 15.6421 7.35786 19 11.5 19Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M20.9999 20.9999L16.6499 16.6499" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </TooltipTrigger>
                        <TooltipContent  className="text-xs font-figtree text-[#fafafa]" side='bottom' >
                            <p>Search class</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="w-full max-w-full mt-4">
                    <Accordion type="multiple" className="font-figtree">
                        {/* Searched Section */}
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-green-400 font-bold">Searched</AccordionTrigger>
                            <AccordionContent className="font-inter">
                                <div className="text-sm text-[#888888] font-figtree">No classes searched</div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Currently Added Section */}
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-purple-400 font-bold">Currently Selected</AccordionTrigger>
                            <AccordionContent>
                                {selectedClasses.length + activeSchedule.length === 0 ? (
                                    <div className="text-sm text-[#888888] font-figtree">No classes added</div>
                                ) : (
                                    selectedClasses.map((cls, idx) => (
                                        <Class key={idx} {...cls} />
                                    ))                           

                                )}
                                {
                                    activeSchedule.length === 0 ? (<div></div>): (
                                        activeSchedule.map((cls, idx) => (
                                            <NewClass key={idx} {...cls} />
                                        ))
                                    )
                                }
                            </AccordionContent>
                        </AccordionItem>

                        {/* Suggested Section */}
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-blue-400 font-bold">Suggested</AccordionTrigger>
                            <AccordionContent>
                                {suggestedClasses.length === 0 ? (
                                    <div className="text-sm text-[#888888] font-figtree">No suggested classes available</div>
                                ) : (
                                    suggestedClasses.map((classData, index) => (
                                        <Class key={index} {...classData} />
                                    ))
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
