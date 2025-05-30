'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";

export default function Class(props) {
    const { selectedClasses, setSelectedClasses } = useAuth();
    const [classInfo, setClassInfo] = useState({});
    // const handleClick = (classcode, classname, dept, credithours, catalogyr, major) => {
    //     const isAlreadyPresent = selectedClasses.some((cls) => cls.classcode === classcode && cls.classname === classname);
    //     const selected = isAlreadyPresent;

    //     if (selected) {
    //         setSelectedClasses((prevClasses) => 
    //             prevClasses.filter((item) => item.classcode !== classcode || item.classname !== classname)
    //         );
    //     } else {
    //         setSelectedClasses((prevClasses) => [
    //             ...prevClasses,
    //             { classcode, classname, dept, credithours, catalogyr, major },
    //         ]);
    //     }
    // }

    const callAPI = async (dept, code) => {
    const r = await fetch(`/api/getClassInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({subject: `${dept} ${code}`, term: '4259'}),
    });
    const d = await r.json();
    setClassInfo(JSON.stringify(d, null, 2));
    };


    useEffect(() => {
        callAPI(props.dept, props.classcode);
        
    }, []);

    useEffect(() => {
        if (classInfo) {
            console.log(classInfo);
        }
    }, [classInfo]);

    return (
        <AnimatePresence>
            <motion.div
            initial={{ scale: 0.6, opacity: 0}}
            animate={{ scale: 1, opacity: 1}}
            exit={{ scale: 0.6, opacity: 0 }}
            key={props.uuid}
            className="flex flex-col p-2 my-2 rounded-md text-[#fafafa] border-2 max-w-[420px] border-[#404040] bg-transparent justify-start items-center"
            >
                <h1 className="font-dmsans text-lg font-bold self-start mb-1">
                    {props.dept} {props.classcode}: {props.classname}
                </h1>
                <button
                    className={`w-full font-inter rounded-md mt-2 cursor-pointer bg-[#181818] hover:bg-[#232323] transition duration-100 px-3 py-2 text-left`}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-base">{props.catalogyr}</span>
                        <span className="text-sm text-[#b0b0b0]">{props.credithours} Credit Hour{props.credithours > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-[#a8a8a8]">{props.major}</span>
                        {props.instructor && (
                            <span className="text-xs text-[#a8a8a8] font-dmsans italic">{props.instructor}</span>
                        )}
                    </div>
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
