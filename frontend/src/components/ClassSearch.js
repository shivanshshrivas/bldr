'use client';

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        <div className="flex flex-col justify-start items-center my-5 min-w-[420px] max-w-[500px] bg-[#080808] transition-all duration-150 border-2 border-[#303030] rounded-2xl">
            <div className="flex flex-col justify-start items-center w-full h-full p-5">
                <h1 className="text-xl self-start font-figtree font-bold text-[#fafafa]">Search for classes</h1>
                <div className="class-search-form flex flex-row justify-start items-center gap-2 w-full mt-5">
                    <Input placeholder="Class name" className="font-inter border-[#404040] border-1 placeholder:text-xs text-xs" />
                    <svg viewBox="0 0 24 24" height={25} width={25} fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z" fill="#fafafa"></path>
                    </svg>
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
                            <AccordionTrigger className="text-lg text-purple-400 font-bold">Currently Added</AccordionTrigger>
                            <AccordionContent>
                                {selectedClasses.length === 0 ? (
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
