import { Navbar } from "@/components/Navbar";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard, 
  Globe, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Mail,
  Smartphone,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Settings Navigation */}
          <aside className="w-full md:w-64 space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 mb-8 px-2">Settings</h1>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <div className="pt-8 mt-8 border-t border-slate-200">
               <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
               </button>
            </div>
          </aside>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
            
            {activeTab === "general" && (
              <div className="space-y-10 animate-fade-in">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                      <input type="text" defaultValue="Manpreet Singh" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Business Name</label>
                      <input type="text" defaultValue="Brew Masters AI" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                      <input type="email" readOnly defaultValue="manpreet@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Info className="w-3 h-3" /> To change email, contact support.</p>
                    </div>
                  </div>
                </section>

                <section className="pt-10 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Regional Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <div className="flex items-center gap-3">
                         <Globe className="w-5 h-5 text-primary" />
                         <div>
                            <p className="text-sm font-bold">Language</p>
                            <p className="text-xs text-slate-500">System language for dashboard</p>
                         </div>
                       </div>
                       <Button variant="ghost" size="sm" className="font-bold text-primary">English (US)</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/50 border border-slate-100">
                       <div className="flex items-center gap-3">
                         <Smartphone className="w-5 h-5 text-purple-500" />
                         <div>
                            <p className="text-sm font-bold">Timezone</p>
                            <p className="text-xs text-slate-500">Automatically detected</p>
                         </div>
                       </div>
                       <Button variant="ghost" size="sm" className="font-bold text-slate-500">GMT +5:30</Button>
                    </div>
                  </div>
                </section>

                <div className="pt-6 flex justify-end gap-3">
                   <Button variant="ghost" className="rounded-xl px-6">Cancel</Button>
                   <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl px-8 shadow-lg shadow-primary/20">Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8 animate-fade-in">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Notification Preferences</h3>
                    <p className="text-slate-500 text-sm">Control how and when we reach out to you.</p>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { title: "Product Updates", desc: "News about new AI models and features.", icon: Zap, checked: true },
                      { title: "Weekly Insights", desc: "A summary of your site's performance.", icon: BarChart3, checked: false },
                      { title: "Security Alerts", desc: "Important notices about your account.", icon: Shield, checked: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                               <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{item.title}</p>
                               <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                         </div>
                         <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${item.checked ? "bg-primary" : "bg-slate-200"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.checked ? "translate-x-6" : "translate-x-0"}`} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab !== "general" && activeTab !== "notifications" && (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                 </div>
                 <h4 className="font-bold text-slate-900">Feature coming soon</h4>
                 <p className="text-sm text-slate-500 max-w-xs mt-2">We're finalizing the {activeTab} settings module. Check back in a few days!</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

// Mock Lucide components not imported in snippet
const Zap = ({ className }: { className?: string }) => <div className={className}>⚛</div>;
const BarChart3 = ({ className }: { className?: string }) => <div className={className}>📊</div>;

export default Settings;
