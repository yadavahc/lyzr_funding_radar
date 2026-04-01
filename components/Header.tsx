import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BarChart3, Search, Rocket, Sparkles, Menu, X, Home, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/landing", label: "Home", icon: Home },
    { href: "/aether-flow", label: "Flow", icon: Sparkles },
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/stats", label: "Analytics", icon: TrendingUp },
    { href: "/visualizer", label: "Visualizer", icon: Sparkles },
    { href: "/search", label: "Search", icon: Search },
    { href: "/startups", label: "Startups", icon: Rocket },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-all duration-300" 
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-105">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                AI Funding Radar
              </p>
              <p className="text-xs text-gray-400">Market Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium 
                    transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg border border-violet-500/30 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/20 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="max-w-7xl mx-auto space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium 
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-white/10 text-white border border-violet-500/30"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
