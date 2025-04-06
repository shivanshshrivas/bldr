import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const TestCal = () => {
  const { activeSchedule, setActiveSchedule } = useAuth();

  useEffect(() => {
    
  }, [setActiveSchedule]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);

  return (
    <div className="flex justify-center items-center m-5 bg-[#2c2c2c] flex-1 max-h-[600px] overflow-auto max-w-[600px] border-2 border-[#404040] aspect-square rounded-xl text-white p-2">
      {activeSchedule ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-full h-full overflow-auto">
          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr>
                <th className="text-center font-semibold font-figtree w-[40px] md:w-[50px] text-xs md:text-sm">Time</th>
                {days.map(day => (
                  <th key={day} className="text-center font-semibold font-figtree p-1 md:p-2 text-xs md:text-sm">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour} className="relative h-8 md:h-11 border-t border-[#404040]">
                  <td className="align-top pr-1 md:pr-2 text-[9px] md:text-xs text-right font-figtree">
                    {hour}:00
                  </td>
                  {days.map(day => (
                    <td key={day} className="relative align-top w-[80px] md:w-[150px]">
                      <div className="absolute top-[50%] translate-y-[-50%] w-full border-t border-dashed border-[#424242] z-0" />

                      {activeSchedule
                        .filter(cls => cls.days.includes(day) && cls.time >= hour && cls.time < hour + 1)
                        .map((cls, idx) => {
                          const baseRowHeight = window.innerWidth < 500 ? 32 : 44;
                          const offset = (cls.time - hour) * baseRowHeight;
                          const height = cls.duration * baseRowHeight;

                          return (
                            <div
                              key={idx}
                              className={`${cls.color} absolute left-0.5 right-0.5 p-0.5 rounded-md text-[#1a1a1a] shadow-md z-10 overflow-hidden`}
                              style={{ top: `${offset}px`, height: `${height}px` }}
                            >
                              <div className="font-bold text-[8px] md:text-xs font-dmsans truncate">
                                {cls.course}
                              </div>
                            </div>
                          );
                        })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="font-inter text-center text-xs md:text-sm">
          Create a new schedule or choose one of your previous ones to see it here!
        </div>
      )}
    </div>
  );
};

export default TestCal;
