import { Smartphone, LayoutDashboard, MessageCircle } from "lucide-react";

const ToolCard = ({
  icon: Icon,
  title,
  description,
  delay = ""
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: string;
}) => {
  return (
    <div className={`bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${delay}`}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-4 bg-accent/10 rounded-full group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-14 h-14 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const ThreeToolsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up">
            Three Tools. One Truth.
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up delay-100">
            Stop juggling WhatsApp, Excel, and guesswork.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          <ToolCard
            icon={Smartphone}
            title="Driver App"
            description="Trips log automatically. GPS tracks routes. Drivers just drive."
            delay="delay-100"
          />
          <ToolCard
            icon={LayoutDashboard}
            title="Fleet Dashboard"
            description="One screen. All trucks. All data. Real-time. Always."
            delay="delay-200"
          />
          <ToolCard
            icon={MessageCircle}
            title="WhatsApp Alerts"
            description="Updates come to you. No app-switching. Stay in control."
            delay="delay-300"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground animate-fade-in-up delay-400">
          More features launching monthly. You'll help decide what we build next.
        </p>
      </div>
    </section>
  );
};
