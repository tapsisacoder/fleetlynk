import { Logo } from "./Logo";

export const Navigation = () => {
  const scrollToForm = () => {
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("how-it-works")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo("the-platform")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              The Platform
            </button>
            <button onClick={() => scrollTo("pricing")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </button>
          </div>

          <button
            onClick={scrollToForm}
            className="bg-accent text-accent-foreground px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            REQUEST ACCESS
          </button>
        </div>
      </div>
    </nav>
  );
};
