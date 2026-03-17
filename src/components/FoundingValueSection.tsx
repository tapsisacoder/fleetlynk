import { Gift, Lightbulb, Crown } from "lucide-react";

const ValueCard = ({ 
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
    <div className={`bg-card rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in-up ${delay}`}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-accent/10 rounded-full">
          <Icon className="w-12 h-12 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const FoundingValueSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up">
            You're Not Just Testing Software.
            <br />
            You're Building the Future of African Logistics.
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up delay-100">
            As a Founding Fleet member, you get more than free software. You get a seat at the table.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          <ValueCard
            icon={Gift}
            title="100% Free Access"
            description="Pilot phase costs nothing. No tricks. No credit card."
            delay="delay-100"
          />
          <ValueCard
            icon={Lightbulb}
            title="Shape the Product"
            description="We build what YOU need. Direct line to the founders."
            delay="delay-200"
          />
          <ValueCard
            icon={Crown}
            title="Founder Privileges"
            description="First to get new features. Priority support. Forever."
            delay="delay-300"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground italic animate-fade-in-up delay-400">
          Think of it as co-creating, not beta testing.
        </p>
      </div>
    </section>
  );
};
