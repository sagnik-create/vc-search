import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/enrich-company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "FastAPI failed" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}