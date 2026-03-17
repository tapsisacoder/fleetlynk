import { CheckCircle2, Flame } from "lucide-react";

export const FoundingProgramSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white to-primary/5 rounded-2xl shadow-xl p-8 md:p-12 border border-primary/10 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full mb-6 font-bold text-sm">
              FOUNDING FLEET PROGRAM
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Limited Spots. Unlimited Input.
            </h2>

            {/* Body */}
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p className="text-lg">
                We're not looking for 1,000 users. We're looking for <strong className="text-foreground">15-20 fleet managers</strong> who'll help us build this right.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div>
                  <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    You get:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Free access through the entire pilot (January–June 2026)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Direct WhatsApp line to the founders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Your feature requests prioritized</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>First look at new tools (route optimization, driver scoring, predictive maintenance, and more)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Founding member pricing when we launch commercially</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    We get:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Honest feedback (the brutal kind)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Real-world testing in SA/Zimbabwe conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Proof that software-first works</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-foreground font-medium text-lg">
                It's not a trial. It's a partnership.
              </p>
            </div>

            {/* Urgency */}
            <div className="flex items-center justify-center gap-2 text-accent font-bold animate-pulse-subtle">
              <Flame className="w-5 h-5" />
              <span>Applications closing when we hit 20</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
