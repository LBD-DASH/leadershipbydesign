import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkshopCardProps {
  workshopKey: 'clarity' | 'motivation' | 'leadership';
  title: string;
  duration: string;
  summary: string;
  delivers: string[];
  isRecommended: boolean;
  onFindOutMore: (workshopKey: 'clarity' | 'motivation' | 'leadership') => void;
}

const icons = {
  clarity: Target,
  motivation: Zap,
  leadership: Users
};

const workshopRoutes = {
  clarity: '/workshops/alignment',
  motivation: '/workshops/motivation',
  leadership: '/workshops/leadership'
};

export default function WorkshopCard({
  workshopKey,
  title,
  duration,
  summary,
  delivers,
  isRecommended,
  onFindOutMore
}: WorkshopCardProps) {
  const navigate = useNavigate();
  const Icon = icons[workshopKey];

  const handleFindOutMore = () => {
    navigate(workshopRoutes[workshopKey]);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300",
        isRecommended
          ? "bg-primary/5 border-2 border-primary shadow-lg scale-[1.02]"
          : "bg-card border border-border hover:border-primary/30 hover:shadow-md"
      )}
    >
      {isRecommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
          Recommended for your team
        </Badge>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "p-3 rounded-xl",
          isRecommended ? "bg-primary/10" : "bg-muted"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            isRecommended ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "text-lg sm:text-xl font-semibold",
            isRecommended ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
        {summary}
      </p>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
          This workshop delivers:
        </p>
        <ul className="space-y-2">
          {delivers.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className={cn(
                "w-4 h-4 flex-shrink-0",
                isRecommended ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <Button
          variant={isRecommended ? "default" : "outline"}
          className="w-full group"
          onClick={handleFindOutMore}
        >
          Find out more
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
