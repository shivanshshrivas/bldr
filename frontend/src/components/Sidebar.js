'use client';

import React, { useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function Sidebar() {

    const [open, setOpen] = useState(false);
    const schedules = [
        'Final one',
        'If i need 14 hours',
        'tough one lowkey',
    ]
    const toggleSidebar = () => {
        setOpen(!open)
    }



    return (
        <div className={` sidebar flex flex-col justify-between fixed top-0 left-0 h-screen transition-all duration-300  ${open ? 'min-w-[300px] max-w-[300px] bg-[#080808]' : 'bg-transparent min-w-[100px] max-w-[100px]'} overflow-hidden p-5`}>
            <div>
                <div className='buttons-container flex items-center justify-between mb-5'>
                    <svg viewBox="0 0 24 24" fill="none" height={30} width={30} xmlns="http://www.w3.org/2000/svg" stroke="#fafafa"
                        className={`cursor-pointer transition duration-300  ${open ? 'rotate-180' : ''}`} onClick={toggleSidebar}>
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#000000" strokeWidth="0.048"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path d="M21.9707 15V9C21.9707 4 19.9707 2 14.9707 2H8.9707C3.9707 2 1.9707 4 1.9707 9V15C1.9707 20 3.9707 22 8.9707 22H14.9707C19.9707 22 21.9707 20 21.9707 15Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                            <path opacity="0.4" d="M7.9707 2V22" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                            <path opacity="0.4" d="M14.9702 9.43994L12.4102 11.9999L14.9702 14.5599" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                        </g>
                    </svg>
                    <svg viewBox="0 0 24 24" height={30} width={30} fill="none" xmlns="http://www.w3.org/2000/svg"
                        className={`cursor-pointer transition-all duration-300 ${open ? '' : 'hidden'}`}>
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z" fill="#fafafa"></path> 
                            </g>
                    </svg>
                </div>
                <Accordion type="single" collapsible className={`font-figtree ${open ? '': 'hidden'}`} defaultValue="item-1">
                    <AccordionItem value="item-1">
                    <AccordionTrigger className={'text-md'}>Fall 2025</AccordionTrigger>
                    <AccordionContent className={'font-inter'}>
                        <ul className='list-none pl-2'>
                            {schedules.map((schedule, index) => (
                                <li key={index} className='text-sm text-[#fafafa] font-inter my-2 hover:bg-[#333] rounded-md transition duration-75'><button className=' p-2 cursor-pointer w-full text-left'>{schedule}</button></li>
                            ))}
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                    <AccordionTrigger className={'text-md'}>Spring 2025</AccordionTrigger>
                    <AccordionContent>
                        Yes. It comes with default styles that matches the other
                        components&apos; aesthetic.
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                    <AccordionTrigger className={'text-md'}>Fall 2024</AccordionTrigger>
                    <AccordionContent>
                        Yes. It's animated by default, but you can disable it if you prefer.
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <svg viewBox="0 0 24 24" height={30} width={30} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.14 21.62C17.26 21.88 16.22 22 15 22H8.99998C7.77998 22 6.73999 21.88 5.85999 21.62C6.07999 19.02 8.74998 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.58 10.58C15.58 12.56 13.98 14.17 12 14.17C10.02 14.17 8.42004 12.56 8.42004 10.58C8.42004 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58Z" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>      </div>
    )
  }
  