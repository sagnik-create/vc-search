"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { ChevronUp, Check, X } from "lucide-react";

interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  email: string;
  summary: string;
  whatTheyDo: string[];
}

export default function TinderCard({ company, onDecision, isTop }: { company: Company, onDecision: (decision: "APPROVED" | "REJECTED") => void, isTop: boolean }) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [showDetails, setShowDetails] = useState(false);

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = async (e: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0 });
      onDecision("APPROVED");
    } else if (offset < -100 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0 });
      onDecision("REJECTED");
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      drag={isTop && !showDetails ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      animate={controls}
      onDragEnd={handleDragEnd}
      className={`absolute bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden flex flex-col h-[600px] origin-bottom ${isTop ? 'z-10' : 'z-0'}`}
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-8 flex-1 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">{company.name}</h2>
        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mb-1 inline-block hover:underline">{company.website}</a>
        {company.email && (
          <div className="text-gray-500 text-sm mb-6 flex items-center gap-2">
            <span className="font-semibold">Contact:</span>
            <a href={`mailto:${company.email}`} className="hover:text-blue-600 transition-colors">{company.email}</a>
          </div>
        )}
        
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-widest mb-6">
           {company.industry}
        </div>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
           {company.summary}
        </p>
        
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-gray-100"
          >
             <h3 className="font-bold text-gray-900 text-xl mb-4">What they do</h3>
             <ul className="space-y-3">
                {company.whatTheyDo?.map((item, idx) => (
                  <li key={idx} className="text-base text-gray-600 flex items-start">
                     <span className="text-blue-500 mr-2">•</span>
                     <span>{item}</span>
                  </li>
                ))}
             </ul>
          </motion.div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center items-center gap-8 backdrop-blur-sm">
        <button 
           onClick={() => { controls.start({ x: -500, opacity: 0 }).then(() => onDecision("REJECTED")) }} 
           className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all border border-gray-100"
        >
           <X size={32} strokeWidth={2.5} />
        </button>
        <button 
           onClick={() => setShowDetails(!showDetails)} 
           className="p-3 text-gray-400 hover:text-gray-800 flex flex-col items-center group transition-colors"
        >
           <ChevronUp size={28} className={showDetails ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300 group-hover:-translate-y-1"} />
           <span className="text-xs font-bold uppercase tracking-wider mt-1">{showDetails ? "Less" : "More"}</span>
        </button>
        <button 
           onClick={() => { controls.start({ x: 500, opacity: 0 }).then(() => onDecision("APPROVED")) }} 
           className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-green-500 shadow-lg hover:bg-green-50 hover:scale-110 transition-all border border-gray-100"
        >
           <Check size={32} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
