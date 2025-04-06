'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Class(props) {
    const { selectedClasses, setSelectedClasses } = useAuth();

    const handleClick = (classcode, classname, dept, credithours, catalogyr, major) => {
        const isAlreadyPresent = selectedClasses.some((cls) => cls.classcode === classcode && cls.classname === classname);
        const selected = isAlreadyPresent;

        if (selected) {
            setSelectedClasses((prevClasses) => 
                prevClasses.filter((item) => item.classcode !== classcode || item.classname !== classname)
            );
        } else {
            setSelectedClasses((prevClasses) => [
                ...prevClasses,
                { classcode, classname, dept, credithours, catalogyr, major },
            ]);
        }
    }

    return (
        <AnimatePresence>
        <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            key={`${props.catalogyr}-${props.classcode}`}
            className="flex flex-col p-2 rounded-md text-[#fafafa] border-2 border-[#404040] bg-transparent justify-start items-center"
        >
            <h1 className="font-dmsans text-lg font-bold self-start">
                {props.dept} {props.classcode}: {props.classname}
            </h1>
            <button
                className={`w-full font-inter rounded-md mt-2 cursor-pointer hover:bg-[#2c2c2c] ${
                    selectedClasses.some(cls => cls.classcode === props.classcode && cls.classname === props.classname) ? 'bg-green-950' : ''
                } transition duration-100`}
                onClick={() =>
                    handleClick(
                        props.classcode,
                        props.classname,
                        props.dept,
                        props.credithours,
                        props.catalogyr,
                        props.major
                    )
                }
            >
                <table className="w-full">
                    <tbody>
                        <tr className="text-left">
                            <td className="pt-2 px-1 font-semibold">{props.catalogyr}</td>
                            <td className="pt-2">{props.credithours} Credit Hours</td>
                        </tr>
                        <tr className="text-left">
                            <td></td>
                            <td className="pb-2 text-xs text-[#a8a8a8]">{props.major}</td>
                        </tr>
                    </tbody>
                </table>
            </button>
        </motion.div>
        </AnimatePresence>
    );
}
