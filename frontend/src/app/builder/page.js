'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ChatWindow from "@/components/ChatWindow";
import { Sidebar } from "@/components/Sidebar";
import ClassSearch from "@/components/ClassSearch";
import { Badge } from "@/components/ui/badge"
import TestCal from "@/components/TestCal";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
    const [isMounted, setIsMounted] = useState(false);
    const { userId, activeScheduleName, activeSemester } = useAuth();

    function generateRandomString() {
        return Math.random().toString(36).substring(2, 7);
    }

    useEffect(() => {
        // Only run on client
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // Avoid SSR mismatch by skipping initial render

    return (
        <div className='flex flex-row h-screen w-full items-start'>
            <Sidebar />
            <div className="flex flex-col justify-start items-start w-full ">
                <div className="page-header bg-[#1C1C1C] sticky top-0 w-full flex flex-1 justify-between items-center">
                    <div className="w-full flex-col items-center transition-all duration-300">
                        {userId && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-figtree pt-5 px-5 text-gray-300" // Light grey for welcome message
                            >
                                Welcome {`, ${userId}`}!
                            </motion.div>
                        )}
                        <div className="flex flex-row justify-start items-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={generateRandomString()}
                                className="text-xl font-figtree px-5 max-w-1/2 whitespace-nowrap overflow-clip overflow-ellipsis text-gray-400" // Medium grey for active schedule
                            >
                                Active Schedule: {activeScheduleName ? activeScheduleName : "No schedule selected"}
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={generateRandomString()}
                            >
                                {activeSemester && <Badge className="px-2 h-7 rounded-full outline-2 text-green-400 outline-green-400"> {/* Darker grey for badge */}
                                    {activeSemester}
                                </Badge>}
                            </motion.div>
                        </div>
                    </div>
                    <h1 className="text-7xl font-dmsans px-5">
                        <span className="text-white">b</span>
                        <span className="text-red-500">l</span>
                        <span className="text-blue-600">d</span>
                        <span className="text-yellow-300">r</span>
                    </h1>
                </div>
                <div className="flex flex-row flex-1 justify-start items-start gap-2 h-full">
                    {activeScheduleName && <ClassSearch />}
                    <TestCal />
                </div>
            </div>
        </div>
    );
}
