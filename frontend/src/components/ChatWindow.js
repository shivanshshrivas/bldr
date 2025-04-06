'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from "motion/react"

export default function ChatWindow() {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState([
        { text: 'Hello! I am an AI model that can help you make your ideal schedule, add or remove classes based on your preferences, or add blocks to your schedule. Please let know what I can do for you!', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [...prev, { text: "I'm a bot, here's a response!", sender: 'bot' }]);
            setIsTyping(false);
        }, 2000);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    return (
        <div
            className={`relative top-0 right-0 h-screen rounded-tl-2xl rounded-bl-2xl transition-all duration-300 overflow-hidden ${open ? 'min-w-[350px] max-w-[350px] bg-[#080808]' : 'min-w-[50px] max-w-[50px] bg-transparent'}`}
        >
            <div className="absolute top-0 left-0 py-5 px-3 w-full flex justify-between items-center">
                <svg
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                    fill="#fafafa"
                    stroke="#fafafa"
                    className={`chat-toggle cursor-pointer transition-all duration-500 ${open ? '' : 'rotate-180'}`}
                    onClick={() => setOpen(!open)}
                >
                    <path d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z" />
                </svg>
                {open && <motion.div 
                    initial={{ scale: 0}}
                    transition={{ duration: 0.5 }}
                    animate={{ scale: 1}}
                    className="text-lg text-white font-figtree">bldr Chat</motion.div>}
                <div></div>
            </div>

            {open && (
                <div className="mt-16 px-1 flex flex-col w-full h-[calc(100%-4rem)]">
                    <div className="flex-1 flex flex-col justify-start overflow-y-auto space-y-2 py-4 pl-1 pr-2">
                        {messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={idx}
                                className={`max-w-[90%] break-words px-4 py-2 rounded-lg text-white font-inter text-xs ${
                                    msg.sender === 'user'
                                        ? 'bg-[#757FB6] ml-auto text-left '
                                        : 'bg-[#202020] mr-auto text-left border-[#717171] border'
                                }`}
                            >
                                <p className='font-inter text-xs'>{msg.text}</p>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="mr-auto px-4 py-2 text-white text-sm font-inter bg-[#202020] rounded-lg border border-[#717171] max-w-[90%] break-words">
                                <span className="flex ">
                                    <span className="animate-bounce delay-0">.</span>
                                    <span className="animate-bounce delay-100">.</span>
                                    <span className="animate-bounce delay-200">.</span>
                                </span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex items-end justify-between gap-2 mt-auto mb-5 px-1">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 bg-[#2C2C2C] border border-[#717171] focus:outline-none focus:outline-[#717171] font-inter text-xs rounded-md text-white px-3 py-2 resize-none overflow-hidden"
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-transparent hover:bg-[#2c2c2c] cursor-pointer transition-all duration-75 text-white px-3 py-2 rounded"
                        >
                            <svg viewBox="0 0 24 24" height={15} width={15} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z" stroke="#fafafa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
