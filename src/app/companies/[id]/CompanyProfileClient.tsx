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

type EnrichedData = {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: string[];
  enrichedAt: string;
};

export default function CompanyProfileClient({ id }: { id: string }) {
  console.log("API BASE:", process.env.NEXT_PUBLIC_API_BASE ?? "MISSING");
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enriched, setEnriched] = useState<EnrichedData | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/companies/${id}`
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCompany(data);
      } catch {
        setCompany(null);
      } finally {
        setLoadingCompany(false);
      }
    }

    fetchCompany();
  }, [id]);

  if (loadingCompany) return <p>Loading company...</p>;
  if (!company) return <p>Company not found</p>;

  async function handleEnrich() {
    if (!company) return; // ✅ TypeScript-safe guard

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company.website }),
      });

      if (!res.ok) throw new Error("Failed to enrich");

      const data = await res.json();
      setEnriched(data);
    } catch {
      setError("Enrichment failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-black">{company.name}</h1>

      <div className="bg-white p-4 rounded border space-y-1 text-black">
        <p><b>Website:</b> {company.website}</p>
        <p><b>Industry:</b> {company.industry}</p>
        <p><b>Stage:</b> {company.stage}</p>
        <p><b>Location:</b> {company.location}</p>
      </div>

      <button
        onClick={handleEnrich}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? "Enriching..." : "Enrich"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {enriched && (
        <div className="bg-white p-4 rounded border space-y-2 text-black">
          <h2 className="font-semibold text-black">Enriched Data</h2>

          <p>
            <b>Summary:</b> {enriched.summary}
          </p>

          <div>
            <b>What they do:</b>
            <ul className="list-disc ml-5">
              {enriched.whatTheyDo.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <p>
            <b>Keywords:</b> {enriched.keywords.join(", ")}
          </p>

          <div>
            <b>Signals:</b>
            <ul className="list-disc ml-5">
              {enriched.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <b>Sources:</b>
            <ul className="list-disc ml-5">
              {enriched.sources.map((src, i) => (
                <li key={i}>
                  <a href={src} target="_blank" className="text-blue-600 underline">
                    {src}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}