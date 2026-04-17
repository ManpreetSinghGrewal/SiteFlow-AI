import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Globe } from "lucide-react";
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
  const isBuilder = location.pathname === "/builder";

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl w-full mx-auto bg-transparent z-50">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group" 
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <img src="/siteflow-logo.png" alt="SiteFlow AI" className="w-6 h-6 object-cover" />
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight">SiteFlow AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a 
          href="/" 
          className={`transition-colors hover:text-gray-900 ${isHome ? "text-gray-900 font-semibold" : "text-gray-500"}`}
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
        >
          Home
        </a>
        <a 
          href="/about" 
          className={`transition-colors hover:text-gray-900 ${isAbout ? "text-gray-900 font-semibold" : "text-gray-500"}`}
          onClick={(e) => { e.preventDefault(); navigate("/about"); }}
        >
          About Us
        </a>
        <a 
          href="/#how-it-works" 
          className="transition-colors hover:text-gray-900 text-gray-500"
        >
          How it works
        </a>
      </div>

      <div className="flex items-center gap-4">
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
                  <Button className="rounded-full px-5">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            {user ? "Launch Builder" : "Get started"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
}
