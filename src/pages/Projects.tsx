import { Navbar } from "@/components/Navbar";
import { Search, Plus, ExternalLink, Settings2, Trash2, Clock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  createdAt: string;
  status: "published" | "draft";
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Brew Masters Coffee",
    type: "Café & Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-03-15",
    status: "published",
  },
  {
    id: "2",
    name: "Green Scapes Landing",
    type: "Landscaping",
    thumbnail: "https://images.unsplash.com/photo-1558171813-2264205b7a67?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-03-12",
    status: "draft",
  },
  {
    id: "3",
    name: "TechFlow SaaS",
    type: "Business Service",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-03-10",
    status: "published",
  },
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Projects</h1>
            <p className="text-slate-500 mt-2">Manage and edit your AI-generated websites.</p>
          </div>
          <Button 
            onClick={() => navigate("/builder")}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6 h-auto shadow-lg shadow-primary/20 group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Site
          </Button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your projects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-10 px-4 border-slate-200 text-slate-600">All</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-10 px-4 border-slate-200 text-slate-600">Published</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-10 px-4 border-slate-200 text-slate-600">Drafts</Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={project.thumbnail} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.status === "published" 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                      : "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full">
                    <ExternalLink className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-full">
                    <Settings2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
                  <Globe className="w-3 h-3" />
                  {project.type}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 truncate">{project.name}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;
