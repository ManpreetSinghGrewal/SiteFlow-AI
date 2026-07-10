import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Search, Plus, ExternalLink, Settings2, Trash2, Clock, Globe, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { listProjects, deleteProject, type Project } from "@/lib/projects";
import { toast } from "sonner";

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => toast.error(err.message || "Failed to load projects"))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        (project.business_type?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (project: Project) => {
    if (!project.html_content) {
      toast.error("No website content saved for this project");
      return;
    }
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(project.html_content);
      win.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
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

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "published", "draft"] as const).map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg h-10 px-4 border-slate-200 capitalize ${
                  statusFilter === filter ? "bg-primary/10 text-primary border-primary/30" : "text-slate-600"
                }`}
              >
                {filter === "all" ? "All" : filter === "published" ? "Published" : "Drafts"}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900">No projects yet</h2>
            <p className="text-slate-500 mt-2 mb-6">Create your first AI-generated website to get started.</p>
            <Button onClick={() => navigate("/builder")} className="rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Create New Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={project.thumbnail_url || DEFAULT_THUMBNAIL}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "published"
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-slate-100 rounded-full"
                      onClick={() => handleView(project)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90 rounded-full"
                      onClick={() => navigate(`/builder?project=${project.id}`)}
                    >
                      <Settings2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
                    <Globe className="w-3 h-3" />
                    {project.business_type || "Website"}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 truncate">{project.name}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <button
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
