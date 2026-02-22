"use client";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
  website: string;
  industry: string;
  stage: string;
  location: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "",
    stage: "",
    location: "",
  });

  async function fetchCompanies() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/companies`);
    const data = await res.json();
    setCompanies(data);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      website: "",
      industry: "",
      stage: "",
      location: "",
    });

    fetchCompanies();
  }

  return (
    <div className="space-y-6 text-black">
      <h1 className="text-2xl font-semibold">Discover Companies</h1>

      {/* Add Company */}
      <form onSubmit={handleAddCompany} className="grid grid-cols-2 gap-2 max-w-xl">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Industry"
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Stage"
          value={form.stage}
          onChange={(e) => setForm({ ...form, stage: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <button className="col-span-2 bg-black text-white py-2 rounded">
          Add Company
        </button>
      </form>

      {/* Companies List */}
      <div className="space-y-2">
        {companies.map((c) => (
          <a
            key={c.id}
            href={`/companies/${c.id}`}
            className="block border p-3 rounded hover:bg-gray-50"
          >
            <b>{c.name}</b> – {c.industry} ({c.stage})
          </a>
        ))}
      </div>
    </div>
  );
}