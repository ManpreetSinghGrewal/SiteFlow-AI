import { useNavigate } from "react-router-dom";
import { Globe, ChevronRight, CheckCircle2, Sparkles, Star, MapPin, Clock, TrendingUp, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 via-white to-white flex flex-col items-center">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-lg text-gray-900 tracking-tight">SiteFlow AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/builder")}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98]"
          >
            Get started
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full flex flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 animate-[pulse_3s_ease-in-out_infinite]">
          <Globe className="w-7 h-7 text-white" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center leading-[1.1] tracking-tight max-w-4xl">
          Build a website that{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            understands
          </span>{" "}
          your business
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-gray-500 text-center max-w-2xl leading-relaxed">
          From your services to your story, our AI creates a website that reflects 
          how your business actually works.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/builder")}
          className="mt-10 group flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-full text-base font-semibold text-gray-900 shadow-sm hover:shadow-xl hover:border-gray-300 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
        >
          <Sparkles className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform duration-300" />
          Generate My Website
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Ready in 2 minutes
          </span>
        </div>
      </header>

      {/* Floating Video Frame */}
      <section id="how-it-works" className="w-full max-w-5xl px-6 mb-32 -mt-4">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white p-2">
          {/* Browser-like Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 rounded-t-xl border-b border-gray-100">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 max-w-md mx-auto h-6 bg-white border border-gray-200 rounded-lg flex items-center px-3 text-[10px] text-gray-400 font-medium">
              <Globe className="w-2.5 h-2.5 mr-2 opacity-50" />
              siteflow.ai/demo
            </div>
          </div>
          
          {/* Video Container (Replace src with your video file) */}
          <div className="aspect-video bg-gray-100 rounded-b-xl flex items-center justify-center group cursor-pointer relative">
            <video 
              className="w-full h-full object-cover"
              controls={false}
              autoPlay
              muted
              loop
              playsInline
            >
              {/* Replace the next line with <source src="/your-video.mp4" type="video/mp4" /> */}
              <source src="https://assets.mixkit.co/videos/preview/mixkit-working-with-a-laptop-outside-4133-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors pointer-events-none" />
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section id="pricing" className="w-full max-w-5xl px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: "10,000+", label: "Websites created", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
            { value: "4.9/5", label: "Average rating", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { value: "2 min", label: "Average build time", icon: Clock, color: "text-cyan-500", bg: "bg-cyan-50" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h4>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Header */}
        <div id="features" className="mt-40 text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Why local businesses choose SiteFlow
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Our AI understands what makes your business unique and builds a website that 
            actually converts visitors into customers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "AI That Gets You",
              desc: "Tell us about your business in plain English. Our AI understands context, not just keywords.",
              icon: Sparkles,
              color: "bg-blue-500"
            },
            {
              title: "Built to Convert",
              desc: "Every element is optimized based on what actually works for local businesses like yours.",
              icon: TrendingUp,
              color: "bg-blue-400"
            },
            {
              title: "Your Customers First",
              desc: "Clean design that builds trust and makes it easy for customers to take action.",
              icon: Users,
              color: "bg-blue-600"
            }
          ].map((feature) => (
            <div key={feature.title} className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className={`w-14 h-14 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h5 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h5>
              <p className="text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center pb-32">
           <button
            onClick={() => navigate("/builder")}
            className="group flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-full text-lg font-bold shadow-2xl shadow-gray-900/40 hover:scale-105 active:scale-95 transition-all mx-auto"
          >
            Start Building Free
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-bold text-gray-900 tracking-tight">SiteFlow AI</span>
              </div>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                Empowering local businesses with intelligent websites generated in minutes.
              </p>
            </div>
            {/* Simple footer links */}
            <div>
              <h6 className="font-bold text-gray-900 mb-6">Product</h6>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Builder</a></li>
                <li><a href="#" className="hover:text-primary">Templates</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-gray-900 mb-6">Company</h6>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} SiteFlow AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
