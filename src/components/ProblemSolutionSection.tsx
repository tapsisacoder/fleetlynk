import { AlertTriangle, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const ProblemItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 mb-2">
    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
    <span className="text-muted-foreground">{text}</span>
  </li>
);

const SolutionItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 mb-2">
    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
    <span className="text-foreground">{text}</span>
  </li>
);

export const ProblemSolutionSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-fade-in-up">
          The Hardware Trap vs. The Software Revolution
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* The Old Way */}
          <div className="bg-white rounded-lg p-8 shadow-md opacity-75 animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h3 className="text-2xl font-bold text-foreground">The Hardware Trap</h3>
            </div>
            <ul className="space-y-2">
              <ProblemItem text="Buy devices. Pray they work." />
              <ProblemItem text="Drivers 'lose' them. You pay again." />
              <ProblemItem text="Hardware breaks. You're blind." />
              <ProblemItem text="Locked into one vendor. Forever." />
              <ProblemItem text="Work IN your business. Not ON it." />
            </ul>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center absolute left-1/2 transform -translate-x-1/2 animate-pulse-subtle">
            <ArrowRight className="w-12 h-12 text-accent" />
          </div>

          {/* The New Way */}
          <div className="bg-gradient-to-br from-white to-accent/5 rounded-lg p-8 shadow-lg border-2 border-accent/20 animate-fade-in-up delay-200">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <h3 className="text-2xl font-bold text-primary">The Software Revolution</h3>
            </div>
            <ul className="space-y-2">
              <SolutionItem text="Use phones drivers already have." />
              <SolutionItem text="GPS auto-tracks. No manual logs." />
              <SolutionItem text="Cloud-based. Always working." />
              <SolutionItem text="You own your data. Switch anytime." />
              <SolutionItem text="Work ON your business. Finally." />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
