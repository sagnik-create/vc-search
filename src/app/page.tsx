"use client";

import { useEffect, useState } from "react";
import TinderCard from "@/components/TinderCard";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/companies-pending")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    try {
      await fetch(`http://127.0.0.1:8000/companies/${id}/decision`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision }),
      });
      
      // Remove from list
      setCompanies((prev) => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-4 relative font-sans w-full h-full">
      


      {loading ? (
        <div className="text-gray-400 font-medium">Loading pipeline...</div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inbox Zero! 🎉</h1>
          <p className="text-gray-500">You have reviewed all pending companies.</p>
        </div>
      ) : (
        <div className="relative w-full max-w-md h-[600px] flex items-center justify-center perspective-[1000px]">
          {companies.map((company, i) => {
            if (i > 2) return null;
            return (
              <TinderCard 
                key={company.id} 
                company={company} 
                isTop={i === 0}
                onDecision={(decision) => handleDecision(company.id, decision)}
              />
            );
          }).reverse()}
        </div>
      )}

      {!loading && companies.length > 0 && (
        <div className="absolute top-8 right-8 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-600 border border-gray-100">
          {companies.length} pending
        </div>
      )}
    </div>
  );
}
