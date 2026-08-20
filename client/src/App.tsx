import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import Club from "./pages/Club";
import Forum from "./pages/Forum";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Article from "@/pages/Article";
import Submit from "@/pages/Submit";
import ManusLoginRedirect from "./pages/ManusLoginRedirect";
import { useEffect } from "react";

function useSmoothAnchorScrolling() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target === "_blank") return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const destination = document.querySelector(hash);
      if (!destination) return;
      event.preventDefault();
      destination.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/auth/login"} component={ManusLoginRedirect} />
      <Route path={"/catalogue"} component={Catalogue} />
      <Route path={"/club"} component={Club} />
      <Route path={"/forum"} component={Forum} />
      <Route path={"/about"} component={About} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/article/:slug"} component={Article} />
      <Route path={"/submit"} component={Submit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  useSmoothAnchorScrolling();
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
