'use client';
import { motion } from "framer-motion";


import ChatWindow from "@/components/ChatWindow";
import { Sidebar } from "@/components/Sidebar";
import ClassSearch from "@/components/ClassSearch";
import { Badge } from "@/components/ui/badge"
import TestCal from "@/components/TestCal";
import { useAuth } from "@/context/AuthContext";








export default function Page () {


    const { userId, activeScheduleName, activeSemester} = useAuth();


    return (
        <div className = 'flex flex-row h-screen w-full items-start' >
            <Sidebar />
            <div className="flex flex-col justify-start items-start w-full ">
                <div className="page-header sticky top-0 w-full flex flex-1 justify-between items-center">
                    <div className="w-full flex items-center transition-all duration-300">
                        { activeScheduleName ? <motion.div key={activeScheduleName} initial = {{scale: 0}} animate = {{scale: 1}} className="text-xl font-figtree p-5 max-w-1/3 whitespace-nowrap overflow-clip overflow-ellipsis ">{activeScheduleName}</motion.div> : <motion.div initial = {{opacity: 0}} animate={{opacity: 1}} className="text-xl font-figtree p-5">Welcome, <span className="font-semibold text-[#717171]">{userId}</span>.</motion.div>}
                        { activeSemester && <motion.div initial={{scale: 0}} animate = {{scale: 1}} key ={activeSemester} ><Badge className={' px-2 h-7 rounded-full outline-2 text-green-500  outline-green-500'}>{activeSemester}</Badge></motion.div> }
                    </div>
                    <h1 className="text-7xl font-dmsans px-5" ><span className="text-white">b</span><span className="text-red-500">l</span><span className="text-blue-600">d</span><span className="text-yellow-300">r</span></h1>
                </div>
                <div className="flex flex-row flex-1 justify-start items-start gap-2 h-full">
                <ClassSearch />
                <TestCal />
                </div>
            </div>
            <ChatWindow />
        </div>
    );
}