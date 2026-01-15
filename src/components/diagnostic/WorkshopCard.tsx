import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, ArrowRight, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import alignmentImage from "@/assets/workshop-alignment.jpg";
import motivationImage from "@/assets/workshop-motivation.jpg";
import leadershipImage from "@/assets/workshop-leadership.jpg";

interface ShiftSkill {
  skill: string;
  detail: string;
}

interface WorkshopCardProps {
  workshopKey: 'clarity' | 'motivation' | 'leadership';
  title: string;
  duration: string;
  summary: string;
  delivers: string[];
  includes?: string[];
  shiftSkills?: ShiftSkill[];
  isRecommended: boolean;
  onFindOutMore: (workshopKey: 'clarity' | 'motivation' | 'leadership') => void;
}

const workshopImages = {
  clarity: alignmentImage,
  motivation: motivationImage,
  leadership: leadershipImage
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
  includes,
  shiftSkills,
  isRecommended,
  onFindOutMore
}: WorkshopCardProps) {
  const navigate = useNavigate();

  const handleFindOutMore = () => {
    navigate(workshopRoutes[workshopKey]);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300",
        isRecommended
          ? "bg-primary/5 border-2 border-primary shadow-lg scale-[1.02]"
          : "bg-card border border-border hover:border-primary/30 hover:shadow-md"
      )}
    >
      {isRecommended && (
        <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1">
          Recommended for your team
        </Badge>
      )}

      {/* Workshop Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={workshopImages[workshopKey]} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className={cn(
            "text-lg sm:text-xl font-semibold mb-2",
            isRecommended ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
        </div>

        <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
          {summary}
        </p>

        {/* SHIFT Skills Badges */}
        {shiftSkills && shiftSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              SHIFT™ Skills Developed:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shiftSkills.map((item, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    isRecommended 
                      ? "border-primary/50 bg-primary/10 text-primary" 
                      : "border-border bg-muted/50 text-foreground"
                  )}
                >
                  {item.skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
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

        {includes && includes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
              Includes:
            </p>
            <ul className="space-y-2">
              {includes.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <FileText className={cn(
                    "w-4 h-4 flex-shrink-0",
                    isRecommended ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isRecommended ? "text-primary" : "text-foreground"
                  )}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
    </div>
  );
}
