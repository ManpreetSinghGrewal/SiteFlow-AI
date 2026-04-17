import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Calendar, ShieldCheck, Zap, Award, BarChart3, ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {!user ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-bold">Please sign in to view your profile</h2>
            <Button 
              className="mt-6 bg-blue-600 text-white rounded-xl"
              onClick={() => window.location.href = "/"}
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Avatar & Quick Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary mx-auto flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl shadow-primary/20">
                  {user.email?.[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.email?.split('@')[0]}</h2>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                
                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Joined March 2024</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Verified Account</span>
                  </div>
                </div>

                <Button className="w-full mt-8 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12">
                  Edit Profile
                </Button>
              </div>

              <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                 <Zap className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-10 rotate-12" />
                 <h3 className="text-lg font-bold mb-2">Pro Plan</h3>
                 <p className="text-blue-100 text-sm mb-6 leading-relaxed">Unlock unlimited AI generations and custom domains.</p>
                 <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 rounded-xl backdrop-blur-md">
                   Upgrade Now
                 </Button>
              </div>
            </div>

            {/* Right Column: Stats & Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Total Sites Built</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900">12</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">+2 this week</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">AI Tokens Used</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-2xl font-bold text-slate-900">4.2k</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full mb-1">of 10k allowance</span>
                  </div>
                </div>
              </div>

              {/* Achievement / Info Cards */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-slate-900 px-2">Account Activity</h3>
                 
                 {[
                   { title: "Brew Masters Coffee published", time: "2 hours ago", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                   { title: "New site 'TechFlow' created", time: "1 day ago", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
                   { title: "Plan upgraded to Pro", time: "3 days ago", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.time}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                   </div>
                 ))}
              </div>

              {/* Support CTA */}
              <div className="bg-slate-900 rounded-3xl p-8 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold mb-1">Need specialized help?</h4>
                  <p className="text-slate-400 text-sm">Our expert designers can polish your AI site.</p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl">Contact Experts</Button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
