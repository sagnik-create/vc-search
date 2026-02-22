import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <aside className="w-64 border-r p-4 space-y-4">
          <h2 className="font-bold text-lg">VC Scout</h2>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/companies">Companies</Link>
            <Link href="/lists">Lists</Link>
            <Link href="/saved">Saved Searches</Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </body>
    </html>
  );
}