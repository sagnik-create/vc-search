"use client";

import { useEffect, useState } from "react";
import { FolderOpen, ArrowRight, CheckSquare, Square, Filter } from "lucide-react";

export default function Lists() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/companies")
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSendToDecision = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      const res = await fetch("http://127.0.0.1:8000/companies/batch-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_ids: Array.from(selectedIds),
          status: "PENDING"
        }),
      });
      
      if (!res.ok) throw new Error("Failed to send companies");
      
      // Update local state to reflect they are now sent (optional, could just clear selection)
      const updatedCompanies = companies.map(c => 
        selectedIds.has(c.id) ? { ...c, status: "PENDING" } : c
      );
      setCompanies(updatedCompanies);
      setSelectedIds(new Set());
      alert("Successfully sent to Decision Section!");
    } catch (e) {
      console.error(e);
      alert("Failed to send to decision section");
    }
  };

  const filteredCompanies = companies.filter(c => {
    if (industryFilter && !c.industry.toLowerCase().includes(industryFilter.toLowerCase())) return false;
    if (stageFilter && c.stage.toLowerCase() !== stageFilter.toLowerCase()) return false;
    return true;
  });

  const availableIndustries = Array.from(new Set(companies.map(c => c.industry))).filter(Boolean);
  const availableStages = Array.from(new Set(companies.map(c => c.stage))).filter(Boolean);

  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lists</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your custom company lists and send them to decision.</p>
        </div>
        <button 
          onClick={handleSendToDecision}
          disabled={selectedIds.size === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Send {selectedIds.size > 0 && `(${selectedIds.size})`} to Decision <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6 flex gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Domain</label>
          <select 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="">All Domains</option>
            {availableIndustries.map(ind => (
              <option key={ind as string} value={ind as string}>{ind}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Funding Level</label>
          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="">All Stages</option>
            {availableStages.map(stg => (
              <option key={stg as string} value={stg as string}>{stg}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading companies...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 max-w-sm mb-6">Try adjusting your filters or add new companies in the Discover tab.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  {/* Select All could go here */}
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompanies.map(company => {
                const isSelected = selectedIds.has(company.id);
                const isPending = company.status === "PENDING";
                
                return (
                  <tr 
                    key={company.id} 
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="p-4 text-center cursor-pointer" onClick={() => !isPending && handleToggleSelect(company.id)}>
                      {isPending ? (
                        <div className="w-5 h-5 rounded border-2 border-gray-200 bg-gray-100" title="Already in decision section" />
                      ) : isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 inline-block" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-blue-500 inline-block" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.website}</div>
                      <div className="text-xs text-gray-400 mt-1">{company.email}</div>
                    </td>
                    <td className="p-4 text-gray-700">{company.industry}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide">
                        {company.stage}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        company.status === 'NEW' ? 'bg-green-100 text-green-700' :
                        company.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
