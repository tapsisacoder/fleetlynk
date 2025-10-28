import { Sparkles } from "lucide-react";

export const EconomicsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-muted/30 to-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-accent/10 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full mb-6 font-bold text-sm">
              THE ECONOMICS OF SOFTWARE-FIRST
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
              Hardware Costs Thousands. Software Costs Nothing. (For Now.)
            </h2>

            {/* Body */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Here's the truth about fleet management costs:
              </p>

              <p>
                <strong className="text-foreground">Traditional GPS hardware?</strong> You're looking at thousands per truck. Installation. Maintenance. Replacements when drivers "accidentally" break them.
              </p>

              <p>
                <strong className="text-foreground">LynkFleet?</strong> Software runs on phones your drivers already have. No devices to buy. No installation crews. No hardware headaches.
              </p>

              <p>
                The pilot phase is <strong className="text-accent">100% free</strong>. When we launch commercially, we'll keep it affordable through flexible invoicing—because we're building for African fleets, not Silicon Valley budgets.
              </p>

              <p className="text-foreground font-medium">
                You'll help us figure out fair pricing. That's the deal.
              </p>
            </div>

            {/* Callout box */}
            <div className="mt-8 p-6 bg-gradient-to-r from-accent/5 to-accent/10 border-l-4 border-accent rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-primary mb-1">Rory's Insight:</p>
                  <p className="text-sm text-muted-foreground italic">
                    The best way to compete isn't to be slightly cheaper. It's to change the game entirely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
