"use client";

import { useState } from "react";

export default function Companies() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    industry: "",
    stage: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to add company");
      
      setMessage("Company added successfully!");
      setFormData({ name: "", website: "", email: "", industry: "", stage: "", location: "" });
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Discover Companies</h1>
        <p className="text-gray-500 mt-2 text-lg">Add and discover new early-stage startups.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g. https://acme.com"
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Contact</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. founder@acme.com"
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. SaaS, Fintech"
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              >
                <option value="">Select Stage...</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
                required
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Company"}
          </button>
        </form>
      </div>
    </div>
  );
}
