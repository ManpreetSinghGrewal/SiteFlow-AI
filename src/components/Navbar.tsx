import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthDialog } from "./auth/AuthDialog";
import { UserAccountNav } from "./auth/UserAccountNav";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isProfile = location.pathname === "/profile";
  const isProjects = location.pathname === "/projects";
  const isBuilder = location.pathname === "/builder";

  const GITHUB_REPO_URL = "https://github.com/ManpreetSinghGrewal/SiteFlow-AI";

  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("siteflow_auth_token");
  const isAuth = !!user || (isLoading && hasToken);

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl w-full mx-auto bg-transparent z-50">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group" 
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors animate-logo-pulse">
          <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-6 h-6 object-cover" />
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight">SiteFlow AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a 
          href="/" 
          className={`transition-colors hover:text-gray-900 ${isHome ? "text-gray-900 font-semibold active-gradient-link" : "text-gray-500"}`}
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
        >
          Home
        </a>
        <a 
          href="/about" 
          className={`transition-colors hover:text-gray-900 ${isAbout ? "text-gray-900 font-semibold active-gradient-link" : "text-gray-500"}`}
          onClick={(e) => { e.preventDefault(); navigate("/about"); }}
        >
          About Us
        </a>
        {isAuth && (
          <>
            <a 
              href="/projects" 
              className={`transition-colors hover:text-gray-900 ${isProjects ? "text-gray-900 font-semibold active-gradient-link" : "text-gray-500"}`}
              onClick={(e) => { e.preventDefault(); navigate("/projects"); }}
            >
              Projects
            </a>
            <a 
              href="/profile" 
              className={`transition-colors hover:text-gray-900 ${isProfile ? "text-gray-900 font-semibold active-gradient-link" : "text-gray-500"}`}
              onClick={(e) => { e.preventDefault(); navigate("/profile"); }}
            >
              Profile
            </a>
          </>
        )}
        <a 
          href="/#how-it-works" 
          className="transition-colors hover:text-gray-900 text-gray-500"
        >
          How it works
        </a>
      </div>

      <div className="flex items-center gap-4">
        {/* GitHub Repository Link Icon */}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="View GitHub Repository"
        >
          <Github className="w-5 h-5" />
        </a>

        {!isLoading && (
          <>
            {user ? (
              <UserAccountNav />
            ) : (
              <div className="flex items-center gap-2">
                <AuthDialog>
                  <Button variant="ghost" className="text-sm font-medium">
                    Log in
                  </Button>
                </AuthDialog>
                <AuthDialog>
                  <Button className="rounded-full px-5 btn-glowing-border">
                    Sign up
                  </Button>
                </AuthDialog>
              </div>
            )}
          </>
        )}
        
        {/* Conditional Builder Button */}
        {!isBuilder && (
          <button
            onClick={() => navigate("/builder")}
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-all active:scale-[0.98] btn-glowing-border"
          >
            {isAuth ? "Launch Builder" : "Get started"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}
