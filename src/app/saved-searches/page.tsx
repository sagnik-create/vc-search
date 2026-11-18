import { Search } from "lucide-react";

export default function SavedSearches() {
  return (
    <div className="p-10 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Searches</h1>
          <p className="text-gray-500 mt-2 text-lg">Quickly access your frequent search queries.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Search className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No saved searches</h3>
        <p className="text-gray-500 max-w-sm mb-6">
          When you search for companies, you can save the query here to easily run it again later.
        </p>
        <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Explore Companies
        </button>
      </div>
    </div>
  );
}
