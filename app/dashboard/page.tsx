"use client";
import { useState } from "react";
import { DEV_RESOURCES, CATEGORIES } from "@/lib/constant";
import SearchBar from "@/components/search-bar";
import AddResourceModal from "@/components/add-resource-model";
import { ExternalLink, Folder } from "lucide-react";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState(DEV_RESOURCES);

  const handleAdd = (newResource: any) => {
    setResources([newResource, ...resources]);
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Resources Vault</h1>
          <p className="text-slate-500 font-medium mt-1">Your personal collection of tools and docs.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar onSearch={setSearchTerm} />
          <AddResourceModal onAdd={handleAdd} />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 w-fit rounded-2xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
              activeCategory === cat 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div key={item.id} className="dev-card p-6 flex flex-col justify-between h-52 group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 bg-blue-50 px-2 py-1 rounded-md">
                    {item.category}
                  </span>
                  <Folder size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 truncate">{item.url}</p>
              </div>
              
              <a 
                href={item.url} 
                target="_blank" 
                className="mt-6 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                Open Link <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No resources found in this category.</p>
        </div>
      )}
    </div>
  );
}