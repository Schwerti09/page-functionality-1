import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/home";
import NotFound from "@/pages/not-found";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Account = lazy(() => import("@/pages/account"));
const Blog = lazy(() => import("@/pages/blog"));
const FAQ = lazy(() => import("@/pages/faq"));
const Team = lazy(() => import("@/pages/team"));
const Docs = lazy(() => import("@/pages/docs"));
const Guide = lazy(() => import("@/pages/guide"));
const Impressum = lazy(() => import("@/pages/legal").then(m => ({ default: m.Impressum })));
const Datenschutz = lazy(() => import("@/pages/legal").then(m => ({ default: m.Datenschutz })));
const AGB = lazy(() => import("@/pages/legal").then(m => ({ default: m.AGB })));
const DeployFramework = lazy(() => import("@/pages/deploy-framework"));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/account" component={Account} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={Blog} />
        <Route path="/faq" component={FAQ} />
        <Route path="/team" component={Team} />
        <Route path="/about" component={Team} />
        <Route path="/docs" component={Docs} />
        <Route path="/guide" component={Guide} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/agb" component={AGB} />
        <Route path="/deploy/:framework" component={DeployFramework} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
