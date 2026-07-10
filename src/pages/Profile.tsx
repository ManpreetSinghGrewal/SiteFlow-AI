import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Mail, Calendar, ShieldCheck, Zap, Award, BarChart3, ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, type Profile } from "@/lib/profiles";
import { listProjects } from "@/lib/projects";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<{ name: string; created_at: string; status: string }[]>([]);

  useEffect(() => {
    if (!user) return;

    getProfile(user.id)
      .then(setProfile)
      .catch(() => null);

    listProjects()
      .then((projects) => {
        setProjectCount(projects.length);
        setRecentProjects(
          projects.slice(0, 3).map((p) => ({
            name: p.name,
            created_at: p.created_at,
            status: p.status,
          }))
        );
      })
      .catch(() => null);
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary mx-auto flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl shadow-primary/20">
                {displayName[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              <p className="text-sm text-slate-500 mt-1">{user?.email}</p>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined {joinedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Verified Account</span>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12"
                onClick={() => navigate("/settings")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <Zap className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-10 rotate-12" />
              <h3 className="text-lg font-bold mb-2">Pro Plan</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Unlock unlimited AI generations and custom domains.
              </p>
              <Button
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl backdrop-blur-md"
              >
                Upgrade Now
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-500">Total Sites Built</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{projectCount}</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-500">Account Status</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900">Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 px-2">Recent Activity</h3>

              {recentProjects.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                  No projects yet.{" "}
                  <button className="text-primary font-medium hover:underline" onClick={() => navigate("/builder")}>
                    Create your first site
                  </button>
                </div>
              ) : (
                recentProjects.map((project, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors"
                    onClick={() => navigate("/projects")}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          project.status === "published" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {project.name} {project.status === "published" ? "published" : "created"}
                        </p>
                        <p className="text-xs text-slate-400">{formatRelativeTime(project.created_at)}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold mb-1">Need specialized help?</h4>
                <p className="text-slate-400 text-sm">Our expert designers can polish your AI site.</p>
              </div>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl">Contact Experts</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
