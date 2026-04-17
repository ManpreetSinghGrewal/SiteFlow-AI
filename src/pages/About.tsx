import { useNavigate } from "react-router-dom";
import { ChevronRight, Github, Linkedin, Mail, Twitter, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Sana Pawa",
    role: "Co-founder & Product Lead",
    bio: "Driving the vision for effortless AI-powered website creation for every business owner.",
  },
  {
    name: "Manpreet Singh",
    role: "Co-founder & Engineering Lead",
    bio: "Architecting the scalable AI systems that power SiteFlow's instant generator.",
  },
  {
    name: "Pushkar Verma",
    role: "AI Research Engineer",
    bio: "Pushing the boundaries of what's possible with LLMs and automated web design.",
  },
  {
    name: "Shagun",
    role: "Lead UI/UX Designer",
    bio: "Crafting the elegant design systems and layouts that make generated sites beautiful.",
  },
  {
    name: "Kheetansh Bansal",
    role: "Frontend Architect",
    bio: "Ensuring every generated site is lightning fast, responsive, and cross-browser compatible.",
  },
  {
    name: "Riya Duggal",
    role: "Marketing & Strategy Lead",
    bio: "Bridging the gap between groundbreaking AI tech and the local businesses who need it.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Navigation */}
      <Navbar />

      <main className="w-full max-w-7xl px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            The minds behind <span className="text-primary">SiteFlow AI</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate engineers, designers, and strategists on a mission to 
            make high-quality web presence accessible to every local business through the power of AI.
          </p>
        </section>

        {/* Team Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {team.map((member) => (
            <div 
              key={member.name}
              className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                   <div className="w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/20" />
                   <span className="absolute font-bold text-2xl text-primary/60">{member.name[0]}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                <p className="text-sm font-semibold text-primary mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {member.bio}
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <a href="#" className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"><Github className="w-4 h-4" /></a>
                  <a href="#" className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"><Linkedin className="w-4 h-4" /></a>
                  <a href="#" className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all"><Mail className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Final CTA */}
        <section className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">
            Join the future of web building
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto relative z-10">
            Ready to see what SiteFlow AI can build for you? It only takes 2 minutes.
          </p>
          <button
            onClick={() => navigate("/builder")}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full text-lg font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
          >
            Get Started for Free
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      </main>

      {/* Footer (Simplified) */}
      <footer className="w-full py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
             <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-6 h-6 rounded-md opacity-80" />
             <span className="font-bold text-slate-900">SiteFlow AI</span>
          </div>
          <p>© {new Date().getFullYear()} SiteFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
